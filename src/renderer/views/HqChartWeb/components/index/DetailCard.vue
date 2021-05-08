<template>
  <ul class="detailList">
    <li v-for='(item,index) in this.DealData' :key='index'>
      <span>{{tsFormat(item.ts)}}</span>
      <span :class='item.direction'>{{Number(item.price).toFixed(pricePrecision)}}</span>
      <span class="item-color">{{Number(item.amount).toFixed(amountPrecision)}}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'DetailCard',
    props: {
      DealData: {
        type: Array
      }
    },
    data() {
      return {
        pricePrecision: 2,//交易对报价的精度
        amountPrecision: 2//交易对基础币种计数精度
      }
    },
    watch: {
      $route: {
        handler(newval, oldval) { // newval:新路由信息, oldval:老路由信息。(搜索框切换)
          if (!newval.query.stock) { return }
          this.listenerUrlParam(JSON.parse(newval.query.stock))
        },
        // 深度观察监听
        deep: true
      }
    },
    created() {
      this.listenerUrlParam(JSON.parse(this.$route.query.stock))
    },
    methods: {
      listenerUrlParam(stock) {
        this.pricePrecision = stock.price_precision
        this.amountPrecision = stock.amount_precision
      },
      tsFormat(ts) {
        var dateTime = new Date(ts)
        var hour = dateTime.getHours() >= 10 ? dateTime.getHours() : '0' + dateTime.getHours()
        var minut = dateTime.getMinutes() >= 10 ? dateTime.getMinutes() : '0' + dateTime.getMinutes()
        var second = dateTime.getSeconds() >= 10 ? dateTime.getSeconds() : '0' + dateTime.getSeconds()
        return hour + ':' + minut + ':' + second
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
