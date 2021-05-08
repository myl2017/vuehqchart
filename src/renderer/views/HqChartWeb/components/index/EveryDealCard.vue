<template>
  <div class="everydealcard-wrapper">
    <div class="title-bar" @click="onShowList">折叠</div>
    <transition name="slide">
      <div class="list" v-bind:class="{show: isCollapse}">
        <ul class="left-list">
          <li v-for='(item,index) in this.list' :key='`${item.ts}-${index}`'>
            <div class="time">{{tsFormat(item.ts)}}</div>
            <div :class='item.direction'>{{Number(item.price).toFixed(pricePrecision)}}</div>
            <div>{{Number(item.amount).toFixed(amountPrecision)}}</div>
          </li>
        </ul>
        <div class="vertical-line"></div>
        <ul class="middle-list">
          <li v-for='(item,index) in this.listV2' :key='`${item.ts}~${index}`'>
            <div class="time">{{tsFormat(item.ts)}}</div>
            <div :class='item.direction'>{{Number(item.price).toFixed(pricePrecision)}}</div>
            <div>{{Number(item.amount).toFixed(amountPrecision)}}</div>
          </li>
        </ul>
        <div class="vertical-line"></div>
        <ul class="right-list">
          <li v-for='(item,index) in this.listV3' :key='`${item.ts}*${index}`'>
            <div class="time">{{tsFormat(item.ts)}}</div>
            <div :class='item.direction'>{{Number(item.price).toFixed(pricePrecision)}}</div>
            <div>{{Number(item.amount).toFixed(amountPrecision)}}</div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
  import eventBus from '@/utils/bus.js'

  export default {
    name: 'EveryDealCard',
    data() {
      return {
        isCollapse: true,
        list: null,
        listV2: null,
        listV3: null,
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
    mounted() {
      eventBus.$on('fetchDealData', (data) => {
        this.list = data.slice(0, 8)
        this.listV2 = data.slice(8, 16)
        this.listV3 = data.slice(16, 24)
      })
    },
    methods: {
      listenerUrlParam(stock) {
        this.pricePrecision = stock.price_precision
        this.amountPrecision = stock.amount_precision
      },
      onShowList() {
        this.isCollapse = !this.isCollapse
        eventBus.$emit('updateChart', this.isCollapse)
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
  .custom-theme {
    .everydealcard-wrapper {
      background: #121212 !important;

      .title-bar {
        background: #1E1F20 !important;
      }
    }
  }
</style>

<style lang="scss" scoped>
  /** {*/
  /*  outline: 1px solid red;*/
  /*}*/

  .everydealcard-wrapper {
    background: #F6F6F6;

    .title-bar {
      height: 24px;
      line-height: 24px;
      font-size: $fontSize14;
      color: rgba(246, 108, 0, 1);
      text-align: right;
      padding-right: 10px;
      cursor: pointer;
    }

    .list {
      padding: 10px 10px 16px 24px;
      height: 0;
      display: none;
      overflow: hidden;
      transition: display 1s;

      &.show {
        height: auto;
        display: flex;
      }

      > ul {
        width: 24%;
        display: flex;
        flex-direction: column;

        > li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: $fontSize14;
          height: 22px;
          margin-bottom: 4px;

          > div {
            width: 33.333%;
            white-space: nowrap;
          }

          div.buy {
            color: #00FF11;
            text-align: left;
          }

          div.sell {
            color: #EE0000;
          }

          div:nth-child(2) {
            padding-left: 34px;
          }

          div:last-child {
            text-align: right;
          }
        }
      }

      > div.vertical-line {
        width: 0;
        height: 155px;
        border-right: 1px solid rgba(221, 221, 221, 1);
        margin-left: 80px;
        margin-right: 80px;
        margin-top: 25px;
      }
    }
  }
</style>
