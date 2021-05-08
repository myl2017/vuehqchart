<template>
  <ol class="notecard-wrapper" v-if="noteData.rate !== null">
    <li>
      <div class="labels">开:</div>
      <div class="values open">{{noteData.open.toFixed(pricePrecision)}}</div>
    </li>
    <li>
      <div class="labels">高:</div>
      <div class="values high">{{noteData.high.toFixed(pricePrecision)}}</div>
    </li>
    <li>
      <div class="labels">低:</div>
      <div class="values low">{{noteData.low.toFixed(pricePrecision)}}</div>
    </li>
    <li>
      <div class="labels">收:</div>
      <div class="values close">{{noteData.close.toFixed(pricePrecision)}}</div>
    </li>
    <template v-if="!contractSize">
      <!-- USDT -->
      <li>
        <!-- 火币网 amount 成交量，vol 成交金额 -->
        <div class="labels">量:</div>
        <div class="values amount">{{Math.ceil(noteData.amount)}}</div>
      </li>
      <li>
        <div class="labels">额:</div>
        <div class="values vol">{{Math.ceil(noteData.vol)}}</div>
      </li>
    </template>
    <template v-else>
      <!-- 合约 -->
      <li>
        <div class="labels">量:</div>
        <div class="values amount">{{noteData.vol}}</div>
      </li>
      <li>
        <div class="labels">额:</div>
        <div class="values vol">{{(noteData.vol * contractSize)}}</div>
      </li>
    </template>
    <li>
      <div class="labels last-label">涨跌幅:</div>
      <div class="values">
        <template v-if="noteData.rate > 0">
          <span class="rate-up">+{{noteData.rate.toFixed(2)}}%</span>
        </template>
        <template v-else>
          <span class="rate-down">{{noteData.rate.toFixed(2)}}%</span>
        </template>
      </div>
    </li>
  </ol>
</template>

<script>
  export default {
    name: 'NoteCard',
    props: {
      noteData: {
        type: Object
      }
    },
    data() {
      return {
        pricePrecision: 2,   //交易对报价的精度
        amountPrecision: 2,  //交易对基础币种计数精度

        contractSize: null
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

        if (stock.type === 'swap' || stock.type === 'contract') {
          this.contractSize = stock.contract_size
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .custom-theme {
    .notecard-wrapper {
      background: #121212;
    }
  }
</style>
<style lang="scss" scoped>
  .notecard-wrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    background: #F6F6F6;

    > li {
      width: 32.333%;
      font-size: $fontSize14;
      padding-bottom: 12px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      white-space: nowrap;

      div:first-child:not(.last-label) {
        width: 34px;
      }

      div.last-label {
        width: 60px;
      }

      div:nth-child(2) {
        flex-grow: 1;
      }
    }

    .open, .vol {
      color: #0088FF;
    }

    .high, .rate-up {
      color: #EE0000;
    }

    .low, amount, .rate-down {
      color: #00FF11;
    }

    .close {
      color: #F66C00;
    }
  }
</style>
