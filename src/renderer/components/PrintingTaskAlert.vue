<template lang="pug">
.printing-task-alert
  template(v-if="printing")
    v-alert(:value='true', type='info')
      span Printing. Total {{pages}} pages.
    v-progress-linear(:indeterminate='true' color="info")
  v-dialog(v-model="dialog.visible", max-width='500px')
    v-card
      v-card-title
        .headline Choose a printer to print
      v-list
        v-list-tile(v-for="name in printerNames" :key="name" @click="print(name)")
          v-list-tile-content
            v-list-tile-title {{name}}
          v-list-tile-action
            v-icon keyboard_arrow_right
</template>

<script>
import temp from 'temp'
import https from 'https'
import fs from 'fs'
import * as hp from 'helper-js'
import * as ut from '@/plugins/utils'
import Printer from '@/printer/Printer.js'
import PdfPrintJob from '@/printer/PdfPrintJob.js'
import PrintStatus from '@/printer/PrintStatus.js'
// Automatically track and cleanup files at exit
temp.track()

export default {
  components: {},
  data() {
    return {
      printing: false,
      pages: 0,
      order: null,
      dialog: {
        visible: false,
      },
      printerNames: null,
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    async print(printerName) {
      const {order} = this
      const promises = []
      order.pdfs.forEach(pdf => {
        promises.push(new Promise(async (resolve, reject) => {
          const url = ut.getFileUrl.call(this, pdf.file)
          pdf.url = url
          temp.open({prefix: 'tempPdf', 'suffix': '.pdf'}, async (err, info) => {
            if (err) {
              reject(err)
              return
            }
            // save file as temp
            fs.closeSync(info.fd)
            pdf.path = info.path
            const fileData = await downloadFile(url, info.path)
            console.log('file download:', url);
            resolve()
          })
        }))
      })
      try {
        await Promise.all(promises)
      } catch (e) {
        console.warn(e);
        this.$alert('Get file failed')
        return
      }
      try {
        order.pdfs.forEach(pdf => {
          pdf.options.forEach(opt => {
            ut.groupPages(opt.pages).forEach(async group => {
              // todo, can't set copies
              const job = new PdfPrintJob(pdf.path)
              await job.init()
              // console.log("There are " + job.pageCount + " pages in " + job.pdfFilePath);
              job.printerName = printerName   // change printer
              job.range = `${group[0]}-${hp.arrayLast(group)}`;  // change print range, if you want to print all, set job.range="all";
              job.duplex = opt.side === 'double';  // double sided
              job.color = opt.color === 'color';  // color
              job.paperSize = opt.size.toUpperCase()   // paper size, make sure the paper size is supported by the selected printer
              await job.print();
              await waitPrintJobDone(job)
            })
          })
        })
      } catch (e) {
        console.warn(e);
        this.$alert('Print failed')
        return
      }
      this.$notifySuccess('Print successfully')
      // cleanup temp
      let i = 0
      while (true) {
        try {
          temp.cleanupSync()
          console.log('cleanup temp successfully');
          break
        } catch (e) {
          if (i > 1000) {
            console.warn('failed to clean temp');
            break
          }
          await hp.waitTime(300)
          i++
        }
      }
    },
  },
  // created() {},
  mounted() {
    const socket = ut.getSocket(`${this.$store.state.socket}/desktop`)
    this.socket = socket
    socket.on('print_request_start', async (message) => {
      // const order = this.order = await this.$api.post('order/select', {id: message.id})
      // this.printing = true
      // let pages = 0
      // order.pdfs.forEach(pdf => {
      //   pdf.options.forEach(opt => {
      //     pages += opt.copies * opt.pages.length
      //   })
      // })
      // this.pages = pages
      const order = await this.$api.post('order/select', {id: message.id})
      this.order = order
      const printerNames = await Printer.getInstalledPrinterNames()
      this.printerNames = printerNames
      this.dialog.visible = true
    })
  },
  beforeDestroy() {
    this.socket && this.socket.disconnect()
  },
}
async function waitPrintJobDone(job) {
  // check printing status
  while (true){
    try {
      const status = new PrintStatus(job.printerName, job.documentName);
      await status.init();
      if (status.completed || status.deleted || status.printed){
          break;
      }
    } catch (e) {
      return
    }
    await hp.waitTime(300)    // sleep
  }
}
async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath)
    https.get(url, response => {
      var stream = response.pipe(file)
      stream.on("finish", function() {
        resolve()
      })
    })
  })
}
</script>

<style lang="scss">
.printing-task-alert{
  position: relative;
  .alert__icon{
    display: none;
  }
  .progress-linear{
    position: absolute;
    bottom: 0;
    margin: 0;
    background-color: #fff;
  }
}
</style>
