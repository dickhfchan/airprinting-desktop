<template lang="pug">
.upload-pdf-page
  .page-body.pa-2
    v-card.printer-info(v-if="printer")
      v-card-text
        h2 Printer info
        div.mt-2
          b Contact:
          span.ml-1 {{printer.address.contactName}}
          span.ml-3 {{printer.address.areaCode}} {{printer.address.phone}}
        .printer-address
            b Address:
            span.ml-1 {{printer.address.address.formattedAddress}}
        div
          b Support:
          span.ml-1 {{printerAttrText('size')}}, {{printerAttrText('color')}}, {{printerAttrText('side')}}
        div
          b Price(per side):
          span.ml-1 $ {{priceRangeText}}
        v-select.pt-0(:items="whenToPrintItems" v-model="whenToPrint" hide-details)
    .subheading.grey--text.mt-2 Files:
    v-card.pdf-card.mt-2(v-for="pdf in pdfs" :key="pdf.id")
      v-card-title
        h3.pdf-title {{pdf.file.name}}
        v-spacer
        v-btn(icon @click="pdf.open=!pdf.open")
          v-icon(color="grey") {{'keyboard_arrow_' + (pdf.open ? 'up' : 'down')}}
        v-btn(icon @click="removePdf(pdf)")
          v-icon(color="grey") close
      transition(name="slide-y-transition")
        .card-body(v-show="pdf.open")
          v-list(subheader)
            v-subheader
              span Print options
              v-spacer
              v-btn.ma-0(color="accent" small @click="addOptions(pdf)") Add options
            v-list-tile(v-for="(item, i) in pdf.options" :key="i" @click="editOptions(item, pdf)")
              v-list-tile-content
                v-list-tile-title Pages: {{pdfOptionsPageText(item, pdf)}}
                v-list-tile-sub-title {{pdfOptionsSupportText(item, pdf)}}
              v-list-tile-action
                v-btn(icon @click.stop="removeOptions(item, pdf)")
                  v-icon(color="grey") close
    .no-files(v-if="pdfs.length === 0") No files uploaded
  //- footer ===================
  .page-footer-placeholder
  v-card.page-footer.px-2
    FilesUploadBtn(@success="uploaded" :extensions="['pdf']" ref="uploadBtn" :maxSize="$store.state.s3.maxSize")
      v-btn(block color="primary") Upload Files
    span &nbsp;
    v-btn(block color="accent" @click="submit"  :loading="submitting")
      span Payment
      span.total-price.ml-1(v-if="totalPrice") ${{totalPrice}}
  //- print options dialog =======================
  v-dialog(v-model="printOptionsDialog.visible" fullscreen='', hide-overlay='', transition='dialog-bottom-transition', scrollable)
    v-card.print-options-card(tile='' v-if="printOptionsDialog.visible")
      v-toolbar.toolbar-style1(dark color='primary' dense)
        v-toolbar-title
          v-btn.ma-0(icon dark @click.native="printOptionsDialog.visible=false")
            v-icon close
          span Print options
      v-card-text
        v-subheader Pages
        //- b :
        .page-btns
          v-btn(
            :color="printOptionsDialogAllPagesChecked ? 'primary' : 'default'"
            @click="printOptionsDialogAllPagesChecked = !printOptionsDialogAllPagesChecked"
          ) All
          v-btn(
            v-for="btn in printOptionsDialog.pageBtns" :key="btn.value"
            :color="btn.checked ? 'primary' : 'default'"
            @click="btn.checked = !btn.checked"
          ) {{btn.value}}
        .print-options.mt-1
          v-select.size-select(:items="availableOptions('size')", label="Size" v-model="printOptionsDialog.options.size" hide-details)
          v-select.color-select.ml-3(:items="availableOptions('color')", label="Color" v-model="printOptionsDialog.options.color" hide-details)
          v-select.side-select.ml-3(:items="availableOptions('side')", label="Side" v-model="printOptionsDialog.options.side" hide-details)
          .mt-2
            v-text-field.copies-input(label="Copies" type="number" v-model.number="printOptionsDialog.options.copies" min="1")
            v-checkbox.fit-to-page-checkbox.ml-3(label="Fit to Page" v-model="printOptionsDialog.options.fitToPage")
        v-btn(color="primary" block @click="savePrintOptions") Save
        .pdf-preview-area
          v-subheader Preview
          #pdfPreviewHolder
          FixedPagination.mt-2(
            size="sm" :max="5" :total="printOptionsDialog.pdf.pageCount"
            :current="printOptionsDialog.previewPage"
            @goToPage="renderPdfPreview($event)"
          )
</template>

<script>
import * as hp from 'helper-js'
import * as pdfUtils from '@/plugins/pdfUtils'
import * as ut from '@/plugins/utils'
import FilesUploadBtn from '@/components/FilesUploadBtn.vue'
import FixedPagination from '@/components/FixedPagination.vue'

export default {
  components: {FilesUploadBtn, FixedPagination},
  data() {
    return {
      optionsInfo: this.$store.state.printerFilterInfo,
      printerId: this.$route.query.id,
      printer: null,
      pdfs: [],
      whenToPrint: 'now', // now, arrived
      whenToPrintItems: [
        {value: 'now', text: 'Print now'},
        {value: 'arrived', text: 'Print when arrived'},
      ],
      submitting: false,
      printOptionsDialog: {
        visible: false,
        mode: null, // null or edit
        options: {
          pages: [],
          size: null,
          color: null,
          side: null,
          copies: 1,
          fitToPage: null,
        },
        pageBtns: [],
        previewPage: 1,
      },
    }
  },
  computed: {
    priceRangeText() {
      const {printer} = this
      if (printer.minPrice === printer.maxPrice) {
        return printer.minPrice
      } else {
        return `${printer.minPrice} - ${printer.maxPrice}`
      }
    },
    totalPrice() {
      let r = 0
      this.pdfs.forEach(pdf => {
        pdf.options.forEach(item => {
          r += this.printer.prices.find(
            v => v.size === item.size && v.color === item.color && v.side === item.side
          ).price * item.copies * item.pages.length
        })
      })
      const [price, commission] = ut.calcPrice.call(this, r)
      return ut.priceAdd(price, commission)
    },
    printOptionsDialogAllPagesChecked: {
      get() {
        return this.printOptionsDialog.pageBtns.every(btn => btn.checked)
      },
      set(value) {
        this.printOptionsDialog.pageBtns.forEach(btn => {
          btn.checked = value
        })
      },
    },
  },
  // watch: {},
  methods: {
    async pull() {
      const data = await this.$api.post('printer/select', {id: this.printerId})
      this.printer = data
    },
    printerAttrText(type) {
      return ut.getPrinterSupport.call(this, type, this.printer[type])
    },
    uploaded(files) {
      this.pdfs = files.filter(file => file.success).map(file => {
        let pdf = this.pdfs.find(v => v.file.id === file.id)
        if (!pdf) {
          pdf = {
            open: true,
            options: [],
            pageCount: null,
          }
        }
        pdf.file = file
        pdf.id = file.id
        if (!pdf.documentPromise) {
          pdf.documentPromise = pdfUtils.getDocumentFromFile(file.file)
          pdf.documentPromise.then(pdfDocument => {
            pdf.pageCount = pdfDocument.numPages
          })
        }
        return pdf
      })
    },
    async removePdf(item) {
      await this.$confirm('Confirm to remove')
      hp.arrayRemove(this.pdfs, item)
      const {uploadBtn} = this.$refs
      this.$refs.uploadBtn.files = uploadBtn.remove(uploadBtn.files.find(v => v.id === item.file.id))
    },
    async addOptions(pdf) {
      const options = {
        copies: 1,
        fitToPage: true,
        pages: [],
      }
      for (const key of ['size', 'color', 'side']) {
        const lastSelectedPrinterOptions = this.$store.state.lastSelectedPrinterOptions || {}
        const value = lastSelectedPrinterOptions[key]
        if (this.printer[key].includes(value)) {
          options[key] = value
        } else {
          options[key] = this.printer[key][0]
        }
      }
      const pageBtns = getPageBtns(pdf.pageCount)
      // check all page default
      pageBtns.forEach(v => {
        v.checked = true
      })
      Object.assign(this.printOptionsDialog, {
        visible: true,
        mode: 'add',
        options,
        pdf,
        pageBtns,
      })
      this.renderPdfPreview(1)
    },
    async editOptions(options, pdf) {
      const pageBtns = getPageBtns(pdf.pageCount, options.pages)
      Object.assign(this.printOptionsDialog, {
        visible: true,
        mode: 'edit',
        options: Object.assign({}, options),
        pageBtns,
        editing: {options, pdf},
        pdf,
      })
      this.renderPdfPreview(1)
    },
    async renderPdfPreview(page) {
      const {pdf} = this.printOptionsDialog
      if (page != null) {
        this.printOptionsDialog.previewPage = page
      }
      const pdfDocument = await pdf.documentPromise
      page = await pdfDocument.getPage(this.printOptionsDialog.previewPage)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      this.$nextTick(() => {
        const pdfPreviewHolder = document.getElementById('pdfPreviewHolder')
        if (this._pdfPreview_canvas) {
          try {
            pdfPreviewHolder.removeChild(this._pdfPreview_canvas)
          } catch (e) {}
        }
        this._pdfPreview_canvas = canvas
        pdfPreviewHolder.appendChild(canvas)
        const width = pdfPreviewHolder.offsetWidth
        const scale = width / page.getViewport(1.0).width
        const viewport = page.getViewport(scale)
        canvas.width = width
        canvas.height = viewport.height
        const renderContext = {
         canvasContext: ctx,
         viewport: viewport
        }
        page.render(renderContext)
      })
    },
    removeOptions(options, pdf) {
      hp.arrayRemove(pdf.options, options)
    },
    pdfOptionsPageText(options, pdf) {
      return ut.pdfOptionPageNumberText(options.pages, pdf.pageCount)
    },
    pdfOptionsSupportText(options, pdf) {
      const text = (type) => this.optionsInfo[type].find(v2 => v2.value === options[type]).text
      let r = `${text('size')}, ${text('color')}, ${text('side')}`
      if (options.fitToPage) {
        r += ', fit to page'
      }
      return r
    },
    // printOptionsDialog ============
    // type: size, color, side
    availableOptions(type) {
      return this.optionsInfo[type].filter(v => this.printer[type].includes(v.value))
    },
    savePrintOptions() {
      const dialog = this.printOptionsDialog
      const pages = []
      dialog.pageBtns.forEach(btn => {
        if (btn.checked) {
          pages.push(btn.value)
        }
      })
      if (pages.length === 0) {
        this.$alert('Please select at least one page.')
        return
      }
      const options = Object.assign({}, dialog.options)
      options.pages = pages
      if (dialog.mode === 'add') {
        dialog.pdf.options.push(options)
      } else {
        // edit
        Object.assign(dialog.editing.options, options)
      }
      dialog.visible = false
    },
    async submit() {
      // check if login
      if (!this.$store.state.authenticated) {
        this.$store.state.signInDialogVisible = true
        return
      }
      // validate
      for (const pdf of this.pdfs) {
        if (!pdf.file) {
          this.$alert('File is required.')
          return
        }
        if (pdf.options.length === 0) {
          this.$alert(`Options is required for ${pdf.file.name}.`)
          return
        }
      }
      //
      try {
        this.submitting = true
        const order = await this.$api.post('order/store', {
          printerId: this.printerId,
          printTime: this.whenToPrint,
          pdfs: this.pdfs.map(pdf => ({
            name: pdf.file.name,
            file: pdf.file.data.key,
            pageCount: pdf.pageCount,
            options: pdf.options,
          })),
        })
        this.$router.push({name: 'payment', query: {id: order.id}})
      } finally {
        this.submitting = false
      }
    },
  },
  // created() {},
  async mounted() {
    this.$store.state.toolbar.title = 'Upload PDF'
    await this.pull()
  },
}

function getPageBtns(count, checkeds = []) {
  const r = []
  const checkedsMap = {}
  for (const i of checkeds) {
    checkedsMap[i] = true
  }
  for (let i = 1; i <= count; i++) {
    const btn = {value: i, checked: checkedsMap[i]}
    r.push(btn)
  }
  return r
}
</script>

<style lang="scss">
.upload-pdf-page{
  .page-body{
  }
  .page-footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    border-top: 1px solid #ddd;
    padding: 6px;
    .v-btn{
      margin: 0;
    }
    .files-upload-btn{
      width: 49%;
    }
  }
  .page-footer-placeholder{
    height: 50px;
  }
  .total-price{
    color: #ffe600;
    font-weight: bold;
  }
}
.no-files{
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  color: #737373;
  text-shadow: 1px 1px 3px #bfbfbf;
}
.pdf-card{
  @media(max-width: $medium) {
    .v-card__title{
      padding-top: 0;
      padding-bottom: 0;
      padding-right: 5px;
      .v-btn{
        margin: 2px 0;
      }
    }
  }
  .card-body{
    border-top: 1px solid $secondary;
    // padding-top: 3px;
  }
  .v-card__title{
    flex-wrap: nowrap;
  }
  .pdf-title{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
.print-options-card{
  .v-subheader{
    height: auto;
    padding: 5px 0;
  }
  .page-btns{
    .v-btn{
      height: auto;
      min-width: auto;
      padding: 3px 8px;
      margin: 3px 0;
      margin-right: -1px;
      box-shadow: none;
      border: 1px solid #ccc;
      border-radius: 0;
    }
  }
  .print-options{
    .v-subheader{
      display: inline-block;
    }
  }
  .size-select{
    width: 60px;
    display: inline-block;
  }
  .color-select{
    width: 60px;
    display: inline-block;
  }
  .side-select{
    width: 80px;
    display: inline-block;
  }
  .copies-input{
    width: 70px;
    display: inline-block;
  }
  .fit-to-page-checkbox{
    display: inline-block;
    vertical-align: middle;
    position: relative;
    bottom: -10px;
  }
  .fixed-pagination{
    text-align: center;
  }
}
#pdfPreviewHolder{
  width: 80%;
  margin: 0 auto;
  border: 1px solid $secondary;
  overflow: hidden;
}
</style>
