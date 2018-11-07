<template lang="pug">
nav.fixed-pagination(v-if="total && total > 1")
  ul.pagination.v-pagination.theme--light(:class="[size && 'pagination-' + size]")
    li(v-for="btn in pageBtns")
      button.v-pagination__item(
        :class="{'v-pagination__item--active primary': btn.page == current}"
        @click="$emit('goToPage', btn.page)"
      ) {{btn.text}}
</template>

<script>
import {arrayFirst, arrayLast} from 'helper-js'

export default {
  props: {
    // number
    total: {}, // pages count
    current: {}, // current page
    max: {default: 7}, // max number of buttons, min is 7
    // style
    size: {}, // sm/lg/null
    //
    inputVisible: { default: true }
  },
  data() {
    return {
      cache: {
        pageBtns: null
      }
    }
  },
  computed: {
    leftBtns() {
      const items = []
      if (this.current > 1) {
        items.push({
          text: '«',
          page: this.current - 1
        })
        items.push({
          text: '1',
          page: 1
        })
      }
      return items
    },
    rightBtns() {
      const items = []
      if (this.current < this.total) {
        items.push({
          text: this.total,
          page: this.total
        })
        items.push({
          text: '»',
          page: this.current + 1
        })
      }
      return items
    },
    pageBtns() {
      // clone
      const leftBtns = this.leftBtns.slice(0)
      const rightBtns = this.rightBtns.slice(0)
      const centerBtns = [{
        text: this.current,
        page: this.current
      }]
      // complete centerBtns
      const max = this.max < 7 ? 7 : this.max
      let rest = max - leftBtns.length - rightBtns.length - centerBtns.length
      let leftPage = this.current - 1
      let rightPage = this.current + 1
      while (rest > 0 && (leftPage > 1 || rightPage < this.total)) {
        if (leftPage > 1) {
          centerBtns.splice(0, 0, {
            text: leftPage,
            page: leftPage
          })
          rest--
        }
        if (rest <= 0) break
        if (rightPage < this.total) {
          centerBtns.push({
            text: rightPage,
            page: rightPage
          })
          rest--
        }
        leftPage--
        rightPage++
      }
      const centerFirst = arrayFirst(centerBtns)
      const centerLast = arrayLast(centerBtns)
      if (centerFirst.page < this.current && centerFirst.page > 2) {
        centerFirst.text = '…'
      }
      if (this.current < centerLast.page && centerLast.page < this.total - 1) {
        centerLast.text = '…'
      }
      this.cache.pageBtns = [...leftBtns, ...centerBtns, ...rightBtns]
      return this.cache.pageBtns
    }
  }
}

</script>

<style lang="scss">
.fixed-pagination{
  .pagination{
    margin: 0;
    user-select:none;
    margin-right: .5em;
    padding: 0;
    a{
      cursor: pointer;
    }
  }
  .pagination-sm{
    .v-pagination__item{
      height: auto;
      width: auto;
      padding: 0 8px;
      line-height: 30px;
      min-width: 26px;
    }
  }
  /* page input */
  .form-inline{
    width: 8.1em;
    display: inline-block;
  }
  .pagination, .form-inline{
    vertical-align: middle;
  }
}

</style>
