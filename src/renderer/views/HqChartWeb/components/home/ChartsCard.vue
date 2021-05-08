<template>
  <div class="charts-card" id="chartsRightTop">
    <div id="kLine3" ref='kLine3' style="position: relative;"></div>
    <div id="minuteChart" ref="minuteChart" style="position: relative;"></div>
  </div>
</template>

<script>
  import '../../../../vendor/jscommon/umychart.resource/css/tools.css'
  import '../../../../vendor/jscommon/umychart.resource/font/iconfont.css'
  import jsChart from '../../../../vendor/jscommon/umychart.vue/umychart.vue.js'
  import $ from 'jquery'
  import pako from 'pako'
  import eventBus from '@/utils/bus.js'

  jsChart.JSConsole.Chart.Log = () => { }
  jsChart.JSConsole.Complier.Log = () => { }

  export default {
    name: 'ChartsCard',
    data() {
      return {
        currentStock: null, // 当前股票数据
        CustomDefColorAry: {up: 'rgb(25,158,0)', down: 'rgb(238,21,21)'}, // 自定义默认颜色,绿涨红跌

        // k线属性
        topChart: null,
        topOption: null,

        bottomChart: null,
        bottomOption: null,
        DateTimeRange: null, // 交易时间段
        XCoordinateData: null, // x轴信息

        WSUrlArray: ['ws://xhusdt.newbt.cn/', 'ws://swap.newbt.cn/', 'ws://contract.newbt.cn/'],
        WSUrl: 'ws://xhusdt.newbt.cn/',
        Socket: null,
        LastSubString: null, // 最后一个订阅的数据

        Symbol: 'btcusdt.BIT',
        OriginalSymbol: 'btcusdt',
        timeOutID: null,
        timeOutIDV2: null,

        clientWidth: null
      }
    },
    watch: {
      handler() {
        this.getEventData()
      }
    },
    created() {
      if (window.sessionStorage.getItem('CurrentSelectedPanel') === '合约') {
        if (window.sessionStorage.getItem('ContractType') === 'swap') { // swap
          this.WSUrl = this.WSUrlArray[1]
        } else { // contract
          this.WSUrl = this.WSUrlArray[2]
        }
        this.OriginalSymbol = window.sessionStorage.getItem('DefaultContractSymbol')
        this.Symbol = this.OriginalSymbol + '.BIT'
      } else {
        this.OriginalSymbol = window.sessionStorage.getItem('DefaultNormalSymbol')
        this.Symbol = this.OriginalSymbol + '.BIT'
      }
      this.clientWidth = document.body.clientWidth
      this.getEventData()
    },
    mounted() {
      this.initStyle()
      this.LoadEnvironment()
      this.createTopChart()

      this.$nextTick(() => {
        this.timeOutID = setTimeout(() => {
          this.createBottomChart()
        }, 3000)
      })
    },
    methods: {
      getEventData() {
        eventBus.$on('clickSelected', (data) => {
          if (this.OriginalSymbol === data.symbol.toLowerCase()) { return }
          let type = data.type
          if (!type) { // USDT
            this.OriginalSymbol = (data.symbol).toLowerCase()
            this.Symbol = this.OriginalSymbol + '.BIT'
          } else if (type === 'swap') {
            if (this.WSUrl !== this.WSUrlArray[1]) {
              this.WSUrl = this.WSUrlArray[1]
              eventBus.$emit('visibleChartsCard', true)
              return
            }
            this.OriginalSymbol = data.contract_short_type
            this.Symbol = this.OriginalSymbol + '.BIT'
          } else if (type === 'contract') {
            if (this.WSUrl !== this.WSUrlArray[2]) {
              this.WSUrl = this.WSUrlArray[2]
              eventBus.$emit('visibleChartsCard', true)
              return
            }
            this.OriginalSymbol = data.contract_short_type
            this.Symbol = this.OriginalSymbol + '.BIT'
          }

          this.ChangeSymbol(type)

        })
      },

      initStyle() {
        jsChart.jsChartStyle({
          UpBarColor: this.CustomDefColorAry.up,
          DownBarColor: this.CustomDefColorAry.down,
          UpTextColor: this.CustomDefColorAry.up,
          DownTextColor: this.CustomDefColorAry.down
        })
      },

      LoadEnvironment() {
        // K线图配置
        this.topOption =
          {
            Type: '历史K线图',

            DragDownload:
              {
                Minute: {Enable: true}, // 开启分钟数据拖拽下载
                Day: {Enable: true} // 开启日线数据拖拽下载
              },

            Windows: // 窗口指标
              [
                {Index: 'MA', Modify: true, Change: true}
              ],
            Symbol: this.Symbol,
            IsAutoUpdate: false, // 是自动更新数据(不自动更新由外部更新)
            IsApiPeriod: true, // 使用Api计算周期
            IsShowRightMenu: false, // 右键菜单

            KLine: // K线设置
              {
                DragMode: 1, // 拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
                Right: 0, // 复权 0 不复权 1 前复权 2 后复权
                Period: 4, // 周期 0 日线 1 周线 2 月线 3 年线
                MaxReqeustDataCount: 500, // 数据个数
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
                Left: 10, // 左边间距
                Right: 60, // 右边间距
                Top: 0
              },

            Frame: // 子框架设置
              [
                {SplitCount: 6, StringFormat: 0, IsShowLeftText: true, IsShowRightText: true, Custom: [{Type: 0, Position: 'right'}]}
              ]
          }

        // 分钟走势图
        this.bottomOption =
          {
            Type: '分钟走势图', // 创建图形类型

            Symbol: this.Symbol,
            IsAutoUpdate: false, // 是自动更新数据
            DayCount: 1, // 1 最新交易日数据 >1 多日走势图
            IsShowRightMenu: true, // 是否显示右键菜单

            MinuteLine:
              {
                IsDrawAreaPrice: false, // 是否画价格面积图
                IsShowAveragePrice: false // 不显示均线
              },

            Border: // 边框
              {
                Left: 80, // 左边间距
                Right: 70, // 右边间距
                Top: 30
              },

            Frame: // 子框架设置
              [
                {SplitCount: 6, StringFormat: 0, IsShowLeftText: true, IsShowRightText: true, Custom: [{Type: 0, Position: 'right'}]},
                {SplitCount: 3, Height: 0} //第2个成交量图高度设置0 隐藏掉
              ],

            ExtendChart: // 扩展图形
              [
                {Name: 'MinuteTooltip'} // 手机端tooltip
              ]

          }
      },

      createTopChart() {
        if (!$('#kLine3')[0]) return

        // 黑色风格
        var blackStyle = jsChart.HQChartStyle.GetStyleConfig(jsChart.STYLE_TYPE_ID.BLACK_ID)
        jsChart.JSChart.SetStyle(blackStyle)

        // 更新k线图
        $('#kLine3').width(Number(575))
        if (this.clientWidth < 1920) {
          $('#kLine3').height(Number(159))
        } else {
          $('#kLine3').height(Number(259))
        }
        if (this.topChart == null) {
          this.topChart = jsChart.jsChartInit(this.$refs.kLine3) // 初始化K线图
          this.topOption.KLine.Period = 4 // 1分钟
          this.topOption.NetworkFilter = this.NetworkFilter
          this.topChart.SetOption(this.topOption)
          this.topChart.OnSize()
        }
      },

      createBottomChart() {
        if (!$('#minuteChart')[0]) return

        var blackStyle = jsChart.HQChartStyle.GetStyleConfig(jsChart.STYLE_TYPE_ID.BLACK_ID)
        jsChart.JSChart.SetStyle(blackStyle)

        this.CreateDateTimeRange()

        jsChart.JSChart.GetMinuteTimeStringData().CreateBITData = () => { return this.CreateBITDataIndex() } // 当天所有的交易时间点
        jsChart.JSChart.GetMinuteCoordinateData().GetBITData = (upperSymbol) => { return this.XCoordinateData } // X轴刻度
        jsChart.MARKET_SUFFIX_NAME.GetBITDecimal = (symbol) => { return this.GetBITDecimal(symbol) }

        // 更新分时图
        $('#minuteChart').width(Number(575))
        if (this.clientWidth < 1920) {
          $('#minuteChart').height(Number(159))
        } else {
          $('#minuteChart').height(Number(259))
        }
        if (this.bottomChart == null) {
          this.bottomChart = jsChart.jsChartInit(this.$refs.minuteChart) // 初始化K线图
          this.bottomOption.NetworkFilter = this.NetworkFilterV2
          this.bottomChart.SetOption(this.bottomOption)
          this.bottomChart.OnSize()
        }
      },

      //数字货币价格对应的小数位数
      GetBITDecimal(symbol) {
        return Number(window.sessionStorage.getItem('YAxisDecimal'))
      },

      ChangeSymbol(type) {
        let timeout = 1500
        if (type) { timeout = 4000 }
        // 切换股票
        // if (this.OriginalSymbol == symbol) return
        if (this.topChart) {
          this.topChart.ChangeSymbol(this.Symbol)
        }
        if (this.bottomChart) {
          this.timeOutIDV2 = setTimeout(() => {
            this.bottomChart.ChangeSymbol(this.Symbol)
          }, timeout)
        }
      },

      NetworkFilter(data, callback) {
        switch (data.Name) {
          case 'KLineChartContainer::ReqeustHistoryMinuteData': // 分钟全量数据下载
            this.RequestHistoryMinuteData(data, callback)
            break
        }
      },

      NetworkFilterV2(data, callback) {
        switch (data.Name) {
          case 'MinuteChartContainer::RequestMinuteData': // 当天分时图分钟全量数据下载
            this.RequestMinuteData(data, callback)
            break
        }
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
        if (!this.Socket) {
          this.Socket = new WebSocket(this.WSUrl) // 创建连接
          this.Socket.onopen = (event) => {
            var message = JSON.stringify(data.SendData)
            this.Socket.send(message)
            if (data.SendData.sub) this.LastSubString = data.SendData.sub
          }
        } else {
          // this.SendUnSubscribeMessage()
          var message = JSON.stringify(data.SendData)
          this.Socket.send(message)
          if (data.SendData.sub) this.LastSubString = data.SendData.sub // 保存最后一个订阅信息
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
          console.log(event)
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
        this.RequestWSData(obj, (recvData, data) => { this.RecvMinuteRealtimeData(recvData, data) })
      },

      RecvMinuteRealtimeData(recvData, data) {
        if (recvData.action != 'kline') return

        var internalChart = this.topChart.JSChartContainer

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

      // //请求 走势图 分钟历史数据
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

      // 接收分时图历史分钟数据
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

        this.RequestWSData(obj, (recvData, data) => { this.RecvZSTMinuteRealtimeData(recvData, data) })
      },

      RecvZSTMinuteRealtimeData(recvData, data) {
        if (recvData.action != 'kline') return

        this.RecvMinuteRealtimeData(recvData, data)

        if (!this.StockData) return

        var internalChart = this.bottomChart.JSChartContainer
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
          if (i % (60 * 2) == 0) // 2小时一个刻度
          {
            var value = indexData[i]
            xCoordinateData.Full.push([parseInt(i), 1, 'RGB(200,200,200)', jsChart.IFrameSplitOperator.FormatTimeString(value)])
          }

          if (i % (60 * 4) == 0) // 4小时一个刻度
          {
            var value = indexData[i]
            xCoordinateData.Simple.push([parseInt(i), 1, 'RGB(200,200,200)', jsChart.IFrameSplitOperator.FormatTimeString(value)])
          }

          if (i % (60 * 6) == 0) // 6小时一个刻度
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
      }
    },
    destroyed() {
      // 页面关闭的时候 销毁hqchart实例 和 ws连接
      if (this.topChart) this.topChart.StopAutoUpdate()
      if (this.bottomChart) this.bottomChart.StopAutoUpdate()
      if (this.Socket) this.Socket.close()
      console.log('ChartsCard Socket close success!')
      if (this.timeOutID) clearTimeout(this.timeOutID)
      if (this.timeOutIDV2) clearTimeout(this.timeOutIDV2)
    }
  }
</script>

<style lang="scss" scoped>
  .charts-card {
    width: 575px;
    height: 518px;
  }
</style>
