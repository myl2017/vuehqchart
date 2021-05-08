<template>
  <div :class="classPrefix && `${classPrefix}`">
    <header>
      <TopBar :chartType="chartType" :minuteChart="minuteChart" :historyChart="historyChart" :userData="userData"/>
      <NavBar/>
    </header>
    <slot/>
    <FootBar/>
    <!--模糊搜索框 -->
    <SearchBox v-show="visibility" :keyValue="keyValue"/>
  </div>
</template>

<script>
  import TopBar from '../HqChartWeb/components/home/TopBar'
  import NavBar from '../HqChartWeb/components/home/NavBar'
  import FootBar from '../HqChartWeb/components/home/FootBar'
  import SearchBox from '../HqChartWeb/components/home/SearchBox'
  import eventBus from '@/utils/bus'
  import '@/utils/tools.js'

  export default {
    name: 'Layout',
    components: {SearchBox, FootBar, NavBar, TopBar},
    props: {
      classPrefix: {
        type: String,
        required: true
      },
      chartType: {
        type: String
      },
      minuteChart: {
        type: Object
      },
      historyChart: {
        type: Object
      },
      userData: {
        type: Object
      }
    },
    data() {
      return {
        // 模糊搜索
        visibility: false, // 搜索框显示或隐藏
        keyValue: '',
        // 字母键、数字键、数字键盘上的键码值
        keyCodeAry: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
        // selectedIndex: 0,
        // counts: 0, // 结果计数
        isListener: true
      }
    },
    mounted() {
      window.addEventListener('keydown', (e) => {
        if (this.keyCodeAry.indexOf(e.keyCode) >= 0) { // >= 0 代表包含在其中
          this.keyValue = e.key
          this.visibility = true

          document.getElementById('SearchBox').style.display = ''
          eventBus.$emit('updateVisible', true)
        }

        // // 键盘上下键
        // if (e.keyCode === 38) {
        //   if (this.selectedIndex > 0) {
        //     this.selectedIndex--
        //   } else {
        //     this.selectedIndex = this.counts
        //   }
        // } else if (e.keyCode === 40) {
        //   if (this.selectedIndex < this.counts) {
        //     this.selectedIndex++
        //   } else {
        //     this.selectedIndex = 0
        //   }
        // }

        // if (e.keyCode === 13) {
        //   if (document.querySelector('#indexInput').getAttribute('id') === 'indexInput') {
        //     return
        //   }

        //   let searchElement = document.querySelector('#searchKeywords')
        //   if (searchElement.getAttribute('id') === 'searchKeywords') {
        //     const selectedItem = JSON.parse(window.sessionStorage.getItem('selectedItem'))
        //     this.$router.push({path: '/hqdetail', query: {stock: JSON.stringify(selectedItem)}})
        //   } else {

        //   }
        // }
      })
    }
  }
</script>

<style lang="scss">
  * {
    /*outline: 1px solid red;*/
  }

  .layout-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    /*tab reset*/
    .el-tabs__header {
      margin: 0;
    }

    .el-tabs--card > .el-tabs__header {
      border-bottom: none;
      background: #DBDBDB;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__nav,
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border: none;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item {
      border-left: none;
      border-bottom: none;
      font-size: 14px;
      color: #999999;
      height: 24px;
      line-height: 24px;
    }

    .el-tabs__item.is-active {
      font-size: 14px;
      outline: 2px solid rgba(233, 233, 233, 1);
    }

    /*.el-tabs__item:nth-child(3) {*/
    /*  color: rgba(246, 108, 0, 1) !important;*/
    /*}*/

    .clear-table-border {
      // 去掉table的border start
      border: 0;

      th, tr, td {
        cursor: pointer;
        padding: 0 !important;
      }

      th, tr, td, th.is-leaf {
        border: 0;
        color: #333 !important;
        font-size: $fontSize14;
        white-space: nowrap !important;
      }

      &::before {
        height: 0;
      }

      &::after {
        width: 0;
      }

      .el-table__fixed:before {
        height: 0;
      }

      // 去掉table的border end

      .el-button--mini {
        padding: 3px 8px !important;
        font-size: 11px !important;
      }

      .custom-edit-btn {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
      }

      .custom-del-btn {
        color: #fff;
        background-color: #f56c6c;
        border-color: #f56c6c;
      }
    }

    /*nav css*/
    .last-item {
      display: none !important;
    }

    .other-item {
      flex-grow: 1 !important;
    }

    #minuteChartID, #kLine {
      color: #333 !important;

      .context-menu {
        font-size: 14px !important;
      }
    }

    .subTolls {
      height: 36px;
      padding-right: 8px !important;

      > p {
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    /*element dialog theme reset*/
    .custom-dialog {
      .el-dialog {
        border-radius: 10px;
      }

      .el-dialog__title {
        font-size: $fontSize16 !important;
      }

      .el-dialog__header {
        height: $dialogHeadHigh;
        padding: 0 14px !important;
        background: #FFF4EB !important;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        display: flex;
        align-items: center;
      }

      .el-form-item__label, .custom-label {
        font-size: $fontSize14;
        color: #333;
        white-space: nowrap;
      }

      .button-align {
        text-align: center !important;

        .el-button--primary {
          width: 274px;
          height: 50px;
          border-radius: 5px;
          font-size: 18px;
        }
      }

      .el-checkbox__inner {
        border: 1px solid #DDDDDD;
      }

      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #999999;
        font-size: 14px;
      }

      .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #409EFF;
        border-color: #409EFF;
      }

      .el-button--primary {
        color: #fff;
        background-color: #409EFF !important;
        border-color: #409EFF !important;
      }

      .custom-input {
        width: 90%;
      }
    }

    .jchart-changeindex-box {
      color: #333;
      width: 42%;
      height: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      > .target-panel {
        border-radius: 10px;
        height: auto !important;
        padding-bottom: 30px;

        > .target-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          line-height: 40px;
          background: #DDDDDD;
          border-radius: 10px 10px 0px 0px;

          > span {
            font-size: $fontSize16;
            margin-left: 20px;
          }

          > strong {
            top: 0;
            right: 30px;
            font-weight: bold;
          }
        }

        > .target-button-pane {
          width: 100%;
          height: 40px;
          background: #ECECEC;
          border-bottom: 1px solid rgba(222, 222, 222, 1);
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 20px;

          > button {
            width: 80px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 4px;
            border: none;
            outline: none;
            font-size: $fontSize14;
            color: #fff;
            margin-right: 14px;
          }

          #newCreateButton0, #newCreateButton1, #newCreateButton2, #newCreateButton3 {
            background-color: #1C8FD0;
          }

          #updateButton0, #updateButton1, #updateButton2, #updateButton3 {
            background-color: #DC6405;
          }

          #deleteButton0, #deleteButton1, #deleteButton2, #deleteButton3 {
            background-color: #EE0000;
          }
        }

        > .target-content {
          > .target-left {
            > ul {
              padding: 0 !important;

              > li {
                font-size: 15px;
                text-align: left;
                padding-left: 20px;
              }

              > li.active-list {
                background-color: #FFF6E5;
                color: #333333 !important;
              }
            }
          }

          > .target-right {
            > ul {
              height: 280px;
              overflow-x: hidden;
              overflow-y: scroll;

              > li {
                font-size: $fontSize14;
                width: 150px;
                text-align: left;
                padding-left: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              > li.active-list {
                background-color: #FFF6E5;
                color: #333333 !important;
              }
            }
          }
        }

        .active-list {
        }
      }
    }

    .charts-wrap, .fake-card, #chartsRightTop {
      .jchart-changeindex-box {
        color: #333;
        width: 100%;
        height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .target-button-pane {
          display: none;
        }
      }
    }

    .jchart-modifyindex-box {
      .parameter {
        .parameter-header {
          > strong {
            top: 0 !important;
          }
        }
      }
    }

    .chartpicture-text-setting {
      span.strongFont, span.italicsFont {
        display: none;
      }
    }
  }

  .layout-wrapper.active {
    .last-item {
      display: flex !important;
    }
  }

  .el-select-dropdown.el-popper {
    width: 274.31px !important;

    .el-scrollbar__view.el-select-dropdown__list {
      display: flex;
      flex-direction: column;

      .el-select-dropdown__item {
        text-align: left !important;
      }
    }
  }

  /*夜间模式 Home组件 表格*/
  .custom-theme {
    .layout-wrapper {
      .el-tabs--card > .el-tabs__header {
        background: #1E1F20;
      }

      .el-tabs--card > .el-tabs__header .el-tabs__item {
        color: #999999;
      }

      .el-tabs__item.is-active {
        outline: 2px solid rgba(44, 45, 45, 1) !important;
        border-bottom: 2px solid rgba(44, 45, 45, 1) !important;
        color: #DCDCDC !important;
      }

      .el-table:not(.radar-table) {
        background: #121212 !important;

        thead {
          .cell {
            color: #DCDCDC !important;
          }
        }

        th,
        tr,
        td,
        th.is-leaf {
          background-color: #121212;
        }

        td:first-child, td:nth-child(8) {
          color: #DCDCDC;
        }
      }

      .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: rgba(255, 170, 0, .2);
        border-bottom: 1px solid #FFAA00;
      }

      .el-table--enable-row-hover .el-table__body tr.current-row > td {
        background: rgba(255, 170, 0, .2);
        border-bottom: 1px solid #FFAA00;
      }

      background: #121212;
      color: #DCDCDC;

      > .home-main {
        .left-aside {
          background: #121212 !important;

          .kline-title {
            background: #1E1F20 !important;
          }
        }

        .right-aside {
          .education-wrap {
            .education-bg {
              width: 27px;
              height: 26px;
              background: transparent url("../../assets/icons/black/education.png") no-repeat !important;
              background-size: 100% 100%;
            }
          }

          .video-wrap {
            > img {
              width: 100%;
              height: 244px;
            }
          }

          .hot-container {
            background: #171717;

            .hot-bar {
              .hot-bg {
                /*background: transparent url("../../assets/icons/black/hothuang.png") no-repeat !important;*/
                /*background-size: cover;*/
              }
            }
          }
        }
      }

      /*笔记管理*/
      #noteTable {
        background: #ffffff !important;

        thead {
          .cell {
            color: #333 !important;
          }
        }

        th,
        tr,
        td,
        th.is-leaf {
          color: #333 !important;
          background-color: #ffffff;
          padding: 4px !important;
        }
      }

    }
  }

  /*夜间模式 TopBar组件*/
  .custom-theme {
    .topbar-wrapper {
      background: #2C2C2C !important;
      color: #DCDCDC !important;
    }
  }

  /*夜间模式 NavBar组件 表格*/
  .custom-theme {
    .navbar-wrapper {
      background: #121212 !important;
      color: #DCDCDC !important;

      .back-img-wrap {
        width: 18px;
        height: 18px;
        background: transparent url("../../assets/icons/black/back.png") no-repeat !important;
        background-size: contain !important;
      }

      > li {
        margin-top: 2px !important;
        margin-right: 2px !important;
        background: #2C2C2C !important;
        border-top: none !important;
        border-right: none !important;
      }

      .info {
        .info-inner {
          > div:first-child {
            border-bottom: 2px solid #121212 !important;
            border-right: 2px solid #121212 !important;
          }

          > div:nth-child(2) {
            border-bottom: 2px solid #121212 !important;
          }

          > div:nth-child(3) {
            border-right: 2px solid #121212 !important;
          }
        }
      }
    }
  }

  /*夜间模式 FootBar 表格*/
  .custom-theme {
    .footer-wrapper {
      background: #303030 !important;
      color: #DCDCDC !important;

      .el-upload-list--picture-card {
        > li {
          width: 140px !important;
          height: 140px !important;
        }
      }

      .el-upload--picture-card {
        width: 140px !important;
        height: 140px !important;
      }
    }
  }

  /*夜间模式 index组件*/
  .custom-theme {

    .HQChartPC {
      .sellandbuy-wrap {
        background: #171717;
      }

      .navBarWrap, .right-gap {
        background: #121212 !important;
      }

      .navBarWrap .item {
        display: inline-block;
        font-size: 14px;
        line-height: 1;
        padding: 6px 12px;
        margin-top: 4px;
        margin-right: 4px;
        background: #2C2C2C;
        border: #707070;
      }

      .indexList {
        background: #2C2C2C;
        color: #DCDCDC;
      }

      .rightData {
        background: #121212 !important;
      }

      .noticecard-wrapper {
        .title-bar {
          background: #1E1F20 !important;

          li.first-item {
            border: 2px solid rgba(44, 45, 45, 1);
            background: #1E1F20 !important;
          }
        }
      }

      .sellandbuy-wrap, .detailList {
        background: #171717 !important;
      }

      .clear-table-border {
        th, tr, td, th.is-leaf {
          color: #DCDCDC !important;
        }
      }
    }
  }

  /*夜间模式 dialog*/
  .custom-theme {
    .aboutdialog-wrapper {
      .about-dialog {
        ul.head {
          background-color: #DDDDDD !important;
        }
      }
    }
  }

  .custom-theme {
    .recommenddialog-wrapper {
      .recommenddialog {
        ul.head {
          background: #DDDDDD !important;
        }
      }
    }
  }

  .custom-theme {
    .custom-dialog {
      .el-dialog__header {
        background: #DDDDDD !important;
      }

      .el-dialog__body {
        padding: 20px !important;
      }
    }

    .radar-dialog, .condition-dialog {
      .el-dialog__body {
        padding: 0 !important;
      }
    }
  }

  .custom-theme {
    .introdialog-wrapper {
      .introdialog {
        ul.head {
          background-color: #DDDDDD !important;
        }

        section.name {
          background-color: #08537E !important;
        }
      }
    }
  }

  .custom-theme {
    .infodialog-wrapper {
      .infodialog {
        ul.head {
          background-color: #DDDDDD !important;
        }
      }
    }
  }

  .custom-tabs {
    .el-tabs__item.is-active {
      outline: 2px solid #e9e9e9 !important;
    }

    > .el-tabs__content {
      padding: 5px 15px !important;
    }

    .custom-pane {
      display: flex;
    }
  }

  .custom-theme {
    .indexdialog-wrapper {
      .el-tabs--border-card > .el-tabs__header .el-tabs__item {
        font-size: 14px;
        color: #262729;
      }

      .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
        outline: 1px solid #e9e9e9 !important;
        border-bottom: none !important;
      }

    }
  }

  /*loading*/
  .custom-theme {
    .el-loading-mask {
      background-color: #121212 !important;

      .el-loading-spinner {
        .path {
          stroke: #fff;
        }

        .el-loading-text {
          color: #fff;
        }
      }

    }
  }

  /*FootBar*/
  .suggestion-dialog {
    .button-align {
      button {
        width: $buttonWidth !important;
        height: $buttonHeight !important;
        font-size: $fontSize14 !important;
      }
    }
  }

  .custom-theme {
    .jschart-selectrect {
      background: rgba(1, 130, 212, 0.3);
      border: dashed 1px #fff;
    }
  }

  .custom-theme {
    .write-note-dialog {
      .el-date-editor {
        width: 90%;
      }

      .transaction-wrap {
        display: flex !important;

        .current-market {
          width: 60px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
      }

      .col-wrap {
        display: flex;
        align-items: center;

        .public-tips {
          color: #dcdcdc;
          font-size: $fontSize12;
          margin-left: 48px;
          display: flex;
          align-items: center;

          > img {
            width: 18px;
            height: 18px;
            margin-right: 8px;
          }
        }
      }
    }

    .note-manage-dialog {
      .row-gap {
        margin-bottom: 10px;
      }

      .col-gap {
        margin-right: 16px;
      }

      .row-align {
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;
      }
    }
  }

  .custom-theme .el-radio__input.is-checked .el-radio__inner {
    background-color: #409EFF !important;
    border-color: #409EFF !important;
  }

  .update-dialog {
    .connect-progress {
      margin-bottom: 15px;
    }
  }

  .custom-theme {
    /*hqchart reset*/
    .klineframe-toolbar {
      /*display: none !important;*/
      > span {
        color: #DCDCDC;
      }
    }
  }
</style>
