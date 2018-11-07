import BaseUploader from '@/plugins/BaseUploader/BaseUploader.js'
import * as ut from '@/plugins/utils'
import * as httpUtils from '@/plugins/httpUtils'

export default {
  extends: BaseUploader,
  data() {
    return {
      // action: this.$store.state.api + '/file/store',
      action: `https://${this.$store.state.s3.bucketName}.s3.amazonaws.com/`,
    }
  },
  methods: {
    prevented(msg) {
      this.$alert(msg || 'Your choice is not allowed')
    },
    uploadFailed(newFile, oldFile) {
      const message = httpUtils.resolveErrorHttpMessage(newFile.response && newFile.response.data, newFile.response)
      if (message) {
        this.$alert(`Upload Failed. ${message}`)
      }
      this.failed && this.failed(newFile, oldFile)
    },
    uploadSuccess(newFile, oldFile) {
      this.$notifySuccess(`The file was uploaded successfully`)
      this.success && this.success(newFile, oldFile)
    },
  },
}
