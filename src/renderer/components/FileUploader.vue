<template lang="pug">
.file-uploader
    v-btn.ma-0(color="primary" small) Select
    VueUploadComponent.VueUploadComponent(
      :inputId="inputId"
      ref="upload"
      v-model="files"
      :accept="accept"
      :name="name"
      :post-action="action"
      :drop="true"
      @input-file="inputFile"
      @input-filter="inputFilter"
    )
    .progress(v-if="uploading")
      span {{progress}}%
</template>

<script>
import BaseUploader from './CustomBaseUploader'
import valueDetails from '@/plugins/valueDetailsComponent'

export default {
  mixins: [valueDetails],
  extends: BaseUploader,
  components: {},
  props: {
    name: {default: 'file'},
    fileName: {},
  },
  data() {
    return {
      files: [],
      progress: 0,
      url: null,
    }
  },
  computed: {
    file() {
      return this.files && this.files[0]
    },
  },
  watch: {
  },
  methods: {
    getValueDetails(value) {
      this.url = value
    },
    added(newFile) {
      this.startUploadFile(newFile)
      this._last_fileName = this.fileName
      this.$emit('update:fileName', newFile.name)
      this.$emit('added', newFile)
    },
    uploadProcessing(newFile) {
      this.progress = newFile.progress.slice(0, -3)
    },
    failed(newFile) {
      this.url = this.value // restore url
      this.fileName = this._last_fileName
    },
    success(newFile) {
      this.$emit('input', newFile.response.data)
      this.$emit('update:fileName', newFile.name)
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.file-uploader{
  // display: flex;
  position: relative;
  .VueUploadComponent{
    @include mask;
    opacity: 0;
    margin: 0;
    cursor: pointer;
  }
  .progress{
    @include mask;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
