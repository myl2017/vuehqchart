<template>
  <ul class="contextmenu-container" :style="{position: 'absolute', top: (rightMenuData.Y + 96) + 'px', left: rightMenuData.X + 'px'}"
      v-if="isShowContextMenu">
    <li class="menu-item">
      <a class="level1" :class="{'disabled':rightMenuData.FrameID === 0}">
        <div class="title">副图指标切换</div>
        <div class="arrow-right"></div>
        <ol class="submenu-container" :style="{position: 'fixed', top: (rightMenuData.Y + 96) + 'px', left: rightMenuData.X + 96 + 'px' }">
          <li class="submenu-item" v-for="(item,index) in IndexData" :key="index" @click="changeIndex(item)">
            <a class="level2">{{item}}</a>
          </li>
        </ol>
      </a>
    </li>
    <li class="menu-item" v-show="chartType==='history'">
      <a class="level1" @click="changeMenu('启用拖拽')">
        <div class="title">启用拖拽</div>
        <div class="arrow-0"></div>
      </a>
    </li>
    <li class="menu-item" v-show="chartType==='history'">
      <a class="level1" @click="changeMenu('区间选择')">
        <div class="title">区间选择</div>
        <div class="arrow-0"></div>
      </a>
    </li>
    <li class="menu-item" v-show="chartType==='history'">
      <a class="level1" @click="changeMenu('画图工具')">
        <div class="title">画图工具</div>
        <div class="arrow-0"></div>
      </a>
    </li>
    <li class="menu-item" v-show="chartType==='history'">
      <a class="level1" @click="changeMenu('BS查看')">
        <div class="title">BS查看</div>
        <div class="arrow-0"></div>
      </a>
    </li>
    <li class="menu-item" v-show="chartType==='history'">
      <!-- 是否自选(1:是, 0:不是) -->
      <a class="level1" v-if="isCollect === 0" @click="changeMenu('添加自选股')">
        <div class="title" :class="{'disabled': isOk }" @click="onAdd()">添加自选股</div>
        <div class="arrow-0"></div>
      </a>
      <a class="level1" v-if="isCollect === 1" @click="changeMenu('移除自选股')">
        <div class="title" :class="{'disabled': isOk }" @click="onRemove()">移除自选股</div>
        <div class="arrow-0"></div>
      </a>
    </li>
  </ul>
</template>

<script>
  import '../../../../vendor/jscommon/umychart.resource/css/tools.css'
  import '../../../../vendor/jscommon/umychart.resource/font/iconfont.css'
  import jsChart from '../../../../vendor/jscommon/umychart.vue/umychart.vue.js'
  import eventBus from '@/utils/bus.js'
  import {createCollect, deleteCollect} from '@/api'
  import {getToken} from '@/utils/auth'

  jsChart.JSConsole.Chart.Log = () => { }
  jsChart.JSConsole.Complier.Log = () => { }

  export default {
    name: 'RightMenu',
    props: {
      isShowContextMenu: {
        type: Boolean
      },
      rightMenuData: {
        type: Object
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
      stock: {
        type: Object
      }
    },
    data() {
      return {
        IndexData: ['MACD', 'DMI', 'DMA', 'FSL', 'BRAR', 'CR', 'VR', 'OBV', 'KDJ', 'RSI', 'WR', 'CCI', 'TRIX', 'EMV', 'VOL'],

        params: {
          token: null,
          currency_id: null
        },
        isOk: false,
        stockData: null,
        isCollect: null
      }
    },
    created() {
      this.getEventData()
      this.stockData = this.stock
      this.isCollect = this.stock.is_collect
    },
    methods: {
      getEventData() {
        eventBus.$on('CollectDataV2', (data) => {
          this.stockData = data
          this.isCollect = data.is_collect
        })
      },
      changeMenu(item) {
        switch (item) {
          case '启用拖拽':
            this.ChangeDragType(1)
            break
          case '区间选择':
            this.ChangeDragType(2)
            break
          case '画图工具':
            this.showTools()
            break
          case '添加/移除自选股':
            break
          case 'BS查看':
            this.showBSDetail()
            break
        }
      },
      ChangeDragType(index) {
        if (this.historyChart != null) {
          this.historyChart.JSChartContainer.DragMode = index // 1 数据拖拽 2 区间选择
        }
      },
      showTools() {
        if (this.historyChart != null) {
          eventBus.$emit('updateDrag', true)
        }
      },
      changeIndex(item) {
        if (this.rightMenuData.FrameID === 0) return // 主图不切换指标
        if (this.chartType === 'history') {
          this.historyChart.ChangeIndex(this.rightMenuData.FrameID, item)
        } else if (this.chartType === 'minute') {
          this.minuteChart.ChangeIndex(this.rightMenuData.FrameID, item)
        }
      },
      onAdd() {
        this.params.token = getToken()
        this.params.currency_id = this.stockData.id
        this.isOk = true
        createCollect(this.params).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.isOk = false
          this.isCollect = 1
          this.stockData.is_collect = this.isCollect
          eventBus.$emit('CollectData', this.stockData)
        })
      },
      onRemove() {
        this.params.token = getToken()
        this.params.currency_id = this.stockData.id
        this.isOk = true
        deleteCollect(this.params).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.isOk = false
          this.isCollect = 0
          this.stockData.is_collect = this.isCollect
          eventBus.$emit('CollectData', this.stockData)
        })
      },
      showBSDetail() {
        eventBus.$emit('showBSDetailEvent', true)
      }
    }
  }
</script>

<style lang="scss" scoped>
  * {
    /*outline: 1px solid red;*/
  }

  ul.contextmenu-container {
    width: 150px;
    position: absolute;
    z-index: 500;
    overflow: auto;
    border: 1px solid #b5b7b9;
    background-color: #fff;
    color: #333 !important;

    > li.menu-item {
      font-family: Tahoma, Arial, sans-serif;
      font-size: 14px;
      cursor: pointer;
      width: 100%;
      height: 29px;
      display: flex;
      align-items: center;
      position: relative;

      a.level1 {
        padding-left: 18px;
        padding-right: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100%;

        div.title {
          white-space: nowrap;
        }

        div.title.disabled {
          pointer-events: none; /*不可点击元素*/
        }

        div.arrow-right {
          background-image: url(../../../../assets/icons/common/arrowright.png);
          background-repeat: no-repeat;
          background-position: 50%;
          width: 20px;
          height: 20px;
        }

        div.arrow-0 {
          width: 20px;
          height: 20px;
        }

        ol.submenu-container {
          display: none;
        }
      }

      a.level1:hover {
        background: #f2f3f5;

        &.disabled {
          cursor: not-allowed;

          ol.submenu-container {
            display: none;
          }
        }
      }

      a.level1:hover {
        ol.submenu-container {
          position: absolute;
          top: 0;
          left: 100%;
          width: 140px;
          display: flex;
          flex-direction: column;
          z-index: 500;
          background: #fff;

          li.submenu-item {
            width: 100%;
            height: 29px;

            a.level2 {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              padding-left: 18px;
              padding-right: 4px;
            }

            a.level2:hover {
              background: #f2f3f5
            }
          }
        }
      }

    }
  }
</style>
