<template>
  <div class="sellandbuy-wrap">
    <ul class="sellFive" v-show="tabType === 'default' || tabType==='sell'">
      <li v-for='(item,index) in sellList.slice(0,number).reverse()' :key='index'>
        <span><template v-if="number===5">{{sellLabel[index]}}</template><template v-if="number===10">{{sellLabelAll[index]}}</template></span>
        <span class="sell-price">{{item[0].toFixed(pricePrecision)}}</span>
        <span class="item-color">{{Number(item[1]).toFixed(amountPrecision)}}</span>
        <!--        <span class="more-vip"></span>-->
      </li>
    </ul>
    <template v-if="String(noteData.close) !== 'NaN' && String(rateResult) !== 'NaN'">
      <ul class="cny" v-show="tabType === 'default'">
        <li>{{Number(noteData.close).toFixed(2)}}</li>
        <li>≈</li>
        <li>{{Number(rateResult).toFixed(2)}} CNY</li>
      </ul>
    </template>
    <template v-else>
      <ul class="cny" v-show="tabType === 'default'">
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </template>
    <ul class="buyFive" v-show="tabType === 'default' || tabType === 'buy'">
      <li v-for='(item,index) in buyList.slice(0,number)' :key='index'>
        <span>{{buyLabel[index]}}</span>
        <span class="buy-price">{{item[0].toFixed(pricePrecision)}}</span>
        <span class="item-color">{{Number(item[1]).toFixed(amountPrecision)}}</span>
        <!--        <span v-if="index === 0" class="more-vip" @click="handleMore">更多(VIP)</span>-->
      </li>
    </ul>
  </div>
</template>

<script>
  import eventBus from '@/utils/bus.js'
  import {getRate} from '@/api'

  var eleResizeDetector = require('element-resize-detector')

  export default {
    name: 'MarketCard',
    props: {
      sellList: {
        type: Array
      },
      buyList: {
        type: Array
      },
      number: {
        type: Number,
        required: true
      },
      tabType: {
        type: String,
        required: true
      },
      noteData: {
        type: Object
      }
    },
    data() {
      return {
        sellLabel: ['卖五', '卖四', '卖三', '卖二', '卖一'],
        sellLabelAll: ['卖十', '卖九', '卖八', '卖七', '卖六', '卖五', '卖四', '卖三', '卖二', '卖一'],
        buyLabel: ['买一', '买二', '买三', '买四', '买五', '买六', '买七', '买八', '买九', '买十'],

        ids: ['topBar', 'navBar', 'footBar', 'asideTop'],
        topBarHigh: 0,
        navBarHigh: 0,
        footBarHigh: 0,
        asideTopHigh: 0,
        pricePrecision: 2,//交易对报价的精度
        amountPrecision: 2,//交易对基础币种计数精度
        stock: null,

        totalHeight: 0,
        isEmit: false,

        rateValue: null,
        rateResult: null
      }
    },
    watch: {
      tabType(newValue, oldValue) {
        console.log(newValue, oldValue)
        switch (newValue) {
          case 'default':
            this.$emit('update:number', 5)
            break
          case 'buy':
            this.$emit('update:number', 10)
            break
          case 'sell':
            this.$emit('update:number', 10)
            break
        }
      },
      noteData(newValue, oldValue) {
        this.rateResult = this.rateValue * this.noteData.close
      },
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
      this.fetchData()
    },
    methods: {
      listenerUrlParam(stock) {
        this.pricePrecision = stock.price_precision
        this.amountPrecision = stock.amount_precision
      },
      fetchData() {
        getRate({}).then(res => {
          this.rateValue = Number(res.data)
          this.rateResult = this.rateValue * this.noteData.close
        })
      },
      handleMore() {
        this.$message('暂未开放，敬请期待！')

        // if (this.number === 5) {
        //   this.$emit('update:number', 10)
        //   eventBus.$emit('updateDeal', false)
        // } else {
        //   this.$emit('update:number', 5)
        //   eventBus.$emit('updateDeal', true)
        // }
      },
      getElementResize() {
        var erd = eleResizeDetector()

        this.totalHeight = 0
        this.isEmit = false
        this.ids.forEach(id => {
          erd.listenTo(document.getElementById(id), (element) => {
            const height = element.offsetHeight
            switch (id) {
              case 'topBar':
                this.topBarHigh = height
                break
              case 'navBar':
                this.navBarHigh = height
                break
              case 'footBar':
                this.footBarHigh = height
                break
              case 'asideTop':
                this.asideTopHigh = height
                this.isEmit = true
                break
            }
            this.totalHeight = this.topBarHigh + this.navBarHigh + this.footBarHigh + this.asideTopHigh
            if (this.isEmit) {
              eventBus.$emit('updateHeight', 0)
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
