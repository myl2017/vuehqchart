<template>
  <section class="introdialog-wrapper">
    <section class="introdialog">
      <ul class="head">
        <li>
          <div class="title">概况</div>
        </li>
        <li @click="onClose"><img src="../../../../assets/icons/dialog/close.png" alt=""/></li>
      </ul>
      <section class="name">{{introData.contract_code}}</section>
      <ul class="base-info">
        <li>
          <div class="sub-title">基本信息</div>
        </li>
        <li>
          <div class="labels">合约名称</div>
          <div class="values">
            <!-- 类型（交割合约contract、永续swap）-->
            <template v-if="introData.type === 'swap'">{{ introData.contract_code }}</template>
            <template v-if="introData.type === 'contract'">
              <!-- 当周: this_week, 次周: next_week, 当季: quarter, 次季: next_quarter -->
              <template v-if="introData.contract_type === 'this_week'">{{ introData.contract_code }} </template>
              <template v-if="introData.contract_type === 'next_week'">{{ introData.contract_code }} </template>
              <template v-if="introData.contract_type === 'quarter'">{{ introData.contract_code }} </template>
              <template v-if="introData.contract_type === 'next_quarter'">{{ introData.contract_code }} </template>
            </template>
          </div>
        </li>

        <li v-if="introData.type === 'contract'">
          <div class="labels" >上市时间</div>
          <div class="values">{{introData.create_date}}</div>
        </li>
        <li v-if="introData.type === 'contract'">
          <div class="labels">交割时间</div>
          <div class="values">{{introData.delivery_date}}</div>
        </li>
        <li>
          <div class="labels">合约面值</div>
          <div class="values">{{introData.contract_size}}美元</div>
        </li>
        <!-- <li>
          <div class="labels">合约状态</div>
          <div class="values">
            <template v-if="introData.contract_status === 0">已下市</template>
            <template v-if="introData.contract_status === 1">上市</template>
            <template v-if="introData.contract_status === 2">待上市</template>
            <template v-if="introData.contract_status === 3">停牌</template>
            <template v-if="introData.contract_status === 4">停牌上市中</template>
            <template v-if="introData.contract_status === 5">结算中</template>
            <template v-if="introData.contract_status === 6">交割中</template>
            <template v-if="introData.contract_status === 7">结算完成</template>
            <template v-if="introData.contract_status === 8">交割完成</template>
            <template v-if="introData.contract_status === 9">暂停上市</template>
          </div>
        </li> -->
      </ul>
      <section class="description">
        <div>简介</div>
        <article>{{introData.info}}</article>
      </section>
    </section>
    <section class="mask"></section>
  </section>
</template>

<script>
  import eventBus from '@/utils/bus'
  import {getContractInfo} from '@/api'
  import {getToken} from '@/utils/auth'
  import {dateFormat} from '../../../../utils'

  export default {
    name: 'ContractDialog',
    props: {
      stock: {
        type: Object
      }
    },
    data() {
      return {
        introParam: {
          token: null,
          id: null
        },
        introData: {
          id: null,
          symbol: null,
          type: null,
          contract_code: null,
          contract_type: null,
          contract_short_type: null,
          contract_size: null,
          price_tick: null,
          contract_status: null,
          delivery_date: null,
          create_date: null,
          settlement_date: null,
          delivery_time: null,
          amount_precision: null,
          fee_amount_precision: null,
          other_amount_precision: null,
          price_precision: null,
          limit_open: null,
          limit_close: null,
          market_open: null,
          status: 1,
          info: null
        }
      }
    },
    created() {
      console.log(this.stock)
      this.introParam.token = getToken()
      this.introParam.id = this.stock.id
      this.fetchData()
    },
    methods: {
      onClose() {
        eventBus.$emit('closeContract', null)
      },
      fetchData() {
        getContractInfo(this.introParam).then(res => {
          this.introData = res.data
          // this.introData.create_date = dateFormat(this.introData.create_date)
          // this.introData.delivery_date = dateFormat(this.introData.delivery_date)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  * {
    /*outline: 1px solid red;*/
  }

  .introdialog-wrapper {
    .introdialog {
      width: 640px;
      background-color: #fff;
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2020;
      border-radius: 10px;
      color: #333333;

      ul.head {
        width: 100%;
        height: $dialogHeadHigh;
        background-color: #FFF4EB;
        border-radius: 10px 10px 0px 0px;
        padding-left: 21px;
        padding-right: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        li:first-child {
          > div {
            font-size: 18px;
            color: #333333;
          }
        }

        li:nth-child(2) {
          > img {
            width: 18px;
            height: 18px;
          }
        }
      }

      section.name {
        width: 100%;
        height: 44px;
        background-color: #F66C00;
        font-size: 18px;
        color: rgba(255, 255, 255, 1);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      ul.base-info {
        margin-top: 16px;
        margin-left: 19px;
        margin-right: 16px;

        li:first-child {
          border-bottom: 1px solid rgba(238, 238, 238, 1);

          .sub-title {
            width: 72px;
            height: 25px;
            font-size: 18px;
            font-weight: bold;
            line-height: 25px;
            color: rgba(246, 108, 0, 1);
            position: relative;

            &::after {
              display: block;
              content: '';
              width: 72px;
              height: 3px;
              background: rgba(246, 108, 0, 1);
              margin-top: 2px;
            }
          }
        }

        > li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          > div.labels {
            height: 22px;
            font-size: 16px;
            line-height: 22px;
            color: rgba(153, 153, 153, 1);
          }

          > div.values {
            width: 230px;
            font-size: 16px;
            line-height: 22px;
            color: rgba(51, 51, 51, 1);
            text-align: left;
          }
        }

        li:last-child {
          .values {
            display: flex;

            > a {
              display: flex;
              height: 22px;
              font-size: 16px;
              font-family: PingFang SC;
              line-height: 22px;
              color: rgba(0, 136, 255, 1);
              white-space: nowrap;
            }

            a:nth-child(2) {
              margin-left: 36px;
              margin-right: 36px;
            }
          }
        }
      }

      .description {
        margin-left: 19px;
        margin-right: 16px;

        > div {
          height: 22px;
          font-size: 16px;
          line-height: 22px;
          color: rgba(153, 153, 153, 1);
        }

        article {
          text-align: justify;
          font-size: 16px;
          line-height: 24px;
          color: rgba(102, 102, 102, 1);
          margin-top: 8px;
          margin-bottom: 27px;
        }
      }
    }

    .mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: .5;
      background: #000;
      z-index: 2019;
      width: 100%;
      height: 100%;
    }
  }
</style>
