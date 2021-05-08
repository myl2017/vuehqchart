<template>
  <Layout class-prefix="layout-wrapper active" :chartType="chartType" :minuteChart="JSEnvironment.MinuteChart" :historyChart="JSEnvironment.HistoryChart"
          :userData="userData">
    <div class="container HQChartPC">
      <!--导航条 -->
      <div class="navgation">
        <div class="navBarWrap">
          <div class="navBar">
            <a class="item" v-for='(navItem,idx) in NarBarArry' :key='idx' :class='navIndex == navItem ? "active":""'
               href="javascript:;" @click='ChangeChartByNav(idx,navItem)' @keyup.f5="HandleF5Switch(idx,$event)">{{navItem}}</a>
          </div>
          <div class="kLineSetWrap" id='kLineSetWrap'>
            <!-- 分时图设置导航条 -->
            <div class="item" v-for='(menuMinuteOne,index) in MenuMinuteData' v-show="IsChartShow.MinuteChartShow"
                 @click='openMenuTwo(index)'>
              <p class="menuOne" :class='{light:IndexInMinute == index}'>
                <span>更多</span>
                <i class="iconfont" :class='MenuOneIndex == index ? "icon-shang" : "icon-xia"'></i>
              </p>
              <ul class="menuTwo" v-show='IndexInMinute == index ? true:false' v-if="index === 0">
                <li class="twoLevelMenu" v-for='(minuteIndex,ind) in menuMinuteOne.Children' :class='{active:menuMinuteOne.ActiveIndex==ind}' :key='ind'
                    @click.stop='changeKLineChart(menuMinuteOne,minuteIndex,ind)'>
                  <div @click.stop="ChangeChartByNav(ind, minuteIndex)">{{minuteIndex}}</div>
                </li>
              </ul>
              <ul class="menuTwo" v-show='IndexInMinute == index ? true:false' v-else>
                <li class="twoLevelMenu" v-for='(minuteIndex,ind) in menuMinuteOne.Children'
                    :class='{active:menuMinuteOne.ActiveIndex==ind}' :key='ind'
                    @click.stop='changeKLineChart(menuMinuteOne,minuteIndex,ind)'>{{minuteIndex}}
                </li>
              </ul>
            </div>
            <!-- k线设置导航条 -->
            <div class="item" v-for='(menuOne,index) in MenuData' :key='index' @click='openMenuTwo(index)' v-show="IsChartShow.KlineChartShow">
              <p class="menuOne" :class='{light:MenuOneIndex == index}'>
                <span v-if="index === 0">更多</span>
                <span v-else-if="index === 1" @click="handlerOpen" v-show="devicePixel>1366" class="zb-deal">逐笔成交</span>
                <span v-else-if="index === 2">画图工具</span>
                <span v-else-if="index === 3" @click="handlerSimple">简约视图</span>
                <span v-else-if="index === 4" @click="handleFullScreen">全屏视图</span>
                <template v-if="index === 0 || index === 2"><i class='iconfont' :class='MenuOneIndex == index ? "icon-shang" : "icon-xia"'></i></template>
              </p>
              <ul class="menuTwo" v-show='MenuOneIndex == index ? true:false' v-if="index === 0">
                <li class="twoLevelMenu" v-for='(name,ind) in menuOne.Children' :class='{active:menuOne.ActiveIndex == ind}' :key='ind'
                    @click.stop='changeKLineChart(menuOne,name,ind)'>
                  <div @click.stop="ChangeChartByNav(ind, name)" :class='navIndex == name ? "active":""'>{{name}}</div>
                </li>
              </ul>
              <ul class="menuTwo" v-show='MenuOneIndex == index ? true:false' v-else>
                <li class="twoLevelMenu" v-for='(name,ind) in menuOne.Children' :class='{active:menuOne.ActiveIndex == ind}' :key='ind'
                    @click.stop='changeKLineChart(menuOne,name,ind)'>{{name}}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="right-gap"></div>
      </div>

      <!--画图工具-->
      <div class="brushTool" v-if="DrawTool.IsShow">
        <Stockdrawtool @CurrentIcon="CurrentIcon" @IsShowBrushTool="isShowBrushTool" :topheight="topheight" :totalheight="totalheight"></Stockdrawtool>
      </div>

      <div class="chartDataWrap">
        <div class="leftChart">
          <div id="minuteChartID" ref="minuteChartID" style="position: relative;" v-show="IsChartShow.MinuteChartShow"></div>
          <div id="kLine" ref='kLine' style="position: relative;" v-show="IsChartShow.KlineChartShow"></div>

          <div class="indexList minuteIndexList" v-show='BottomIndexShow'>
                          <span v-for='(item,index) in IndexBottomData.children' :key='index'
                                :class='{active:BottomIndexForMinute == index}'
                                @click='ChangeBottomIndex(item,index)'>{{item}}</span>
          </div>
          <div class="indexList historyIndexList" v-show='!BottomIndexShow'>
                  <span v-for='(item,index) in IndexBottomData.children' :key='index'
                        :class='{active:BottomIndexForHistory == index}'
                        @click='ChangeBottomIndex(item,index)'>{{item}}</span>
          </div>

          <template v-if="devicePixel > 1366">
            <div class="notice-switch" @click="onCollapse">
              <div class="switch-off" v-if="isCollapse">
                <img src="../../assets/icons/common/arrowdown.png" alt="">
              </div>
              <div class="switch-on" v-else>
                <img src="../../assets/icons/common/arrowup.png" alt="">
              </div>
            </div>
            <NoticeCard v-if="isOpen" :CurrentStock="CurrentStock" :collapseSwitch="isCollapse"/>
          </template>
          <EveryDealCard v-show="!isOpen"/>
          <ContextMenu :isShowContextMenu="isShowContextMenu" :rightMenuData="rightMenuData" :chartType="chartType" :minuteChart="JSEnvironment.MinuteChart"
                       :historyChart="JSEnvironment.HistoryChart" :stock="CurrentStock"/>
        </div>
        <div class="rightData" v-show="!isFullScreen">
          <NoteCard :note-data="noteData"/>
          <TabBar/>
          <MarketCard :sell-list="sellList" :buy-list="buyList" :number.sync="number" :tab-type="tabType" :note-data="noteData"/>
          <DetailCard :deal-data="DealData" v-show="dealVisible"/>
        </div>
      </div>

      <!--自定义指标-->
      <IndexDialog v-show="isShowIndex" :indexData="indexData" :jsChart="currentChart" :complierError="complierError" :isDebug="isDebug"></IndexDialog>

      <el-dialog title="提示" :visible.sync="dialogVisible" width="24%" class="custom-dialog">
        <span>确认要删除该指标吗？</span>
        <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="confirmDelete()" :disabled="isOk">确 定</el-button>
                </span>
      </el-dialog>

      <BSDialog v-if="isBSDialog" :BSDateAry="BSDateAry" :BSTimeAry="BSTimeAry" :bsList="bsList" :CurrentBSSymbol="currentBSSymbol"></BSDialog>

    </div>
  </Layout>
</template>

<script>
  import '../../vendor/jscommon/umychart.resource/css/tools.css'
  import '../../vendor/jscommon/umychart.resource/font/iconfont.css'
  import '../../vendor/content/css/iconfont-bs.css'
  import '../../vendor/content/js/webfont.js'
  import jsChart from '../../vendor/jscommon/umychart.vue/umychart.vue.js'
  import '../../vendor/jscommon/umychart.complier.js'
  import $ from 'jquery'
  import jsStock from '../../vendor/jscommon/umychart.vue/umychart.stock.vue.js'
  import pako from 'pako'

  import Stockdrawtool from '../../components/HQChart/stockdrawtool'
  import Layout from '../layout/Layout'
  import eventBus from '@/utils/bus.js'
  import NoteCard from './components/index/NoteCard'
  import TabBar from './components/index/TabBar'
  import MarketCard from './components/index/MarketCard'
  import DetailCard from './components/index/DetailCard'
  import NoticeCard from './components/index/NoticeCard'
  import EveryDealCard from './components/index/EveryDealCard'
  import ReconnectingWebSocket from 'reconnecting-websocket'
  import ContextMenu from './components/index/ContextMenu'
  import IndexDialog from './components/dialog/IndexDialog'
  import {deleteIndex, getPaintList, addPaintData, editPaint} from '@/api'
  import {getToken} from '../../utils/auth'
  import {deleteFuncs, queryUserCustomIndex} from '../../utils/sqlHelper'
  import {xDateFormat, xTimeFormat} from '../../utils'
  import BSDialog from './components/dialog/BSDialog'

  jsChart.JSConsole.Chart.Log = () => { }
  jsChart.JSConsole.Complier.Log = () => { }

  export default {
    name: 'Hq',
    components: {BSDialog, IndexDialog, ContextMenu, EveryDealCard, NoticeCard, DetailCard, MarketCard, TabBar, NoteCard, Layout, Stockdrawtool},
    data() {
      return {
        GlobalSymbol: '000001.sz',
        pageData: null,
        pageDataColor: null,
        IndexBottomData: {},
        IndexBottomForHistory: {
          type: 'history',
          children: ['MACD', 'DMI', 'DMA', 'FSL', 'BRAR', 'CR', 'VR', 'OBV', 'KDJ', 'RSI', 'WR', 'CCI', 'TRIX', 'EMV', 'VOL']
        },
        IndexBottomForMinute: {
          type: 'minute',
          children: ['MACD', 'DMI', 'DMA', 'FSL', 'BRAR', 'CR', 'VR', 'OBV', 'KDJ', 'RSI', 'WR', 'CCI', 'TRIX', 'EMV', 'VOL']
        },
        IndexInMinute: 999, // 副图指标下标
        IndexActive: 'active',
        MenuOneSelected: false,
        MenuMinuteData: [
          {
            Text: '周期',
            ActiveIndex: null,
            Children: ['1分', '5分', '15分', '月线']
          }
        ],
        MenuData: [ // 逐笔成交，画图工具，简约视图，全屏视图
          {
            Text: '周期',
            ActiveIndex: null,
            Children: ['1分', '5分', '15分', '月线']
          },
          {
            Text: '逐笔成交',
            ActiveIndex: null
          },
          {
            Text: '画图工具',
            ActiveIndex: null,
            Children: ['画图工具']
          },
          {
            Text: '简约视图',
            ActiveIndex: null
          },
          {
            Text: '全屏视图',
            ActiveIndex: null
          }
        ],
        ExtendChart: null, // 绘制画图工具
        MenuOneIndex: 999, // 一级菜单下标
        MenuOneSelectedIndex: 0, // 一级菜单下标
        _NarBarArry: ['分时图', '5分钟', '15分钟', '1小时', '4小时', '日线'],
        NarBarArry: ['分时图', '日线', '周线', '30分', '60分', '4小时'],
        IsChartShow: {
          MinuteChartShow: true,
          FiveMinuteChartShow: false,
          KlineChartShow: false
        },
        SpellStockShow: { // 股票联想是否显示
          Input: false,
          List: false
        },
        MenuTwoIndex: null, // 二次菜单下标
        currentDirection: 'icon-xia', // 下拉列表的三角
        SearchSymbols: null, // 联想股票数据
        inputSymbolStr: '', // 输入的股票代码
        navIndex: '分时图', // 默认选中分时
        BottomIndexForMinute: null, // 底部指标下标
        BottomIndexForHistory: null, // 底部指标下标
        BottomIndexShow: true,
        TrueWidth: 1104, // 画布实际宽度
        JSEnvironment: {
          Name: '',
          KLineIndex: [ // K线指标
            {Name: 'KDJ', Index: 'KDJ'},
            {Name: 'MACD', Index: 'MACD'},
            {Name: 'RSI', Index: 'RSI'},
            {Name: 'BOLL', Index: 'BOLL'},
            {Name: 'VOL', Index: 'VOL'},
            {Name: '均线', Index: '均线'}
          ],

          MinuteChart: null, // 走势图
          MinuteOption: null,

          HistoryChart: null, // K线图
          HistoryOption: null,

          WidthPercent: 0.653,

          FiveDMinuteChart: null,
          FiveDMinuteOption: null, // 5日分时图选项

          StockCache: null, // 股票数据
          CurrentNews: 0,
          CurrentInteract: 1,
          CurrentVisited: 2,
          CurrentNotice: 3,
          CurrentFlag: 1,
          JqTableInfo: $('<table class="tableInfo"></table>'),
          JqUlOne: $('<ul class="ulOne"><li class="noRight">不复权</li><li class="noRight active">前复权</li><li class="noRight">后复权</li><ul>'),
          JqUlTwo: $('<ul class="ulTwo"></ul>'),
          GetIndexByName: function (name) {
            for (var i in this.KLineIndex) {
              var item = this.KLineIndex[i]
              if (item.Name == name) return item.Index
            }

            return null
          },

          GetIndexName: function (index) {
            for (var i in this.KLineIndex) {
              var item = this.KLineIndex[i]
              if (item.Index == index) return item.Name
            }

            return null
          }
        },

        // 以下为WS对接参数
        Symbol: 'btcusdt.BIT',
        OriginalSymbol: 'btcusdt',

        // WSUrl_backup: 'wss://api.huobiasia.vip/ws',
        WSUrlArray: ['ws://swap.newbt.cn/', 'ws://contract.newbt.cn/', 'ws://xhusdt.newbt.cn/'],
        WSUrl: 'ws://xhusdt.newbt.cn/',
        Socket: null,
        LastSubString: null, // 最后一个订阅的数据
        SendSubString: 'kline',
        isFirstIn: false, // 是否第一访问进入
        TradesData: {
          asks: [],
          bids: []
        }, // 交易(盘口)数据
        sellList: [],
        buyList: [],
        StockData: null,       // 缓存所有显示的数据
        DateTimeRange: null,   // 交易时间段
        XCoordinateData: null, // x轴信息
        HistoryDealData: [],   // 历史成交数据
        DealData: [],          // 最终成交数据
        DrawTool: {IsShow: false}, // 画图工具可见性
        topheight: 160,
        totalheight: 300,
        CurrentStock: {}, // 股票信息

        arrayIndex: [
          {Index: 'SVG图标标记', API: {Name: 'SVG图标标记', Script: null, Args: null, Url: 'http://127.0.0.1:18080/api/jsindex'}},
          {Index: 'VOL'},
          {Index: 'RSI', Modify: true, Change: true, Overlay: true}
        ], // 历史k线默认指标
        klineIndexList: [
          {Index: 'SVG图标标记', API: {Name: 'SVG图标标记', Script: null, Args: null, Url: 'http://127.0.0.1:18080/api/jsindex'}},
          {Index: 'VOL'},
          {Index: 'RSI', Modify: true, Change: true, Overlay: true},
          {Index: 'MACD'},
          {Index: 'BOLL'}
        ], // KLine 5个窗口
        defaultIndex: [
          {Index: 'MACD'}
        ], // 默认分时图指标
        minuteIndexList: [
          {Index: 'MACD'},
          {Index: 'VOL'},
          {Index: 'RSI'},
          {Index: 'KDJ'},
          {Index: 'BOLL'}
        ], // 分时图 5个窗口

        hisChartStore: null, // 历史k线持久化指标
        FloatPrecision: 0,   // 品种的小数位数,0没小数位数
        CustomDefColorAry: {up: 'rgb(25,158,0)', down: 'rgb(238,21,21)'}, // 自定义默认颜色,绿涨红跌
        timeoutID: null,     // 取消的超时的标识符
        noteData: {rate: null},
        number: 5,
        dealVisible: true,
        isOpen: true,
        isFullScreen: false,      // 是否全屏显示
        isUpdateChart: -1,
        rightMenuData: null,      // 右键菜单信息
        chartType: 'minute',      // 默认分时
        currentPeriod: 4,         // 当前周期 默认周期1分钟
        isShowContextMenu: false,
        isOpenFormula: false,     // 监听公式管理弹框
        tabType: 'default',
        isShowIndex: false,
        indexData: {isEdit: false, data: null},
        dialogVisible: false,
        isOk: false,
        minuteFrameID: null,
        currentChart: null,
        complierError: {
          Column: null,
          Description: null,
          Index: null,
          LineNumber: null
        },
        isDebug: false,
        devicePixel: null,

        lockReconnect: false, //避免重复连接
        timeoutFlag: true,
        reconectNum: 0,
        userData: JSON.parse(localStorage.getItem('SYS_Token')),

        isCollapse: true,
        BSDataSource: null,   // BS 操盘
        BSIconAry: [],
        BSDateAry: [],
        BSTimeAry: [],
        bsList: null,
        isBSDialog: false,

        paintParams: {
          token: null,
          currency_id: null,
          symbol: null,
          period: null,
          type: null,
          paintInfo: null
        },
        paintListParam: {
          token: null,
          limit: 15,
          page: 1
        },

        windowNumber: null,
        addBSDate: {
          index: null,
          date: null,
          time: null
        },
        currentBSSymbol: null
      }
    },
    directives: {
      focus: {
        // 指令的定义
        inserted: function (el) {
          el.focus()
        }
      }
    },
    watch: {
      inputSymbolStr: function (newValue, oldValue) {
        this.SpellStock()
      },
      GlobalSymbol: function (newValue, oldValue) {
        var symbolAry = new Array()
        symbolAry.push(newValue)
      },
      $route: {
        handler(newval, oldval) { // newval:新路由信息, oldval:老路由信息。[搜索框切换请求]
          this.getUrlData()
          this.chartType === 'minute' ? this.updateMinuteChart(1) : this.updateHistoryChart(this.currentPeriod)
          this.createWSConnect()
        },
        // 深度观察监听
        deep: true
      }
    },
    created() {
      this.initWindowNumber()

      this.devicePixel = document.body.clientWidth
      this.JSEnvironment.StockCache = jsStock.JSStockInit()
      this.getUrlData()
      this.getEventData()

      //预加载下阿里云图片
      WebFont.load({custom: {families: ['iconfont']}})
      WebFont.load({custom: {families: ['js-iconfont']}})

      this.fetchPaintData()
    },
    mounted() {
      this.initStyle()
      this.LoadEnvironment()
      this.IndexBottomData = this.IndexBottomForMinute

      var self = this
      document.addEventListener('click', (e) => {
        if (!$('#kLineSetWrap').is(e.target) && $('#kLineSetWrap').has(e.target).length === 0) this.MenuOneIndex = 999
      })
      this.CaluChartWidthHeight(true)
      $(window).resize(function () { // 重新计算尺寸
        // self.CaluChartWidthHeight()
      })

      this.updateMinuteChart(1)
      this.createWSConnect()

    },
    destroyed() {
      // 页面关闭的时候 销毁hqchart实例 和 ws连接
      if (this.JSEnvironment.MinuteChart) this.JSEnvironment.MinuteChart.StopAutoUpdate() // 分时图
      if (this.JSEnvironment.HistoryChart) this.JSEnvironment.HistoryChart.StopAutoUpdate() // k线图
      if (this.Socket) this.Socket.close()
      if (this.timeoutID) clearTimeout(this.timeoutID)     // 阻止函数的执行
    },
    methods: {
      initWindowNumber() {
        if (window.localStorage.getItem('WindowIndexCounts')) {
          this.windowNumber = Number(window.localStorage.getItem('WindowIndexCounts'))
          this.arrayIndex = this.klineIndexList.splice(0, this.windowNumber)
          this.defaultIndex = this.minuteIndexList.splice(0, this.windowNumber - 1)
        }
      },
      fetchPaintData() {
        if (window.localStorage.getItem('kline-draw-picture-storage')) {
          // 该用户在本机已有画图存储
        } else { // 获取该用户画图信息
          this.paintListParam.token = getToken()
          getPaintList(this.paintListParam).then(res => {
            window.localStorage.setItem('kline-draw-picture-storage', res.data.list[0].paintInfo)
          })
        }
      },
      onCollapse() {
        this.isCollapse = !this.isCollapse
        // eventBus.$emit('updateChart', this.isCollapse)
      },
      getUrlData() {
        if (!this.$route.query.stock) { return }

        const STOCK = JSON.parse(this.$route.query.stock)
        let currentWSUrl = STOCK.type

        if (!currentWSUrl) { // USDT
          if (!STOCK.symbol) {
            let stockData = JSON.parse(sessionStorage.getItem('CurrentStock'))
            this.OriginalSymbol = (stockData.symbol).toLowerCase()
            this.Symbol = this.OriginalSymbol + '.BIT'
            this.CurrentStock = stockData
          } else {
            this.CurrentStock = STOCK
            this.OriginalSymbol = (this.CurrentStock.symbol).toLowerCase()
            this.Symbol = this.OriginalSymbol + '.BIT'
            sessionStorage.setItem('CurrentStock', JSON.stringify(this.CurrentStock))
          }
          if (this.WSUrl !== this.WSUrlArray[2]) {//之前不是USDT地址，关掉socket
            if (this.Socket) {
              this.Socket.close()
              this.Socket = null
            }
          }
          this.WSUrl = this.WSUrlArray[2]
          return // 不在往下执行
        }

        if (currentWSUrl === 'swap') {
          if (this.WSUrl !== this.WSUrlArray[0]) {//之前不是swap地址，关掉socket
            if (this.Socket) {
              this.Socket.close()
              this.Socket = null
            }
          }
          this.WSUrl = this.WSUrlArray[0]
        }
        if (currentWSUrl === 'contract') {
          if (this.WSUrl !== this.WSUrlArray[1]) {//之前不是swap地址，关掉socket
            if (this.Socket) {
              this.Socket.close()
              this.Socket = null
            }
          }
          this.WSUrl = this.WSUrlArray[1]
        }

        // 合约 ws 发送参数
        if (!STOCK.contract_short_type) {
          this.CurrentStock = STOCK
          this.OriginalSymbol = this.CurrentStock.symbol
          this.Symbol = this.OriginalSymbol + '.BIT'
          sessionStorage.setItem('CurrentStock', JSON.stringify(this.CurrentStock))
        } else {
          this.CurrentStock = STOCK
          this.OriginalSymbol = this.CurrentStock.contract_short_type
          this.Symbol = this.OriginalSymbol + '.BIT'
          sessionStorage.setItem('CurrentStock', JSON.stringify(this.CurrentStock))
        }

      },
      initStyle() {
        jsChart.jsChartStyle({
          UpBarColor: this.CustomDefColorAry.up,
          DownBarColor: this.CustomDefColorAry.down,
          UpTextColor: this.CustomDefColorAry.up,
          DownTextColor: this.CustomDefColorAry.down
        })
      },
      createWSConnect() {
        if (!this.$route.query.stock) { return }

        const STOCK = JSON.parse(this.$route.query.stock)
        if (!STOCK) return

        let stockType = STOCK.type
        if (stockType) {      // 合约行情
          this.timeoutID = setTimeout(() => {
            this.SubOverviewV2()                 // 概览
            this.SubscribeTradesRealtimeData()   // 盘口
            this.SubscribeDealRealtimeData()     // 逐笔成交
          }, 3500)
        } else { // USDT
          this.timeoutID = setTimeout(() => {
            this.SubOverviewV2()                 // 概览
            this.SubscribeTradesRealtimeData()   // 盘口
            this.SubscribeDealRealtimeData()     // 逐笔成交
          }, 1500)
        }
      },
      handlerOpen() {
        this.isOpen = !this.isOpen
      },
      handlerSimple() {
        this.isFullScreen = false
        this.isUpdateChart = -1
        this.CaluChartWidthHeight(this.isUpdateChart)
      },
      handleFullScreen() {
        this.isFullScreen = true
        this.CaluChartWidthHeight(1)
      },
      getEventData() {
        eventBus.$on('updateDeal', (data) => {
          this.dealVisible = data
        })

        eventBus.$on('updateChart', (data) => {
          this.isUpdateChart = data
          this.CaluChartWidthHeight(data)
        })

        eventBus.$on('updateDrag', (data) => {
          this.DrawTool.IsShow = data
        })

        eventBus.$on('toggleFormula', (data) => {
          this.isOpenFormula = data
        })

        eventBus.$on('toggleIndex', (data) => {
          if (data.isEdit === true) { // 编辑
            const customIndexStr = sessionStorage.getItem('CustomIndex')
            if (customIndexStr) {
              this.indexData = JSON.parse(customIndexStr)
              this.isShowIndex = data.isShow
              this.currentChart = data.jsChart
            } else {
              this.$message({
                message: '请先选择自定义指标后再修改',
                type: 'warning'
              })
              this.indexData = {isEdit: false, data: null}
              this.currentChart = null
            }
          } else if (data.isEdit === false) { // 新建
            this.isShowIndex = data.isShow
            this.indexData = data
            this.currentChart = data.jsChart
          } else if (data.isEdit === 0) { // 删除
            this.dialogVisible = true
            this.indexData = data
            this.currentChart = data.jsChart
          } else if (data.isEdit === -1) { // 关闭
            this.isShowIndex = data.isShow
            this.indexData = data
            this.currentChart = null
          }
        })

        eventBus.$on('update:rows', (data) => {
          this.tabType = data
        })

        eventBus.$on('debugError', (data) => {
          this.isDebug = data
        })

        eventBus.$on('bsData', (data) => {
          this.bsList = data
          let bsData = JSON.parse(data)
          this.BSDataSource = bsData.filter(item => {
            return item.type === 1
          })

          this.BSDataFormat()
        })

        eventBus.$on('showBSDetailEvent', data => {
          this.isBSDialog = data
        })

        eventBus.$on('addBSIcon', data => {
          if (data) {
            this.BSDataSource.push(data)

            this.addBSDate.index = this.BSDataSource.length - 1
            this.addBSDate.date = Number(xDateFormat(data.create_at))
            this.addBSDate.time = Number(xTimeFormat(data.create_at))

            this.bsList = JSON.stringify(this.BSDataSource)
            this.BSDataFormat()
            this.$nextTick(() => {
              this.$forceUpdate()
            })
          }
        })

      },
      confirmDelete() {
        const customIndexStr = sessionStorage.getItem('CustomIndex')
        if (customIndexStr) {
          this.indexData = JSON.parse(customIndexStr)
        } else {
          this.$message({
            message: '请先选择自定义指标后再删除',
            type: 'warning'
          })
          this.indexData = {isEdit: false, data: null}
          return
        }

        deleteIndex({token: getToken(), quota_id: this.indexData.data.id}, (res) => {
          return false
        }).catch(err => {
          this.$message.error('操作有误')
          return
        })

        this.$message({
          message: '删除成功',
          type: 'success'
        })
        sessionStorage.removeItem('CustomIndex')
        deleteFuncs(this.indexData.data.name).then(res => {
        })

        this.dialogVisible = false
        $('.jchart-changeindex-box').css('display', 'none')

      },
      goBack() {
        this.$router.push({path: '/'})
      },
      ShowSpell() {
        this.SpellStockShow.Input = true
        this.inputSymbolStr = ''
      },
      HideSpell() {
        this.SpellStockShow.Input = false
        this.SpellStockShow.List = false
      },
      ChangeCurrentRight(index) {
        if (this.JSEnvironment.HistoryChart != null) {
          this.JSEnvironment.HistoryChart.ChangeRight(index)
        }
      },
      ChangeCurrentIndex(indexName) {
        // 切换二级菜单指标
        // 通过classname判断点击了哪个位置的元素
        if (this.JSEnvironment.HistoryChart != null) {
          this.JSEnvironment.HistoryChart.ChangeIndex(1, indexName)
        }
      },
      ChangeBottomIndex(indexName, ind) { // 切换图形底部指标
        this.isShowContextMenu = false
        if (this.IndexBottomData.type == 'history' && this.JSEnvironment.HistoryChart != null) {
          this.JSEnvironment.HistoryChart.ChangeIndex(1, indexName)
          this.BottomIndexForHistory = ind
        } else if (this.IndexBottomData.type == 'minute' && this.JSEnvironment.MinuteChart != null) {
          if (!this.minuteFrameID) {
            this.JSEnvironment.MinuteChart.ChangeIndex(1, indexName)
          } else {
            this.JSEnvironment.MinuteChart.ChangeIndex(this.minuteFrameID, indexName)
          }
          this.BottomIndexForMinute = ind
        }
      },
      ChangeInsCurrentIndex: function (typeName) {
        var chart = this.JSEnvironment.HistoryChart
        var newArry = this.MenuData[2].Children
        if (chart != null) {
          if (typeName == '删除五彩K线') {
            chart.CancelInstructionIndex()
            newArry.splice(newArry.length - 1, 1)
          } else {
            chart.ChangeInstructionIndex('五彩K线-' + typeName)
            if (newArry.indexOf('删除五彩K线') == -1) {
              newArry.push('删除五彩K线')
            }
          }
        }
      },
      ChangeSystem(name) {
        var chart = this.JSEnvironment.HistoryChart
        var newArry = this.MenuData[3].Children
        if (chart != null) {
          if (name == '删除专家系统') {
            chart.CancelInstructionIndex()
            newArry.splice(newArry.length - 1, 1)
          } else {
            if (newArry.indexOf('删除专家系统') == -1) {
              newArry.push('删除专家系统')
            }
            chart.ChangeInstructionIndex('交易系统-' + name)
          }
        }
      },
      ChangeOVerlay(index) {
        var chart = this.JSEnvironment.HistoryChart
        var currentAry = this.MenuData[4].Children
        if (chart != null) {
          if (index > 5) {
            chart.ClearOverlaySymbol()// 取消叠加
            currentAry.splice(currentAry.length - 1, 1)
          } else {
            switch (index) {
              case 0:
                chart.OverlaySymbol('000001.sh')
                break
              case 1:
                chart.OverlaySymbol('399001.sz')
                break
              case 2:
                chart.OverlaySymbol('399005.sz')
                break
              case 3:
                chart.OverlaySymbol('399006.sz')
                break
              case 4:
                chart.OverlaySymbol('000300.sh')
                break
              case 5:
                chart.ClearOverlaySymbol()
                break
            }
            if (currentAry.indexOf('取消叠加') == -1) {
              currentAry.push('取消叠加')
            }
          }
        }
      },
      ChangeMainLineType(index) {
        if (this.JSEnvironment.HistoryChart != null) {
          switch (index) {
            case 0:
              this.JSEnvironment.HistoryChart.ChangeKLineDrawType(3)
              break
            case 1:
              this.JSEnvironment.HistoryChart.ChangeKLineDrawType(0)
              break
            case 2:
              this.JSEnvironment.HistoryChart.ChangeKLineDrawType(2)
              break
            case 3:
              this.JSEnvironment.HistoryChart.ChangeKLineDrawType(1)
              break
          }
        }
      },
      ChangeCurrentCoordinateType(index) {
        if (this.JSEnvironment.HistoryChart != null) {
          this.JSEnvironment.HistoryChart.JSChartContainer.ChangeCoordinateType(index)
        }
      },
      ChangeStock(code) {
        this.GlobalSymbol = code
        this.SpellStockShow.Input = false
        this.SpellStockShow.List = false
        if (this.JSEnvironment.MinuteChart != null) {
          this.JSEnvironment.MinuteChart.ChangeSymbol(code)
        }
        if (this.JSEnvironment.HistoryChart != null) {
          this.JSEnvironment.HistoryChart.ChangeSymbol(code)
        }
      },
      ChangeWindowCount(index) {
        if (this.JSEnvironment.HistoryChart != null) {
          this.JSEnvironment.HistoryChart.ChangeIndexWindowCount(index + 1)
        }
      },
      ChangeDragType(index) {
        if (this.JSEnvironment.HistoryChart != null) {
          this.JSEnvironment.HistoryChart.JSChartContainer.DragMode = index
        }
      },
      showTools() {
        if (this.JSEnvironment.HistoryChart != null) {
          this.DrawTool.IsShow = true
        }
      },
      CurrentIcon(name) {
        this.JSEnvironment.HistoryChart.JSChartContainer.CreateChartDrawPicture(name, function (drawChart) { this.OnFinishDraw(drawChart) })
        if (name === '全部删除') {
          this.JSEnvironment.HistoryChart.JSChartContainer.ClearChartDrawPicture()
        }
      },
      OnFinishDraw(drawChart) {
        console.log('OnFinishDraw::: ', drawChart)
      },
      isShowBrushTool(brushTool) {
        this.DrawTool.IsShow = brushTool
      },
      openMenuTwo(ind) { // 展开二级菜单
        this.isOpenFormula = false
        this.currentDirection = 'icon-shang'
        if (this.IsChartShow.MinuteChartShow) { // 分时图
          this.IndexInMinute = ind
        } else {
          this.MenuOneIndex = ind
          this.MenuOneSelectedIndex = ind
        }
      },
      SpellStock() { // 股票联想
        var inputText = this.inputSymbolStr
        var spellData = {
          Input: inputText,
          Start: 0,
          End: 10,
          Callback: this.RequestSpell
        }
        var Url = 'https://opensource.zealink.com/API/StockSpell'
        $.ajax({
          url: Url,
          method: 'POST',
          data: {
            'input': spellData.Input,
            'start': spellData.Start,
            'end': spellData.End
          },
          dataType: 'json',
          success(res) {
            if (res.code == 0) {
              spellData.Callback(res.stock)
            }
          },
          fail(res) {
          }
        })
      },
      RequestSpell(data) {
        if (data.length > 0) {
          this.SpellStockShow.List = true
          this.SearchSymbols = data
        } else {
          this.SpellStockShow.List = false
        }
      },
      changeKLineChart(currentData, name, ind) { // 参数：一级菜单名称，二级菜单内容，二级菜单下标
        this.MenuOneIndex = 999 // 下标不相等，隐藏二级菜单
        this.IndexInMinute = 999
        this.currentDirection = 'icon-xia'
        currentData.ActiveIndex = ind
        var text = currentData.Text
        // 修改一级菜单文本
        // this.MenuData[index].Text = name;
        switch (text) {
          case '副图指标':
            if (this.JSEnvironment.MinuteChart != null) {
              this.JSEnvironment.MinuteChart.ChangeIndex(1, name)
            }
            break
          case '分析周期':
            this.updateHistoryChart(ind)
            break
          case '复权处理':
            this.ChangeCurrentRight(ind)
            break
          case '指标切换':
            this.ChangeCurrentIndex(name)
            break
          case '五彩K线':
            this.ChangeInsCurrentIndex(name)
            break
          case '专家系统':
            this.ChangeSystem(name)
            break
          case '叠加品种':
            this.ChangeOVerlay(ind)
            break
          case '主图线型':
            this.ChangeMainLineType(ind)
            break
          case '坐标类型':
            this.ChangeCurrentCoordinateType(ind)
            break
          case '窗口个数':
            this.ChangeWindowCount(ind)
            break
          case '鼠标拖拽':
            this.ChangeDragType(ind)
            break
          case '画图工具':
            this.showTools()
            break
        }
      },
      LoadEnvironment() {

        this.JSEnvironment.MinuteOption =
          {
            Type: '分钟走势图', // 创建图形类型

            Windows: this.defaultIndex,

            Symbol: this.Symbol,
            IsAutoUpdate: false, // 是自动更新数据
            DayCount: 1, // 1 最新交易日数据 >1 多日走势图
            IsShowRightMenu: false, // 是否显示右键菜单

            ScriptError: this.ComplierError,

            MinuteLine:
              {
                IsDrawAreaPrice: false,      //是否画价格面积图
                IsShowAveragePrice: false,   //不显示均线
                SplitType: 2,
              },

            Border: // 边框
              {
                Left: 5, // 左边间距
                Right: 60, // 右边间距
                Top: 30
              },


            Frame: // 子框架设置
              [
                {SplitCount: 5, IsShowLeftText: false, IsShowRightText: true, Custom: [{Type: 0, Position: 'right'}]},
                {SplitCount: 3, IsShowLeftText: false, IsShowRightText: true},
                {SplitCount: 2, IsShowLeftText: false, IsShowRightText: true}
              ],

            ExtendChart: // 扩展图形
              [
                {Name: 'MinuteTooltip'} // 手机端tooltip
              ],
            DrawTool: {StorageKey: 'minute-draw-picture-storage'},  //数据可以保存到storage里面

          }

        // K线图配置
        this.JSEnvironment.HistoryOption =
          {
            Type: '历史K线图',

            DragDownload:
              {
                Minute: {Enable: true}, // 开启分钟数据拖拽下载
                Day: {Enable: true} // 开启日线数据拖拽下载
              },

            Windows: this.arrayIndex,
            Symbol: this.Symbol,
            IsAutoUpdate: false, // 是自动更新数据(不自动更新由外部更新)
            IsApiPeriod: true, // 使用Api计算周期
            IsShowRightMenu: false, // 右键菜单
            KLineDoubleClick: true,  // 双击分钟走势图

            ScriptError: this.ComplierError,

            KLine: // K线设置
              {
                DragMode: 1, // 拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
                Right: 0, // 复权 0 不复权 1 前复权 2 后复权
                Period: 4, // 周期 0 日线 1 周线 2 月线 3 年线
                MaxReqeustDataCount: 1000, // 数据个数
                MaxRequestMinuteDayCount: 15, // 分钟数据取5天
                PageSize: 120, // 一屏显示多少数据
                IsShowTooltip: true, // 是否显示 div K线提示信息 (手机端要填false)
                DrawType: 0, // K线类型 0=实心K线柱子 1=收盘价线 2=美国线 3=空心K线柱子 4=收盘价面积图
                RightSpaceCount: 3
              },

            KLineTitle: // 标题设置
              {
                IsShowName: true, // 不显示股票名称
                IsShowSettingInfo: true // 不显示周期/复权
              },

            Border: // 边框
              {
                Left: 5, // 左边间距
                Right: 60, // 右边间距
                Top: 30
              },

            DrawTool: {StorageKey: 'kline-draw-picture-storage'},  //数据可以保存到storage里面

            Frame: // 子框架设置
              [
                {SplitCount: 10, StringFormat: 0, IsShowLeftText: false, IsShowRightText: true, Custom: [{Type: 0, Position: 'right'}]},
                {SplitCount: 4, StringFormat: 0, IsShowLeftText: false, IsShowRightText: true},
                {SplitCount: 4, StringFormat: 0, IsShowLeftText: false, IsShowRightText: true}
              ]
          }
      },
      ComplierError(error, res) {
        this.complierError = error
        this.isDebug = true
      },
      ChangeChartByNav(idx, item) {
        $('#kLine .jchart-changeindex-box').hide()
        $('#minuteChartID .jchart-changeindex-box').hide()

        this.isOpenFormula = false
        this.MenuOneIndex = 999 // 下标不相等，隐藏二级菜单
        this.IndexInMinute = 999
        this.currentDirection = 'icon-xia'

        const text = item
        this.navIndex = text

        if (text === '分时图') {
          this.IsChartShow = {
            MinuteChartShow: true,
            KlineChartShow: false
          }
          this.updateMinuteChart(1)
          this.IndexBottomData = this.IndexBottomForMinute
          this.BottomIndexShow = true
          this.DrawTool.IsShow = false

          this.chartType = 'minute'

        } else if (text === '五日') {
          this.IsChartShow = {
            MinuteChartShow: true,
            KlineChartShow: false
          }
          this.updateMinuteChart(5)
          this.IndexBottomData = this.IndexBottomForMinute
          this.BottomIndexShow = true

        } else {
          this.IsChartShow = {
            MinuteChartShow: false,
            KlineChartShow: true
          }

          this.chartType = 'history'

          switch (text) {
            case '日线':
              this.currentPeriod = 0
              this.updateHistoryChart(0)
              break
            case '周线':
              this.currentPeriod = 1
              this.updateHistoryChart(1)
              break
            case '月线':
              this.currentPeriod = 2
              this.updateHistoryChart(2)
              break
            case '季线':
              this.currentPeriod = 9
              this.updateHistoryChart(9)
              break
            case '年线':
              this.currentPeriod = 3
              this.updateHistoryChart(3)
              break
            case '1分':
              this.currentPeriod = 4
              this.updateHistoryChart(4)
              break
            case '5分':
              this.currentPeriod = 5
              this.updateHistoryChart(5)
              break
            case '15分':
              this.currentPeriod = 6
              this.updateHistoryChart(6)
              break
            case '30分':
              this.currentPeriod = 7
              this.updateHistoryChart(7)
              break
            case '60分':
              this.currentPeriod = 8
              this.updateHistoryChart(8)
              break
            case '4小时':
              this.currentPeriod = 12
              this.updateHistoryChart(12)
              break
          }
          this.IndexBottomData = this.IndexBottomForHistory
          this.BottomIndexShow = false

          this.BSDataFormat()

        }
        // this.hideMenuTwo()
      },
      HandleF5Switch(idx, event) {
        this.isOpenFormula = false
        var text = '分时图'
        if ($('.klineframe-toolbar')) {
          $('.klineframe-toolbar').remove()
        }
        if (this.navIndex == '分时图') {
          this.navIndex = '日线'
          text = '日线'
        } else if (this.navIndex == '日线') {
          this.navIndex = '周线'
          text = '周线'
        } else if (this.navIndex == '周线') {
          this.navIndex = '30分'
          text = '30分'
        } else if (this.navIndex == '30分') {
          this.navIndex = '60分'
          text = '60分'
        } else if (this.navIndex == '60分') {
          this.navIndex = '4小时'
          text = '4小时'
        } else if (this.navIndex == '4小时') {
          this.navIndex = '分时图'
          text = '分时图'
        }

        if (text === '分时图') {
          this.IsChartShow = {
            MinuteChartShow: true,
            KlineChartShow: false
          }
          this.updateMinuteChart(1)
          this.IndexBottomData = this.IndexBottomForMinute
          this.BottomIndexShow = true
        } else if (text === '五日') {
          this.IsChartShow = {
            MinuteChartShow: true,
            KlineChartShow: false
          }
          this.updateMinuteChart(5)
          this.IndexBottomData = this.IndexBottomForMinute
          this.BottomIndexShow = true
        } else {
          this.IsChartShow = {
            MinuteChartShow: false,
            KlineChartShow: true
          }
          // this.MenuTwoIndex = idx - 2;  //选中对应的二级菜单
          switch (text) {
            case '日线':
              this.updateHistoryChart(0)
              break
            case '周线':
              this.updateHistoryChart(1)
              break
            case '月线':
              this.updateHistoryChart(2)
              break
            case '季线':
              this.updateHistoryChart(9)
              break
            case '年线':
              this.updateHistoryChart(3)
              break
            case '1分':
              this.updateHistoryChart(4)
              break
            case '5分':
              this.updateHistoryChart(5)
              break
            case '15分':
              this.updateHistoryChart(6)
              break
            case '30分':
              this.updateHistoryChart(7)
              break
            case '60分':
              this.updateHistoryChart(8)
              break
            case '4小时':
              this.updateHistoryChart(12)
              break
          }
          this.IndexBottomData = this.IndexBottomForHistory
          this.BottomIndexShow = false
        }
        // this.hideMenuTwo()
      },
      updateMinuteChart(count) {

        var blackStyle = jsChart.HQChartStyle.GetStyleConfig(jsChart.STYLE_TYPE_ID.BLACK_ID)
        jsChart.JSChart.SetStyle(blackStyle)

        // 更新分时图
        this.CreateDateTimeRange()

        // jsChart.JSChart.GetMinuteTimeStringData().CreateBITData = () => { return this.CreateBITDataIndex() } // 当天所有的交易时间点
        // jsChart.JSChart.GetMinuteCoordinateData().GetBITData = (upperSymbol) => { return this.XCoordinateData } // X轴刻度

        jsChart.JSChart.GetMinuteTimeStringData().CreateBITData = () => { return this.CreateBITDataIndex() }              //当天所有的交易时间点
        jsChart.JSChart.GetMinuteCoordinateData().GetBITData = (upperSymbol) => { return this.XCoordinateData }           //X轴刻度
        jsChart.MARKET_SUFFIX_NAME.GetBITDecimal = (symbol) => { return this.GetBITDecimal(symbol) }

        // 根据百分比获取分时图div的宽度
        var trueWidth = $('.leftChart').width()

        $('#minuteChartID').width(Number(trueWidth))
        if (this.devicePixel <= 1366) {
          $('#minuteChartID').height(520)
        } else {
          if (this.isUpdateChart === false) {
            $('#minuteChartID').height(836)
          } else {
            $('#minuteChartID').height(630)
          }
        }

        if (this.JSEnvironment.MinuteChart == null) {
          this.JSEnvironment.MinuteChart = jsChart.jsChartInit(document.getElementById('minuteChartID')) // 初始化走势图
          jsChart.jsChartStyle(this.JSEnvironment.MinuteOption)
          this.JSEnvironment.MinuteOption.NetworkFilter = this.NetworkFilter
          this.JSEnvironment.MinuteChart.SetOption(this.JSEnvironment.MinuteOption)
        } else {
          this.JSEnvironment.MinuteChart.ChangeDayCount(count)
          this.JSEnvironment.MinuteChart.ChangeIndexWindowCount(Number(localStorage.getItem('WindowIndexCounts')) + 1)
        }

        this.JSEnvironment.MinuteChart.AddEventCallback({event: jsChart.JSCHART_EVENT_ID.ON_CONTEXT_MENU, callback: this.minuteChartCallback})
      },
      updateHistoryChart(period) { // tests
        // 更新k线图
        // 根据百分比获取k线图div的宽度
        var trueWidth = $('.leftChart').width()

        $('#kLine').width(Number(trueWidth))
        if (this.devicePixel <= 1366) {
          $('#kLine').height(520)
        } else {
          if (this.isUpdateChart === false) {
            $('#kLine').height(836)
          } else {
            $('#kLine').height(630)
          }
        }

        if (this.JSEnvironment.HistoryChart == null) {
          this.JSEnvironment.HistoryChart = jsChart.jsChartInit(document.getElementById('kLine')) // 初始化K线图
          this.changeIndexForLocal(period)
          this.JSEnvironment.HistoryOption.Windows = this.arrayIndex
          this.JSEnvironment.HistoryOption.KLine.Period = period
          this.JSEnvironment.HistoryOption.NetworkFilter = this.NetworkFilter
          this.JSEnvironment.HistoryChart.SetOption(this.JSEnvironment.HistoryOption)
        } else {
          // 切换周期
          this.JSEnvironment.HistoryChart.ChangePeriod(period)
          // 本地持久化指标数据处理
          this.changeIndexForLocal(period)
          this.JSEnvironment.HistoryChart.ChangeIndexWindowCount(Number(localStorage.getItem('WindowIndexCounts')))
          this.JSEnvironment.HistoryChart.ChangeSymbol(this.Symbol)
        }
        this.JSEnvironment.HistoryChart.AddEventCallback({event: jsChart.JSCHART_EVENT_ID.ON_CONTEXT_MENU, callback: this.testcallback})

        //完成图形事件
        this.JSEnvironment.HistoryChart.AddEventCallback({
          event: jsChart.JSCHART_EVENT_ID.ON_FINISH_DRAWPICTURE,
          callback: (event, data, obj) => { this.OnFinishDrawPicture(event, data, obj) }
        })
      },
      OnFinishDrawPicture(event, data, obj) {
        const STOCK = JSON.parse(this.$route.query.stock)
        if (!STOCK) { return }

        this.paintParams.token = getToken()
        this.paintParams.currency_id = STOCK.id
        this.paintParams.symbol = STOCK.symbol
        this.paintParams.period = data.DrawPicture.Period
        STOCK.type === undefined ? this.paintParams.type = 'usdt' : this.paintParams.type = STOCK.type

        this.paintListParam.token = getToken()
        getPaintList(this.paintListParam).then(res => {
          if (res.data.count > 0) {
            this.paintParams.paintInfo = window.localStorage.getItem('kline-draw-picture-storage')

            editPaint(this.paintParams).then(res => {
              if (res.code === 0) {

              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            this.paintParams.paintInfo = window.localStorage.getItem('kline-draw-picture-storage')

            addPaintData(this.paintParams).then(res => {
              if (res.code === 0) {

              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      },
      minuteChartCallback(event, data, obj) {
        if (this.isOpenFormula) {
          this.minuteFrameID = data.FrameID

          const elementObj = $(`#minuteChartID [identify="${data.FrameID}"] .index_change`)[0]
          if (elementObj) {
            elementObj.click()
          }
          return
        }
        this.isShowContextMenu = !this.isShowContextMenu
        this.rightMenuData = data
        this.chartType = 'minute'
      },
      testcallback(event, data, obj) {
        this.BSDateAry = obj.ChartPaint[0].Data.GetDate()
        if (obj.ChartPaint[0].Data.GetTime()[0] === undefined || obj.ChartPaint[0].Data.GetTime()[1] === undefined) {
          this.BSTimeAry = []
        } else {
          this.BSTimeAry = obj.ChartPaint[0].Data.GetTime()
        }

        window.sessionStorage.setItem('KLine_WindowIndex', data.FrameID)

        if (this.isOpenFormula) {
          // const CSSVALUE = $('#minuteChartID .jchart-changeindex-box').css('display')
          // if (CSSVALUE === 'block') return
          const elementObj = $(`#kLine [identify="${data.FrameID}"] .index_change`)[0]
          if (elementObj) {
            elementObj.click()
            $(`#kLine .target-right ul`).html('')
          }
          return
        }
        this.isShowContextMenu = !this.isShowContextMenu
        this.rightMenuData = data
        this.chartType = 'history'
      },
      changeIndexForLocal(period) {
        // sqlite本地持久化指标数据使用处理
        let windowIndexData = null
        queryUserCustomIndex(period, JSON.parse(localStorage.getItem('SYS_Token')).id).then(res => {
          if (JSON.stringify(res) == '[]') {
            this.ChangeCurrentWindowIndex(this.arrayIndex, 0)
            return
          }

          if (res.length > 0) {
            this.arrayIndex = []
            windowIndexData = JSON.parse(res[0].WindowIndex)
            for (let i = 0; i < windowIndexData.length; i++) {
              const item = windowIndexData[i]
              const scriptIndex = {Name: item.Name, Script: item.Script, Args: item.Arguments, 'Modify': true, 'Change': true}

              this.arrayIndex.push(scriptIndex)
            }
            // 切换指标
            this.ChangeCurrentWindowIndex(this.arrayIndex, 1)
          } else {
            this.ChangeCurrentWindowIndex(this.arrayIndex, 0)
          }

        })

      },
      ChangeCurrentWindowIndex(arrayIndex, diff) {
        if (this.JSEnvironment.HistoryChart != null) {
          for (let i = 0; i < arrayIndex.length; i++) {
            if (diff === 1) { // 本地保存 用户自定义指标参数
              this.JSEnvironment.HistoryChart.ChangeScriptIndex(i, arrayIndex[i])
            } else { //
              this.JSEnvironment.HistoryChart.ChangeIndex(i, arrayIndex[i].Index)
            }
          }
        }
      },

      /** 火币 ws 对接开始**/
      NetworkFilter(data, callback) {
        switch (data.Name) {
          case 'MinuteChartContainer::RequestMinuteData':         // 当天分时图分钟全量数据下载
            this.RequestMinuteData(data, callback)
            break
          case 'KLineChartContainer::ReqeustHistoryMinuteData':   // 分钟全量数据下载
            this.RequestHistoryMinuteData(data, callback)
            break
          case 'KLineChartContainer::RequestFlowCapitalData':     // 数字货币不会调用
            this.RequestFlowCapitalData(data, callback)
            break
          case 'KLineChartContainer::RequestHistoryData':         // 日线全量数据下载
            this.RequestHistoryData(data, callback)
            break
          case 'KLineChartContainer::RequestDragMinuteData':      // 拖拽分钟数据下载
            this.RequestDragMinuteData(data, callback)
            break
          case 'KLineChartContainer::RequestDragDayData':         // 拖拽日线数据下载
            this.RequestDragDayData(data, callback)
            break
          case 'APIScriptIndex::ExecuteScript':
            this.RequestExecuteScriptData(data, callback)         // 指标计算
        }
      },

      // 订阅股票概览数据
      SubOverviewV2(data) {
        var strParam = {
          sub: `detail`,
          symbol: this.OriginalSymbol,
          subUrl: `market.${this.OriginalSymbol}.detail`
        }

        // 订阅最新数据
        var obj = {
          SendData: strParam,
          Symbol: this.Symbol,
          OriginalSymbol: this.OriginalSymbol,
          Period: -1
        }

        this.RequestWSData(obj, (recvData, data) => { this.RecvOverviewV2RealtimeData(recvData, data) })
      },

      RecvOverviewV2RealtimeData(recvData, data) {
        if (recvData.action === 'detail') {
          this.noteData = recvData.tick
        }
      },

      // 订阅盘口实时数据
      SubscribeTradesRealtimeData(data) {
        var strParam = {
          sub: `depth`,
          symbol: this.OriginalSymbol,
          step: 'step0',
          subUrl: `market.${this.OriginalSymbol}.depth`
        }

        // 订阅最新数据
        var obj = {
          SendData: strParam,
          Symbol: this.Symbol,
          OriginalSymbol: this.OriginalSymbol,
          Period: -1
        }

        this.RequestWSData(obj, (recvData, data) => { this.RecvTradesRealtimeData(recvData, data) })
      },

      RecvTradesRealtimeData(recvData, data) {
        // if (recvData.ch != data.SendData.sub) return

        if (recvData.action === 'depth') {
          this.TradesData = recvData.tick
          this.buyList = this.TradesData.bids.slice(0, 10)  // 买 buy bids

          this.sellList = this.TradesData.asks.slice(0, 10) // 卖 sell asks
          // this.sellList.reverse()
        }
      },

      // 请求历史成交数据
      RequestHistoryDealData() {
        var strParam = {'req': `market.${this.OriginalSymbol}.trade.detail`, 'symbol': this.OriginalSymbol}
        var obj = {
          SendData: strParam,
          Symbol: this.Symbol,
          OriginalSymbol: this.OriginalSymbol,
          Period: -2
        }

        // this.RequestWSData(obj, (recvData, data) => { this.RecvHistoryDealData(recvData, data) })
      },

      // 接收历史成交数据
      RecvHistoryDealData(recvData, data) {
        if (recvData.data && recvData.data.length > 0) {
          this.HistoryDealData = []
          this.HistoryDealData = this.HistoryDealData.concat(recvData.data)
        }

        // if (this.HistoryDealData.length > 0) this.SubscribeDealRealtimeData(data)
      },

      // 订阅逐笔成交实时数据
      SubscribeDealRealtimeData(data) {
        // 订阅最新数据
        var strParam = {
          sub: `trade`,
          symbol: this.OriginalSymbol,
          subUrl: `market.${this.OriginalSymbol}.trade.detail`
        }
        var obj = {
          SendData: strParam,
          Symbol: this.Symbol,
          OriginalSymbol: this.OriginalSymbol,
          Period: -2
        }

        this.RequestWSData(obj, (recvData, data) => { this.RecvAllZSTRealtimeData(recvData, data) })
      },

      // 接收多个频道(Channel)订阅数据 (默认分时图时)
      RecvAllZSTRealtimeData(recvData, data) {
        var chStr = recvData.ch
        switch (chStr) {
          case `market.${this.OriginalSymbol}.kline.1min`:
            if (recvData.ch.indexOf('kline') > 0) {
              data.SendData.sub = this.SendSubString
              this.RecvZSTMinuteRealtimeData(recvData, data)
            }
            break
          case `market.${this.OriginalSymbol}.depth`:
            this.RecvTradesRealtimeData(recvData, data)
            break
          case `market.${this.OriginalSymbol}.trade.detail`:
            this.RecvDealRealtimeData(recvData, data)
            break
          case `market.${this.OriginalSymbol}.detail`:
            this.RecvOverviewV2RealtimeData(recvData, data)
            break
        }
      },

      // 接收逐笔成交实时数据
      RecvDealRealtimeData(recvData, data) {
        if (recvData.action === 'trade') {
          this.DealData = []
          if (recvData.tick && recvData.tick.amount) {
            var objTick = recvData.tick
            this.HistoryDealData.unshift(objTick)
          } else if (recvData.tick && recvData.tick.data) {
            var aryData = recvData.tick.data
            for (let i = 0; i < aryData.length; i++) {
              this.HistoryDealData.unshift(aryData[i])
            }
          }
          this.DealData = this.HistoryDealData
          eventBus.$emit('fetchDealData', this.DealData.slice(0, 24))
        }
      },

      sortUpDate(a, b) {
        return Date.parse(b.received) - Date.parse(a.received)
      },

      RequestFlowCapitalData(data, callback) // 请求流通股本
      {
        data.PreventDefault = true
        var hqChartData = {code: 0, stock: []} // 如果没有数据就填空
        callback(hqChartData)
      },

      SendWSHeartMessage() {
        if (this.Socket) {
          var pong = {'pong': new Date().getTime()}
          this.Socket.send(JSON.stringify(pong))
        }
      },

      // 取消订阅上一次的信息
      SendUnSubscribeMessage() {
        if (!this.LastSubString || !this.Socket) return

        var message = JSON.stringify({unsub: this.LastSubString}) // 取消上次订阅的信息
        this.Socket.send(message)
        this.LastSubString = null // 清空最后一个订阅信息
      },

      RequestWSData(data, recvCallback) {
        const DishPost = `depth`
        const DetailPost = `trade`
        const OverviewPost = `detail`

        if (!this.Socket) {
          // this.Socket = new WebSocket(this.WSUrl) //创建连接
          this.Socket = new ReconnectingWebSocket(this.WSUrl)
          this.Socket.onopen = (event) => {
            var message = JSON.stringify(data.SendData)
            this.Socket.send(message)
            if (data.SendData.sub == DishPost) {

            } else if (data.SendData.sub == DetailPost) {

            } else if (data.SendData.sub == OverviewPost) {

            } else {
              if (this.isFirstIn) {
                if (data.SendData.sub) { this.LastSubString = data.SendData.sub } // 保存最后一个订阅信息
              }
            }
            // if (data.SendData.sub) this.LastSubString = data.SendData.sub
          }
        } else {
          this.SendUnSubscribeMessage()
          var message = JSON.stringify(data.SendData)
          this.Socket.send(message)

          if (data.SendData.sub == DishPost) {

          } else if (data.SendData.sub == DetailPost) {

          } else if (data.SendData.sub == OverviewPost) {

          } else {
            if (this.isFirstIn) {
              if (data.SendData.sub) { this.LastSubString = data.SendData.sub } // 保存最后一个订阅信息
            }
            this.isFirstIn = true
          }
          // if (data.SendData.sub) this.LastSubString = data.SendData.sub    //保存最后一个订阅信息
        }

        this.Socket.onmessage = (event) => {
          var reader = new FileReader()
          reader.addEventListener('loadend', (e) => {
            const ploydata = new Uint8Array(e.target.result)
            const msg = pako.inflate(ploydata, {to: 'string'})
            var recvData = JSON.parse(msg)
            if (recvData.ping) {
              this.SendWSHeartMessage() // 回复服务器心跳包
            } else if (recvData.unsubbed) // 取消订阅成功
            {

            } else if (recvData.subbed) // 订阅成功
            {

            } else {
              recvCallback(recvData, data)
            }
          })

          reader.readAsArrayBuffer(event.data, 'utf-8')
        }

        this.Socket.onerror = (event) => {
          console.log('index组件 Socket error: ', event, this.$route.path)
          if (this.$route.path === '/hqdetail') {
            if (this.Socket) {
              this.Socket.close()
              this.Socket = null
            }
            this.createWSConnect()
            this.SocketReconnect()
            console.log('index组件已重连成功222.......')
          }
        }

        this.Socket.onclose = (e) => {
          console.log('index组件 Socket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean, this.$route.path)
          if (this.$route.path === '/hqdetail') {
            if (this.Socket) {
              this.Socket.close()
              this.Socket = null
            }
            this.createWSConnect()
            this.SocketReconnect()
            console.log('index组件已重连成功111.......')
          }
        }
      },

      SocketReconnect() {
        if (this.lockReconnect) return
        this.lockReconnect = true
        //没连接上会一直重连，设置延迟避免请求过多
        if (this.reconectNum < 6) {
          setTimeout(() => {
            this.timeoutFlag = true

            // 断连，重新订阅最新数据
            const postData = this.GeneratePostData(this.OriginalSymbol, this.currentPeriod)
            const obj = {SendData: postData.Sub, Symbol: this.Symbol, OriginalSymbol: this.OriginalSymbol, Period: this.currentPeriod}
            console.log('SocketReconnect 重连发送obj::::  ', obj)
            this.RequestWSData(obj, (recvData, data) => { this.RecvAllMinuteRealtimeData(recvData, data) })

            console.info(`正在重连第: ${this.reconectNum + 1} 次`)
            this.reconectNum++
            this.lockReconnect = false

          }, 5000) //这里设置重连间隔(ms)
        }
      },

      // 生成请求数据
      GeneratePostData(symbol, period) {
        // 1min, 5min, 15min, 30min, 60min,4hour,1day,1week, 1mon
        var MAP_PERIOD = new Map([
          [0, '1day'],
          [1, '1week'],
          [2, '1mon'],
          [4, '1min'],
          [5, '5min'],
          [6, '15min'],
          [7, '30min'],
          [8, '60min'],
          [12, '4hour']
        ])

        var strPeriod = MAP_PERIOD.get(period)

        var reqData =
          {
            req: `kline`,
            symbol: symbol,
            period: strPeriod,
            reqUrl: `market.${symbol}.kline.${strPeriod}`
          }

        var subData =
          {
            sub: `kline`,
            symbol: symbol,
            period: strPeriod,
            subUrl: `market.${symbol}.kline.${strPeriod}`
          }

        return {Req: reqData, Sub: subData}
      },

      // 请求分钟历史数据
      RequestHistoryMinuteData(data, callback) {
        data.PreventDefault = true
        var symbol = data.Request.Data.symbol
        var period = data.Self.Period // 周期

        var postData = this.GeneratePostData(this.OriginalSymbol, period)

        var obj = {
          SendData: postData.Req,
          Symbol: symbol,
          OriginalSymbol: this.OriginalSymbol,
          Period: period,
          Callback: callback
        }

        this.RequestWSData(obj, (recvData, data) => { this.RecvHistoryMinuteData(recvData, data) })
      },

      // 接收历史分钟数据
      RecvHistoryMinuteData(recvData, data) {
        if (recvData.rep != data.SendData.reqUrl) return

        var hqChartData = {code: 0, data: []}
        hqChartData.symbol = data.Symbol
        hqChartData.name = data.OriginalSymbol

        if (recvData.data) {
          var yClose = null // 前收盘
          for (var i in recvData.data) {
            var item = recvData.data[i]

            // 时间戳转换
            var dateTime = new Date()
            dateTime.setTime(item.id * 1000)
            var date = dateTime.getFullYear() * 10000 + (dateTime.getMonth() + 1) * 100 + dateTime.getDate()
            var time = dateTime.getHours() * 100 + dateTime.getMinutes()

            // var newItem = [date, yClose, item.open, item.high, item.low, item.close, item.vol, item.amount, time]
            var newItem = [date, yClose, item.open, item.high, item.low, item.close, item.amount, item.vol, time] // 火币 amount 成交量，vol 成交金额

            yClose = item.close
            hqChartData.data.push(newItem)
          }
        }

        data.Callback(hqChartData)

        this.SubscribeMinuteRealtimeData(data)
      },

      // 订阅最新分钟K线数据
      SubscribeMinuteRealtimeData(data) {
        // 订阅最新数据
        var postData = this.GeneratePostData(data.OriginalSymbol, data.Period)
        var obj = {
          SendData: postData.Sub,
          Symbol: data.Symbol,
          OriginalSymbol: data.OriginalSymbol,
          Period: data.Period
        }
        this.RequestWSData(obj, (recvData, data) => { this.RecvAllMinuteRealtimeData(recvData, data) })
      },

      RecvMinuteRealtimeData(recvData, data) {
        if (recvData.ch != data.SendData.subUrl) return

        var internalChart = this.JSEnvironment.HistoryChart.JSChartContainer
        var period = internalChart.Period
        var symbol = internalChart.Symbol
        if (symbol != data.Symbol || period != data.Period) return

        var hqChartData = {code: 0, data: [], ver: 2.0} // 更新数据使用2.0版本格式
        hqChartData.symbol = data.Symbol
        hqChartData.name = data.OriginalSymbol

        // TODO:把recvData => hqchart内部格式 格式看教程
        // HQChart使用教程30-K线图如何对接第3方数据15-轮询增量更新1分钟K线数据

        var item = recvData.tick

        var dateTime = new Date()
        dateTime.setTime(item.id * 1000)
        var date = dateTime.getFullYear() * 10000 + (dateTime.getMonth() + 1) * 100 + dateTime.getDate()
        var time = dateTime.getHours() * 100 + dateTime.getMinutes()

        var newItem = [date, null, item.open, item.high, item.low, item.close, item.amount, item.vol, time]

        hqChartData.data.push(newItem)

        internalChart.RecvMinuteRealtimeData(hqChartData)
      },

      // 接收全部分钟周期实时数据
      RecvAllMinuteRealtimeData(recvData, data) {
        var chStr = recvData.ch
        switch (chStr) {
          case data.SendData.subUrl:
            this.RecvMinuteRealtimeData(recvData, data)
            break
          case `market.${this.OriginalSymbol}.depth`:
            this.RecvTradesRealtimeData(recvData, data)
            break
          case `market.${this.OriginalSymbol}.trade.detail`:
            this.RecvDealRealtimeData(recvData, data)
            break
          case `market.${this.OriginalSymbol}.detail`:
            this.RecvOverviewV2RealtimeData(recvData, data)
            break
        }
      },

      // 生成周期时间
      GenerateRange(minuteCount, period) {
        // 1min, 5min, 15min, 30min, 60min,4hour,1day,1week, 1mon
        // 4, 5, 6, 7, 8, 12, 0, 1, 2
        var MAP_RANGE = new Map([
          [0, {from: minuteCount * 86400, to: 86400}],
          [1, {from: minuteCount * 86400 * 7, to: 86400 * 7}],
          [2, {from: minuteCount * 86400 * 30, to: 86400 * 30}],
          [4, {from: minuteCount * 60, to: 60}],
          [5, {from: minuteCount * 300, to: 300}],
          [6, {from: minuteCount * 900, to: 900}],
          [7, {from: minuteCount * 1800, to: 1800}],
          [8, {from: minuteCount * 3600, to: 3600}],
          [12, {from: minuteCount * 14400, to: 14400}]
        ])

        var objRange = MAP_RANGE.get(period)

        return objRange
      },

      // 请求拖拽分钟历史数据
      RequestDragMinuteData(data, callback) {
        data.PreventDefault = true
        var symbol = data.Request.Data.symbol
        var period = data.Self.Period // 周期
        var startDate = data.Request.Data.first

        var year = parseInt(startDate.date / 10000)
        var month = parseInt(startDate.date % 10000 / 100)
        var day = startDate.date % 100
        var time = startDate.time
        var hour = parseInt(time / 100)
        var minute = time % 100
        var dateTime = new Date(year, month - 1, day)
        dateTime.setHours(hour, minute, 0)
        var postData = this.GeneratePostData(this.OriginalSymbol, period)
        var timestamp = (parseInt(dateTime.getTime() / 1000))
        // postData.Req.to = timestamp - X
        postData.Req.to = timestamp - this.GenerateRange(299, period).to

        var minuteCount = 299
        // var startTimestamp = postData.Req.to - (X * minuteCount)
        var startTimestamp = postData.Req.to - this.GenerateRange(minuteCount, period).from

        // var startDateTime = new Date(startTimestamp)

        postData.Req.from = startTimestamp // parseInt(startDateTime.getTime() / 1000)

        var obj =
          {
            SendData: postData.Req, Symbol: symbol, OriginalSymbol: this.OriginalSymbol, Period: period,
            StartDate: {Date: startDate.date, Time: startDate.time},
            Callback: callback
          }

        this.RequestWSData(obj, (recvData, data) => { this.RecvDragMinuteData(recvData, data) })
      },

      // 接收拖拽历史分钟数据
      RecvDragMinuteData(recvData, data) {
        if (recvData.rep != data.SendData.reqUrl) return

        var hqChartData = {code: 0, data: []}
        if (recvData.data) {
          var yClose = null // 前收盘
          for (var i in recvData.data) {
            var item = recvData.data[i]

            // 时间戳转换
            var dateTime = new Date()
            dateTime.setTime(item.id * 1000)
            var date = dateTime.getFullYear() * 10000 + (dateTime.getMonth() + 1) * 100 + dateTime.getDate()
            var time = dateTime.getHours() * 100 + dateTime.getMinutes()

            var newItem = [date, yClose, item.open, item.high, item.low, item.close, item.amount, item.vol, time]

            yClose = item.close
            hqChartData.data.push(newItem)
          }
        }

        if (hqChartData.data.length > 0) {
          var firstDate = hqChartData.data[0]
          if (firstDate[0] == data.StartDate.Date && firstDate[8] == data.StartDate.Time) {
            hqChartData.data = []
          }
        }

        data.Callback(hqChartData)

        this.SubscribeMinuteRealtimeData(data)
      },

      // 拖拽时间戳格式化
      _tsFormat(ts) {
        var dateTime = new Date(ts * 1000)
        var y = dateTime.getFullYear()
        var m = dateTime.getMonth() + 1
        var d = dateTime.getDate()

        var hour = dateTime.getHours() >= 10 ? dateTime.getHours() : '0' + dateTime.getHours()
        var minut = dateTime.getMinutes() >= 10 ? dateTime.getMinutes() : '0' + dateTime.getMinutes()
        var second = dateTime.getSeconds() >= 10 ? dateTime.getSeconds() : '0' + dateTime.getSeconds()
        return y + '-' + m + '-' + d + ' ' + hour + ':' + minut + ':' + second
      },

      // 日线拖拽历史数据
      RequestDragDayData(data, callback) {
        data.PreventDefault = true
        var symbol = data.Request.Data.symbol
        var period = data.Self.Period // 周期
        var startDate = data.Request.Data.first

        var year = parseInt(startDate.date / 10000)
        var month = parseInt(startDate.date % 10000 / 100)
        var day = startDate.date % 100
        var dateTime = new Date(year, month - 1, day)
        var postData = this.GeneratePostData(this.OriginalSymbol, period)
        var timestamp = dateTime.getTime()
        postData.Req.to = parseInt((timestamp / 1000) - this.GenerateRange(299, period).to)

        // var minuteCount = 24 * 60 * 200  //取200天数据
        var minuteCount = 299 // 取200天数据

        // var startTimestamp = timestamp - (60 * 1000 * minuteCount)
        var startTimestamp = postData.Req.to - this.GenerateRange(minuteCount, period).from

        // var startDateTime = new Date(startTimestamp)

        postData.Req.from = startTimestamp // parseInt(startDateTime.getTime() / 1000)

        var obj =
          {
            SendData: postData.Req, Symbol: symbol, OriginalSymbol: this.OriginalSymbol, Period: period,
            StartDate: {Date: startDate.date},
            Callback: callback
          }

        this.RequestWSData(obj, (recvData, data) => { this.RecvDragDayData(recvData, data) })
      },

      // 接收日线拖拽历史数据
      RecvDragDayData(recvData, data) {
        if (recvData.rep != data.SendData.reqUrl) return

        var hqChartData = {code: 0, data: []}
        if (recvData.data) {
          var yClose = null // 前收盘
          for (var i in recvData.data) {
            var item = recvData.data[i]

            // 时间戳转换
            var dateTime = new Date()
            dateTime.setTime(item.id * 1000)
            var date = dateTime.getFullYear() * 10000 + (dateTime.getMonth() + 1) * 100 + dateTime.getDate()

            var newItem = [date, yClose, item.open, item.high, item.low, item.close, item.amount, item.vol]

            yClose = item.close
            hqChartData.data.push(newItem)
          }
        }

        if (hqChartData.data.length > 0) {
          var firstDate = hqChartData.data[0]
          if (firstDate[0] == data.StartDate.Date) {
            hqChartData.data = []
          }
        }

        data.Callback(hqChartData)

        this.SubscribRealtimeData(data)
      },

      // 日K数据下载
      RequestHistoryData(data, callback) {
        data.PreventDefault = true
        var symbol = data.Request.Data.symbol
        var period = data.Self.Period // 周期
        var postData = this.GeneratePostData(this.OriginalSymbol, period)

        var obj = {
          SendData: postData.Req,
          Symbol: symbol,
          OriginalSymbol: this.OriginalSymbol,
          Period: period,
          Callback: callback
        }

        this.RequestWSData(obj, (recvData, data) => { this.RecvHistoryData(recvData, data) })
      },

      RecvHistoryData(recvData, data) // 接收到日线数据 转化成hqchart格式数据
      {
        if (recvData.rep != data.SendData.reqUrl) return

        var hqChartData = {code: 0, data: []}
        hqChartData.symbol = data.Symbol
        hqChartData.name = data.OriginalSymbol

        if (recvData.data) {
          var yClose = null // 前收盘
          for (var i in recvData.data) {
            var item = recvData.data[i]

            // 时间戳转换
            var dateTime = new Date()
            dateTime.setTime(item.id * 1000)
            var date = dateTime.getFullYear() * 10000 + (dateTime.getMonth() + 1) * 100 + dateTime.getDate()
            var time = dateTime.getHours() * 100 + dateTime.getMinutes()

            var newItem = [date, yClose, item.open, item.high, item.low, item.close, item.amount, item.vol]

            yClose = item.close
            hqChartData.data.push(newItem)
          }
        }

        data.Callback(hqChartData)

        this.SubscribRealtimeData(data)
      },

      // 订阅最新日K线数据
      SubscribRealtimeData(data) {
        // 订阅最新数据
        var postData = this.GeneratePostData(data.OriginalSymbol, data.Period)

        var obj = {
          SendData: postData.Sub,
          Symbol: data.Symbol,
          OriginalSymbol: data.OriginalSymbol,
          Period: data.Period
        }

        this.RequestWSData(obj, (recvData, data) => { this.RecvAllDayRealtimeData(recvData, data) /*this.RecvRealtimeData(recvData, data)*/ })
      },

      RecvRealtimeData(recvData, data) {
        if (recvData.ch != data.SendData.subUrl) return

        var internalChart = this.JSEnvironment.HistoryChart.JSChartContainer
        var period = internalChart.Period
        var symbol = internalChart.Symbol
        if (symbol != data.Symbol || period != data.Period) return

        var hqChartData = {code: 0, stock: []}
        // TODO:把recvData => hqchart内部格式 格式看教程
        // HQChart使用教程30-K线图如何对接第3方数据14-轮询增量更新日K数据

        var stock = {symbol: data.Symbol, name: data.OriginalSymbol}
        var item = recvData.tick
        var dateTime = new Date()
        dateTime.setTime(item.id * 1000)
        var date = dateTime.getFullYear() * 10000 + (dateTime.getMonth() + 1) * 100 + dateTime.getDate()
        var time = dateTime.getHours() * 100 + dateTime.getMinutes()

        stock.date = date
        stock.yclose = null
        stock.open = item.open
        stock.high = item.high
        stock.low = item.low
        stock.price = item.close
        // stock.vol = item.vol
        // stock.amount = item.amount
        stock.vol = item.amount
        stock.amount = item.vol

        hqChartData.stock.push(stock)

        internalChart.RecvRealtimeData(hqChartData)
      },

      // 接收日线、周线、月线实时数据
      RecvAllDayRealtimeData(recvData, data) {
        var chStr = recvData.ch
        switch (chStr) {
          case data.SendData.subUrl:
            this.RecvRealtimeData(recvData, data)
            break
          case `market.${this.OriginalSymbol}.depth`:
            this.RecvTradesRealtimeData(recvData, data)
            break
          case `market.${this.OriginalSymbol}.trade.detail`:
            this.RecvDealRealtimeData(recvData, data)
            break
          case `market.${this.OriginalSymbol}.detail`:
            this.RecvOverviewV2RealtimeData(recvData, data)
            break
        }
      },

      // 请求 走势图 分钟历史数据
      RequestMinuteData(data, callback) {
        data.PreventDefault = true
        var symbol = data.Request.Data.symbol[0]
        var period = 4 // 1分钟周期的数据
        var postData = this.GeneratePostData(this.OriginalSymbol, period)

        var obj = {
          SendData: postData.Req,
          Symbol: symbol,
          OriginalSymbol: this.OriginalSymbol,
          Period: period,
          Callback: callback
        }

        this.RequestWSData(obj, (recvData, data) => { this.RecvMinuteData(recvData, data) })
      },

      // 接收走势图历史分钟数据
      RecvMinuteData(recvData, data) {
        if (recvData.rep != data.SendData.reqUrl) return

        // 数据格式详见教程
        // HQChart使用教程29-走势图如何对接第3方数据2-最新分时数据
        // https://blog.csdn.net/jones2000/article/details/100149703
        var stock = {symbol: data.Symbol, name: data.OriginalSymbol, minute: []}
        var hqChartData = {code: 0, stock: [stock]}

        if (recvData.data) {
          var yClose = null // 前收盘
          var bFindFirst = false

          var yClose = null, open = null
          for (var i in recvData.data) {
            var item = recvData.data[i]
            if (open == null) open = item.open
            if (yClose == null) yClose = item.close

            // 时间戳转换
            var dateTime = new Date()
            dateTime.setTime(item.id * 1000)
            var date = dateTime.getFullYear() * 10000 + (dateTime.getMonth() + 1) * 100 + dateTime.getDate()
            var time = dateTime.getHours() * 100 + dateTime.getMinutes()
            if (date == this.DateTimeRange.Start.Date && time == this.DateTimeRange.Start.Time) {
              bFindFirst = true
              open = item.open
            } else {
              yClose = item.close // 上一天的收盘价
            }

            if (!bFindFirst) continue

            var minuteItem =
              {
                date: date, time: time,
                open: item.open, high: item.high, low: item.low, price: item.close,
                vol: item.amount, amount: item.vol
              }

            stock.date = date
            stock.time = time

            stock.minute.push(minuteItem)
          }

          stock.yclose = yClose
          stock.open = open
        }
        this.StockData = stock

        data.Callback(hqChartData)

        this.SubscribeZSTMinuteRealtimeData(data)
      },

      // 订阅最新走势图分钟K线数据
      SubscribeZSTMinuteRealtimeData(data) {
        // 订阅最新数据
        var postData = this.GeneratePostData(data.OriginalSymbol, data.Period)
        var obj = {
          SendData: postData.Sub,
          Symbol: data.Symbol,
          OriginalSymbol: data.OriginalSymbol,
          Period: data.Period
        }

        this.RequestWSData(obj, (recvData, data) => { this.RecvAllZSTRealtimeData(recvData, data)/* this.RecvZSTMinuteRealtimeData(recvData, data)*/ })
      },

      RecvZSTMinuteRealtimeData(recvData, data) {
        if (recvData.action !== 'kline') return
        if (!this.StockData) return

        var internalChart = this.JSEnvironment.MinuteChart.JSChartContainer
        var period = internalChart.Period
        var symbol = internalChart.Symbol

        if (symbol != data.Symbol) return

        var hqChartData = {code: 0, data: [], ver: 2.0} // 更新数据使用2.0版本格式
        hqChartData.symbol = data.Symbol
        hqChartData.name = data.OriginalSymbol

        // TODO:把recvData => hqchart内部格式 格式看教程
        // HQChart使用教程30-K线图如何对接第3方数据15-轮询增量更新1分钟K线数据

        var item = recvData.tick

        var dateTime = new Date()
        dateTime.setTime(item.id * 1000)
        var date = dateTime.getFullYear() * 10000 + (dateTime.getMonth() + 1) * 100 + dateTime.getDate()
        var time = dateTime.getHours() * 100 + dateTime.getMinutes()

        var minuteItem =
          {
            date: date, time: time,
            open: item.open, high: item.high, low: item.low, price: item.close,
            vol: item.amount, amount: item.vol
          }

        if (this.StockData.minute.length > 0) {
          var lastItem = this.StockData.minute[this.StockData.minute.length - 1]
          if (lastItem.date == minuteItem.date && lastItem.time == minuteItem.time) {
            this.StockData.minute[this.StockData.minute.length - 1] = minuteItem
          } else {
            this.StockData.minute.push(minuteItem)
          }
        }
        var hqChartData = {code: 0, stock: [this.StockData]}

        internalChart.RecvMinuteData(hqChartData)
      },

      // ////////////////////////////////////////////////////////////
      // 坐标 刻度设置

      CreateDateTimeRange() {
        var date = new Date()
        var t = date.getTime()
        date.setTime(t - 1000 * 60 * 60 * 2)
        var startTime = date.getHours() * 100
        var startDate = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()

        date.setTime(t + 1000 * 60 * 60 * (24 - 3))
        var endTime = date.getHours() * 100 + 59
        var endDate = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()

        var xDate = new Date()
        var overTime = (xDate.getHours() + 4) + '00'

        const TIME_SPLIT =
          [
            {Start: (startTime - 200), End: overTime}
            // { Start: 0, End: endTime }
          ]
        var indexData = jsChart.JSChart.GetMinuteTimeStringData().CreateTimeData(TIME_SPLIT)
        this.DateTimeRange = {
          Start: {Time: startTime, Date: startDate},
          End: {Time: endTime, Date: endDate},
          Count: indexData.length
        }

        var xCoordinateData =
          {
            Count: this.DateTimeRange.Count,
            MiddleCount: parseInt(this.DateTimeRange.Count / 2),
            Full: [],
            Simple: [],
            Min: [],
            GetData: function (width) {
              if (width < 200) {
                return this.Min
              } else if (width < 450) return this.Simple

              return this.Full
            }
          }

        for (var i = 0; i < indexData.length; ++i) {
          if (i % (60 * 2) == 0)    //2小时一个刻度
          {
            var value = indexData[i]
            xCoordinateData.Full.push([parseInt(i), 1, 'RGB(200,200,200)', jsChart.IFrameSplitOperator.FormatTimeString(value)])
          }

          if (i % (60 * 4) == 0)    //4小时一个刻度
          {
            var value = indexData[i]
            xCoordinateData.Simple.push([parseInt(i), 1, 'RGB(200,200,200)', jsChart.IFrameSplitOperator.FormatTimeString(value)])
          }

          if (i % (60 * 6) == 0)    //6小时一个刻度
          {
            var value = indexData[i]
            xCoordinateData.Min.push([parseInt(i), 1, 'RGB(200,200,200)', jsChart.IFrameSplitOperator.FormatTimeString(value)])
          }
        }

        this.XCoordinateData = xCoordinateData
      },
      CreateBITDataIndex() {
        const TIME_SPLIT =
          [
            {Start: this.DateTimeRange.Start.Time, End: 2359},
            {Start: 0, End: this.DateTimeRange.End.Time}
          ]

        return jsChart.JSChart.GetMinuteTimeStringData().CreateTimeData(TIME_SPLIT)
      },
      //数字货币价格对应的小数位数
      GetBITDecimal(symbol) {
        if (!this.$route.query.stock) { return }
        //不同的品种显示不同的小数位数
        const STOCK = JSON.parse(this.$route.query.stock)
        let yDecimal = STOCK.price_precision
        if (!STOCK) { return }

        switch (symbol) {
          case 'IOTAUSDT.BIT_Backup':
            return 3
          case 'HITUSDT.BIT_Backup':
            return 8
          case 'PVTUSDT.BIT_Backup':
            return 7
          default:
            return yDecimal
        }
      },
      /** 火币 ws 对接结束**/


      /*** BS指标数据 处理开始 ***/
      RequestExecuteScriptData(data, callback) {

        if (data.Name == 'APIScriptIndex::ExecuteScript') {
          var request = data.Request
          if (request.Data.indexname == 'SVG图标标记') {
            data.PreventDefault = true

            var hqchart = data.HQChart
            var kData = hqchart.ChartPaint[0].Data

            var dateList = kData.GetDate()
            var timeList = kData.GetTime()
            var datetimeList = []

            if (this.addBSDate.date) {
              var curDateIndex = dateList.indexOf(this.addBSDate.date)
              var curTimeIndex = timeList.indexOf(this.addBSDate.time)

              var curDateTime = dateList[curDateIndex] + '' + timeList[curTimeIndex]

              for (let i = 0; i < dateList.length; i++) {
                datetimeList.push(dateList[i] + '' + timeList[i])
              }

              let datetimeIndex = datetimeList.indexOf(curDateTime)

              var currentBSValue = kData.GetLow()[datetimeIndex]

              if (this.BSIconAry[this.addBSDate.index]) {
                this.BSIconAry[this.addBSDate.index].Value = Number(currentBSValue) - 2
              }
              // console.log('kData.GetLow===::: ', datetimeIndex, currentBSValue, this.addBSDate, this.BSIconAry)
            }

            var closeLine = {name: '收盘价线', type: 0, data: kData.GetClose()}
            var line2 =
              {
                name: 'MULTI_SVGICON', type: 1,
                Draw:
                  {
                    DrawType: 'MULTI_SVGICON',
                    DrawData:
                      {
                        Family: 'js-iconfont',
                        Icon: this.BSIconAry,

                        // Icon: [
                        //   {Date: 20200928, Time: 1030, Value: 15.5, Symbol: 'B', Color: 'rgb(240,0,0)', Baseline: 1},  //0 居中 1 上 2 下
                        //   // {Date: 20200928, Time: 1115, Value: 1115.4, Symbol: '\ue649', Color: 'rgb(240,100,30)', Baseline: 1},
                        // ]

                      }
                  } //绘制图标数组
              }

            var apiData = {
              code: 0,
              stock: {name: hqchart.Name, symbol: hqchart.Symbol},
              outdata: {date: dateList, outvar: [closeLine, line2]}
            }
            // console.log('apiData::: ', apiData)
            // console.log('apiDateTime===', kData.GetDate(), kData.GetTime())
            callback(apiData)

          }
        }

      },
      BSDataFormat() {        // BS指标数据格式化处理
        if (!this.BSDataSource) { return }
        if (this.CurrentStock.type) {
          this.currentBSSymbol = this.CurrentStock.contract_short_type
        } else {
          this.currentBSSymbol = this.CurrentStock.symbol
        }
        this.BSIconAry = []
        for (let i = 0; i < this.BSDataSource.length; i++) {
          if (this.currentBSSymbol === this.BSDataSource[i].symbol) { // 匹配当前 k线币种 BS买卖点
            if (Number(this.BSDataSource[i].direction) === 1) { // 1买 2卖
              let objIcon = {
                Date: xDateFormat(this.BSDataSource[i].create_at),
                Time: xTimeFormat(this.BSDataSource[i].create_at),
                Value: this.CurrentStock.low,
                Symbol: '\ue649',
                Color: 'rgb(57,240,71)',
                Baseline: 1
              }
              this.BSIconAry.push(objIcon)
            } else if (Number(this.BSDataSource[i].direction) === 2) {
              let objIcon = {
                Date: xDateFormat(this.BSDataSource[i].create_at),
                Time: xTimeFormat(this.BSDataSource[i].create_at),
                Value: this.CurrentStock.low,
                Symbol: '\ue6ae',
                Color: 'rgb(240,0,0)',
                Baseline: 1
              }
              this.BSIconAry.push(objIcon)
            }
          }
        }
      },
      /*** BS指标数据 处理结束 ***/

      hideMenuTwo(index) {
        this.MenuOneIndex = 999 // 下标不相等，隐藏二级菜单
        this.currentDirection = 'icon-xia'
      },
      baseDataFormat(data) {
        var self = this
        data.forEach(function (item, key, mapObj) {
          if (item == undefined) {
            if (key == 'riseRate' || key == 'exchange' || key == 'roe' || key == 'amplitude') {
              item = '--%'
            } else {
              item = '--'
            }
          } else {
            if (key == 'amount' || key == 'marketV' || key == 'flowMarketV' || key == 'vol') {
              item = self.numToCUnit(item)
            } else if (key == 'riseRate' || key == 'exchange' || key == 'roe' || key == 'amplitude') {
              item = Number(item).toFixed(2) + '%'
            } else {
              item = Number(item).toFixed(2)
            }
          }
          data.set(key, item)
        })
      },
      numToCUnit(num) {
        if (num < 100000000) {
          return Number(num / 10000).toFixed(2) + '万'
        } else {
          return Number(num / 100000000).toFixed(2) + '亿'
        }
      },
      CaluChartWidthHeight(data) { // 计算图形高度
        var trueWidth = $('.leftChart').width()
        if (this.devicePixel <= 1366) {
          if (data) {
            $('#minuteChartID').width(trueWidth).height(520)
            $('#kLine').width(trueWidth).height(520)
          } else {
            $('#minuteChartID').width(trueWidth).height(520)
            $('#kLine').width(trueWidth).height(520)
          }

          if (data === -1 && !this.isFullScreen) {
            $('#minuteChartID').width(this.devicePixel - 400).height(520)
            $('#kLine').width(this.devicePixel - 400).height(520)
          }

          if (data === 1 && this.isFullScreen) {
            $('#minuteChartID').width(this.devicePixel).height(520)
            $('#kLine').width(this.devicePixel).height(520)
          }

          if (this.JSEnvironment.MinuteChart != null) {
            this.JSEnvironment.MinuteChart.OnSize()
          }
          if (this.JSEnvironment.HistoryChart != null) {
            this.JSEnvironment.HistoryChart.OnSize()
          }

          return false
        }

        if (data) {
          $('#minuteChartID').width(trueWidth).height(630)
          $('#kLine').width(trueWidth).height(630)
        } else if (data === false) {
          $('#minuteChartID').width(trueWidth).height(836)
          $('#kLine').width(trueWidth).height(836)
        }
        if (data === -1 && !this.isFullScreen) {
          eventBus.$emit('updateChartV2', true)
          $('#minuteChartID').width(this.devicePixel - 400).height(630)
          $('#kLine').width(this.devicePixel - 400).height(630)
        }

        if (data === 1 && this.isFullScreen) {
          if (this.isUpdateChart === false) {
            $('#minuteChartID').width(this.devicePixel).height(836)
            $('#kLine').width(this.devicePixel).height(836)
          } else {
            $('#minuteChartID').width(this.devicePixel).height(630)
            $('#kLine').width(this.devicePixel).height(630)
          }
        }

        if (this.JSEnvironment.MinuteChart != null) {
          this.JSEnvironment.MinuteChart.OnSize()
        }
        if (this.JSEnvironment.HistoryChart != null) {
          this.JSEnvironment.HistoryChart.OnSize()
        }
      },
      baseDataColor(data, yClose) { // 与昨日收盘价相比，与0比
        this.pageDataColor = {}
        var self = this
        data.forEach(function (item, key, mayobj) {
          if (item != undefined) {
            switch (key) {
              case 'exchange':
                item = item.split('%')[0]
                var className = self.setColor(item, 0)
                self.pageDataColor.exchangeClass = className
                break
              case 'roe':
                item = item.split('%')[0]
                var className = self.setColor(item, 0)
                self.pageDataColor.roeClass = className
                break
              case 'rise':
              case 'riseRate':
                item = item.split('%')[0]
                var className = self.setColor(item, 0)
                self.pageDataColor.riseClass = className
                break
              case 'price':
                var className = self.setColor(item, yClose)
                self.pageDataColor.priceClass = className
                break
              case 'high':
                var className = self.setColor(item, yClose)
                self.pageDataColor.highClass = className
                break
              case 'low':
                var className = self.setColor(item, yClose)
                self.pageDataColor.lowClass = className
                break
              case 'open':
                var className = self.setColor(item, yClose)
                self.pageDataColor.openClass = className
                break
            }
          }
        })
      },
      setColor(item, yClose) {
        if (item > yClose) {
          return 'upColor'
        } else if (item < yClose) {
          return 'lowColor'
        } else {
          return ''
        }
      }
    }
  }
</script>

<style lang="scss">
  $border: 1px solid #e1ecf2;

  .HQChartPC {
    height: calc(100vh - 98px);
    overflow: hidden;

    #minuteChartID {
      .jchart-changeindex-box {
        .target-button-pane {
          display: none;
        }
      }
    }

    .upColor {
      color: #ee1515;
    }

    .lowColor {
      color: #199e00;
    }

    .navgation {
      display: flex;
      align-items: center;

      .right-gap {
        width: 400px;
        height: 30px;
        background: #F6F6F6;
      }
    }

    .navBarWrap {
      flex-grow: 1;
      /*height: 36px;*/
      height: 30px;
      padding-left: 6px;
      display: flex;
      background-color: #DCDCDC;
      color: #666;
    }

    .navBarWrap .item {
      display: inline-block;
      font-size: 14px;
      line-height: 1;
      padding: 6px 12px;
      margin-top: 4px;
      margin-right: 4px;
    }

    .navBarWrap .item.active {
      color: #F66C00;
      border: 1px solid #F66C00;
    }

    .kLineSetWrap {
      position: relative;
      z-index: 99;
      flex-grow: 1;
      display: flex;
      align-items: center;
      height: 30px;

      > .item {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        position: relative;

        .menuOne {
          display: inline-block;
          width: 100%;
          vertical-align: top;
          padding: 0 10px 0 10px;
          white-space: nowrap;
        }

        .menuOne:hover, .menuOne.light {
          > span {
            color: inherit;
            white-space: nowrap;
          }
        }

        .menuTwo {
          position: absolute;
          background-color: #fff;
          top: 32px;
          left: 0;
          border: 1px solid #d9d9d9;
          border-top: none;
          width: 100%;
          color: #666;

          > li {
            padding: 0 12px;
            line-height: 32px;
          }

          > li:hover, > li.active {
            color: #F66C00;
          }

          > li.twoLevelMenu {
            padding: 6px 0.5em 6px 0.5em;
            white-space: nowrap;

            > div.active {
              color: #F66C00;
            }
          }
        }
      }

      > .item:nth-child(3) {
        flex-grow: 1;
        text-align: right;
        padding: 6px 1px;

        .menuOne {
          padding: 0;
        }
      }

      > .item:nth-child(3), .item:nth-child(5), .item:nth-child(6) {
        .menuTwo {
          border: none;
        }
      }

      > .item:nth-child(7) {
        .menuOne {
          padding: 0 30px;
        }
      }

      .iconfont {
        font-size: 13px;
      }

      .zb-deal {
        padding-right: 6px;
      }
    }

    .brushTool {
      position: relative;
      top: 24px;
      left: 0;
      bottom: 0;
    }

    .chartpicture-text-setting {
      z-index: 1;

      .contentWrap .likeSelect {
        width: 88px;
      }

      .btnsContainer {
        padding-right: 27px !important;
      }

      .btnsContainer .btn {
        height: 26px;
        line-height: 26px;
        padding-top: 0;
      }
    }

    .indexList {
      width: 100%;
      height: 32px;
      display: flex;
      flex-direction: row;
      background-color: #DCDCDC;
      color: #666;
      margin-bottom: 4px;
    }

    .indexList span {
      height: 32px;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      flex-grow: 1;
    }

    .indexList span.active {
      color: #F66C00;
      outline: 1px solid #F66C00;
    }

    .minuteIndexList {
      width: 93%;
      margin-left: 4px;
    }

    .historyIndexList {
      width: 95.4%;
      margin-left: 4px;
    }

    .chartDataWrap {
      display: flex;
    }

    .leftChart {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      #minuteChartID, #kLine {
        flex-grow: 1;
      }

      .notice-switch {
        width: 100%;
        display: flex;
        justify-content: center;

        .switch-off, .switch-on {
          width: 180px;
          height: 12px;
          background: rgba(44, 44, 44, .9);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        img {
          width: 24px;
          height: 12px;
        }
      }
    }

    .rightData {
      width: 400px;
      padding-left: 8px;
      padding-right: 11px;
      display: flex;
      flex-direction: column;
      background: #F6F6F6;
      overflow: hidden;

      .item-color {
        color: #F66C00;
        text-align: right;
      }

      .sellandbuy-wrap, .detailList {
        font-size: $fontSize14;
        background: #fff;
      }

      .sellandbuy-wrap {
        margin-bottom: 3px;
        padding: 12px 0 14px 10px;

        .buyFive, .sellFive {

          > li {
            height: 24px;
            white-space: nowrap;
            overflow: hidden;
            display: flex;
            align-items: center;

            > span {
              display: inline-block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            > span:first-child {
              width: 29%;
            }

            > span:nth-child(2) {
              width: 29%;
            }

            > span:nth-child(3) {
              width: 29%;
            }

            > span:nth-child(4) {
              width: 13%;
              color: #F66C00;
              font-size: 14px;
            }

            .sell-price {
              color: #00FF11;
            }

            .buy-price {
              color: #EE0000;
            }
          }
        }

        .cny {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          > li {
            height: 24px;
            display: flex;
            align-items: center;
          }

          li:first-child {
            font-size: $fontSize;
            color: #EE0000;
          }

          li:nth-child(2) {
            margin-left: 18px;
            margin-right: 14px;
          }

          li:nth-child(3) {
            font-size: $fontSize;
            color: #0088FF;
          }
        }
      }

      .detailList {
        height: 46.4vh;
        overflow: hidden;
        padding: 4px 0 10px 10px;

        > li {
          height: 24px;
          white-space: nowrap;
          overflow: hidden;
          display: flex;
          align-items: center;

          > span {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          > span:first-child {
            width: 29%;
          }

          > span:nth-child(2) {
            width: 29%;
          }

          > span:nth-child(3) {
            width: 29%;
          }

          > span:nth-child(4) {
            width: 13%;
          }

          span.buy {
            color: #00FF11;
          }

          span.sell {
            color: #EE0000;
          }
        }
      }
    }

    @media screen and (max-width: 1367px) { /*如果文档宽度小于 1367 像素则修改*/
      .rightData {

      }
    }
  }

  @media screen and (max-width: 1367px) { /*如果文档宽度小于 1367 像素则修改*/
    .HQChartPC {
      height: calc(100vh - 98px);
    }
  }
</style>
