export default {
  props: {
    value: {},
  },
  data() {
    return {
      valueFortDetails: null,
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        if (this.getValueDetails && this.valueFortDetails !== value) {
          Promise.resolve(this.getValueDetails(value)).then(() => {
            this.valueFortDetails = value
          })
        }
      },
    },
  },
  methods: {
    setValue(value) {
      this.valueFortDetails = value
      this.$emit('input', value)
    },
  },
  // created() {
  // },
}
