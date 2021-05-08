<template>
  <section class="introdialog-wrapper">
    <section class="introdialog">
      <ul class="head">
        <li>
          <div class="title">概况</div>
        </li>
        <li @click="onClose"><img src="../../../../assets/icons/dialog/close.png" alt=""/></li>
      </ul>
      <section class="name">{{stock.display_name}}</section>
      <ul class="tips">
        <li>
          <template v-if="introData.rehalf.times">第几次减产：{{introData.rehalf.times}}</template>
        </li>
        <li>
          <template v-if="introData.rehalf.halfUtc">预计减产时间： {{introData.rehalf.halfUtc}}</template>
        </li>
      </ul>
      <ul class="base-info">
        <li>
          <div class="sub-title">基本信息</div>
        </li>
        <li>
          <div class="labels">币种名称</div>
          <div class="values">{{introData.full_name}}</div>
        </li>

        <li>
          <div class="labels">发行时间</div>
          <div class="values">{{introData.publish_time}}</div>
        </li>
        <li>
          <div class="labels">发行总量</div>
          <div class="values">{{introData.publish_volume}}</div>
        </li>
        <li>
          <div class="labels">流通总量</div>
          <div class="values">{{introData.circulate_vol}}</div>
        </li>
        <li>
          <div class="labels">众筹价格</div>
          <div class="values">{{introData.crowdfunding_price}}</div>
        </li>
        <li>
          <div class="labels">相关链接</div>
          <div class="values">
            <a @click="openBrowser($event, introData.official_website)">官网</a>
            <a @click="openBrowser($event, introData.white_paper)">白皮书</a>
            <a @click="openBrowser($event, introData.block_query)">区块查询</a>
          </div>
        </li>
      </ul>
      <section class="description">
        <div>简介</div>
        <article>{{introData.summary}}</article>
      </section>
    </section>
    <section class="mask"></section>
  </section>
</template>

<script>
  import eventBus from '@/utils/bus'
  import { getCurrencyIntro } from '@/api'
  import { getToken } from '@/utils/auth'

  const { shell } = require('electron')

  export default {
    name: 'IntroductDialog',
    props: {
      stock: {
        type: Object
      }
    },
    data() {
      return {
        introParam: {
          token: null,
          introduction_id: null
        },
        introData: {
          id: null,
          code: null,
          full_name: null,
          summary: null,
          publish_time: null,
          publish_volume: null,
          circulate_vol: null,
          crowdfunding_price: null,
          white_paper: null,
          block_query: null,
          official_website: null,
          rehalf: { times: null, halfUtc: null }
        }
      }
    },
    created() {
      console.log(this.stock)
      this.introParam.token = getToken()
      this.introParam.introduction_id = this.stock.introduction_id
      this.fetchData()
    },
    methods: {
      onClose() {
        eventBus.$emit('closeIntro', null)
      },
      fetchData() {
        getCurrencyIntro(this.introParam).then(res => {
          this.introData = res.data
        })
      },
      openBrowser(e, href) {
        e.preventDefault()         // 阻止窗口打开的默认事件
        shell.openExternal(href)   // 通过url在浏览器打开
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

      ul.tips {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 8px 16px 20px 18px;

        > li {
          height: 20px;
          font-size: 14px;
          color: rgba(102, 102, 102, 1);
        }
      }

      ul.base-info {
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
