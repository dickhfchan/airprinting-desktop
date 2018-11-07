<template lang="pug">
.files-upload-btn
    slot
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
      :multiple="true"
      :customAction="customUploadHtml5"
    )
    .progress(v-if="uploading")
      //- span {{uploadedCount}}/{{files.length}} {{progress}}%
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
  },
  data() {
    return {
      files: [],
      progress: 0,
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    // for aws s3, you must append file to form manually. The key must be first of form, file must be second of form
    // only support html5
    customUploadHtml5(file, ts) {
      const form = new window.FormData()
      for (var key in file.data) {
        const value = file.data[key];
        form.append(key, value)
      }
      const xhr = new XMLHttpRequest();
      xhr.open('POST', file.postAction);
      return ts.uploadXhr(xhr, file, form)
    },
    async added(newFile) {
      const respData = await this.$api.post('file/sign', {filename: newFile.name})
      const data = JSON.parse(respData.json)
      newFile.data.key = data.key
      newFile.data.file = newFile.file
      delete data.key
      Object.assign(newFile.data, data)
      this.startUploadFile(newFile)
      this.$emit('added', newFile)
    },
    uploadProcessing(newFile) {
      this.progress = newFile.progress.slice(0, -3)
    },
    failed(newFile) {
    },
    success(newFile) {
      this.$emit('success', this.files)
    },
    uploadSuccess(newFile, oldFile) {
      this.$notifySuccess(`${newFile.name} was uploaded successfully`)
      this.success && this.success(newFile, oldFile)
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.files-upload-btn{
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
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
