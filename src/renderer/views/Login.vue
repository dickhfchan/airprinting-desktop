<template lang="pug">
.login-page.start-page.full-screen
  img.start-logo(ref="logo" :style="logoStyle" src="@/assets/img-export/4x/start-logo.png")
  .login-card.card(v-if="btnsVisible" ref="loginCard")
    div
    .user-avatar
      .default-user-avatar
        v-icon person
    GoogleAndFacebookSignInBtns.mt-4(@success="$router.push({name: 'home'})")
    v-btn.mrs(v-for="name in printerNames" @click="print(name)") {{name}}
</template>

<script>
import * as hp from 'helper-js'
import anime from 'animejs'
import GoogleAndFacebookSignInBtns from '@/components/GoogleAndFacebookSignInBtns'
import Printer from '@/printer/Printer.js'
import PdfPrintJob from '@/printer/PdfPrintJob.js'
import PrintStatus from '@/printer/PrintStatus.js'
import electron from 'electron'
const {dialog} = electron.remote

let first = true

export default {
  components: {GoogleAndFacebookSignInBtns},
  data() {
    return {
      logoStyle: null,
      btnsVisible: false,
      printerNames: null,
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    playAnimate(opt = {}) {
      const {logo} = this.$refs
      const {x, y} = hp.offsetToPosition(logo, hp.getOffset(logo))
      const translateY = {value: -155}
      if (opt.immediate) {
        translateY.duration = 0
      }
      const logoAnime = anime({
        targets: logo,
        translateY,
        easing: 'easeInOutQuad',
      })
      logoAnime.complete = () => {
        logo.style.transform = null
        this.btnsVisible = true
        this.$nextTick(() => {
          const opacity = {value: 1, duration: 800}
          if (opt.immediate) {
            opacity.duration = 0
          }
          anime({
            targets: this.$refs.loginCard,
            opacity,
            easing: 'easeInOutQuad',
          })
        })
      }
    },
    async print(name) {
      // get info of default printer
      const printer = new Printer(name);
      await printer.init();
      console.log("info of printer:");
      console.log("  Name: " + printer.printerName);
      console.log("  Support color: " + printer.supportsColor);
      console.log("  Support duplex: " + printer.canDuplex); // support double sided
      console.log("  Paper sizes: " + printer.paperSizes.join(", "));
      console.log("");
      // print a pdf
      const files = dialog.showOpenDialog({
        properties: [ 'openFile'],
        filters: [
          { name: 'PDF', extensions: ['pdf'] },
        ],
      })
      if (!files) {
        return
      }
      const pdfFileName = files[0]
      const job = new PdfPrintJob(pdfFileName);
      await job.init();
      console.log("There are " + job.pageCount + " pages in " + job.pdfFilePath);
      job.printerName = name;   // change printer
      job.range = "2-5";  // change print range to page 2-3 only
                          // if you want to print all, set job.range="all";
      job.duplex = true;  // double sided
      job.paperSize = "A4";   // paper size
                              // make sure the paper size is supported by the selected printer
      await job.print();
      console.log("trigged the printing job");
      console.log("document name is " + job.documentName);

      // check printing status
      while (true){
          const status = new PrintStatus(job.printerName, job.documentName);
          await status.init();
          if (status.completed || status.deleted || status.printed){
              break;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));    // sleep 1s
      }
      alert('printed successfully')
    },
  },
  // created() {},
  async mounted() {
    if (first) {
      await hp.waitTime(500)
      this.playAnimate()
      first = false
    } else {
      this.playAnimate({immediate: true})
    }

    this.printerNames = await Printer.getInstalledPrinterNames()
  },
}
</script>

<style lang="scss">
.login-page{
  .page-inner{
    text-align: center;
    width: 360px;
  }
  .login-card{
    width: 300px;
    padding: 30px;
    padding-bottom: 50px;
    box-sizing: content-box;
    opacity: 0;
  }
  .user-avatar{
    $side: 100px;
    width: $side;
    height: $side;
    border: 1px solid #e2e2e2;
    border-radius: 100%;
    overflow: hidden;
    margin: 0 auto;
    background-color: #eee;
  }
  .default-user-avatar{
    $side: 100%;
    width: $side;
    height: $side;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon{
      color: #ccc;
      font-size: 60px;
    }
  }
}
.start-page{
  background-color: $primary;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.start-logo{
  width: 80%;
  max-width: 300px;
  position: relative;
  top: -30px;
}
</style>
