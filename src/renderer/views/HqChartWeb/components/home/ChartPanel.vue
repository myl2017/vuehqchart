<template>
  <section class="charts-wrap">
    <div class="chart-item" @dblclick="goDetail(hotStock[0])">
      <div class="kline-title"><h2>BTC</h2></div>
      <div id="leftKLine" ref='leftKLine' style="position: relative;"></div>
    </div>
    <div class="chart-item" @dblclick="goDetail(hotStock[1])">
      <div class="kline-title"><h2>ETH</h2></div>
      <div id="rightKLine" ref='rightKLine' style="position: relative;"></div>
    </div>
  </section>
</template>

<script>
  import '../../../../vendor/jscommon/umychart.resource/css/tools.css'
  import '../../../../vendor/jscommon/umychart.resource/font/iconfont.css'
  import jsChart from '../../../../vendor/jscommon/umychart.vue/umychart.vue.js'
  import $ from 'jquery'
  import pako from 'pako'
  import {getHotCurrency} from '@/api/home'
  import {getToken} from '@/utils/auth'

  jsChart.JSConsole.Chart.Log = () => { }
  jsChart.JSConsole.Complier.Log = () => { }

  export default {
    name: 'ChartPanel',
    data() {
      return {
        CustomDefColorAry: {up: 'rgb(25,158,0)', down: 'rgb(238,21,21)'}, // 自定义默认颜色,绿涨红跌
        // k线属性
        leftChart: null,
        leftOption: null,
        Symbol: 'btcusdt.BIT',
        OriginalSymbol: 'btcusdt',

        rightChart: null,
        rightOption: null,
        SymbolRight: 'ethusdt.BIT',
        OriginalSymbolRight: 'ethusdt',

        // WSUrl: 'wss://api.huobiasia.vip/ws',
        WSUrl: 'ws://xhusdt.newbt.cn/',
        Socket: null,
        LastSubString: null, // 最后一个订阅的数据


        WSUrlV2: 'ws://xhusdt.newbt.cn/',
        SocketV2: null,
        LastSubStringV2: null, // 最后一个订阅的数据

        timeoutId: null,
        timeoutIdV2: null,

        clientWidth: null,
        hotStock: []
      }
    },
    created() {
      this.clientWidth = document.body.clientWidth
      this.fetchData()
    },
    mounted() {
      this.initStyle()
      this.LoadEnvironment()
      this.$nextTick(() => {
        this.createLeftChart()
      })

      this.$nextTick(() => {
        setTimeout(() => {
          this.createRightChart()
        }, 2000)
      })
    },
    methods: {
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
        this.leftOption =
          {
            Type: '历史K线图',

            DragDownload:
              {
                Minute: {Enable: true}, // 开启分钟数据拖拽下载
                Day: {Enable: true} // 开启日线数据拖拽下载
              },

            Windows: // 窗口指标
              [
                {Index: 'MA', Modify: true, Change: true},
                {Index: 'VOL', Modify: true, Change: true}
              ],
            Symbol: this.Symbol,
            IsAutoUpdate: false, // 是自动更新数据(不自动更新由外部更新)
            IsApiPeriod: true, // 使用Api计算周期
            IsShowRightMenu: false, // 右键菜单

            KLine: // K线设置
              {
                DragMode: 1, // 拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
                Right: 0, // 复权 0 不复权 1 前复权 2 后复权
                Period: 0, // 周期 0 日线 1 周线 2 月线 3 年线
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
                Top: -26
              },

            Frame: // 子框架设置
              [
                {SplitCount: 7, StringFormat: 0, IsShowLeftText: true, IsShowRightText: true, Custom: [{Type: 0, Position: 'right'}]}
              ]
          }

        // K线图配置
        this.rightOption =
          {
            Type: '历史K线图',

            DragDownload:
              {
                Minute: {Enable: true}, // 开启分钟数据拖拽下载
                Day: {Enable: true} // 开启日线数据拖拽下载
              },

            Windows: // 窗口指标
              [
                {Index: 'MA', Modify: true, Change: true},
                {Index: 'VOL', Modify: true, Change: true}
              ],
            Symbol: this.SymbolRight,
            IsAutoUpdate: false, // 是自动更新数据(不自动更新由外部更新)
            IsApiPeriod: true, // 使用Api计算周期
            IsShowRightMenu: false, // 右键菜单

            KLine: // K线设置
              {
                DragMode: 1, // 拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
                Right: 0, // 复权 0 不复权 1 前复权 2 后复权
                Period: 0, // 周期 0 日线 1 周线 2 月线 3 年线
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
                Top: -26
              },

            Frame: // 子框架设置
              [
                {SplitCount: 7, StringFormat: 0, IsShowLeftText: true, IsShowRightText: true, Custom: [{Type: 0, Position: 'right'}]}
              ]
          }
      },

      createLeftChart() {
        if (!$('#leftKLine')) return
        // 黑色风格
        var blackStyle = jsChart.HQChartStyle.GetStyleConfig(jsChart.STYLE_TYPE_ID.BLACK_ID)
        jsChart.JSChart.SetStyle(blackStyle)
        jsChart.MARKET_SUFFIX_NAME.GetBITDecimal = (symbol) => { return this.GetBITDecimal(symbol) }

        // 更新k线图
        if (this.clientWidth < 1920) {
          $('#leftKLine').width(Number(480))
          $('#leftKLine').height(Number(300))
        } else {
          $('#leftKLine').width(Number(670))
          $('#leftKLine').height(Number(311))
        }

        if (this.leftChart == null) {
          this.leftChart = jsChart.jsChartInit(this.$refs.leftKLine) // 初始化K线图
          this.leftOption.KLine.Period = 0 // 日线
          this.leftOption.NetworkFilter = this.NetworkFilter
          this.leftChart.SetOption(this.leftOption)
          this.leftChart.OnSize()
        }
      },

      //数字货币价格对应的小数位数
      GetBITDecimal(symbol) {
        return 2
      },

      createRightChart() {
        if (!$('#rightKLine')) return
        var blackStyle = jsChart.HQChartStyle.GetStyleConfig(jsChart.STYLE_TYPE_ID.BLACK_ID)
        jsChart.JSChart.SetStyle(blackStyle)

        if (this.clientWidth < 1920) {
          $('#rightKLine').width(Number(484))
          $('#rightKLine').height(Number(300))
        } else {
          // 更新k线图
          $('#rightKLine').width(Number(670))
          $('#rightKLine').height(Number(311))
        }

        if (this.rightChart == null) {
          this.rightChart = jsChart.jsChartInit(this.$refs.rightKLine) // 初始化K线图
          this.rightOption.KLine.Period = 0 // 日线
          this.rightOption.NetworkFilter = this.NetworkFilterV2 // 版本2
          this.rightChart.SetOption(this.rightOption)
          this.rightChart.OnSize()
        }
      },

      NetworkFilter(data, callback) {
        switch (data.Name) {
          case 'KLineChartContainer::RequestHistoryData': // 日线全量数据下载
            this.RequestHistoryData(data, callback)
            break
        }
      },

      NetworkFilterV2(data, callback) {
        switch (data.Name) {
          case 'KLineChartContainer::RequestHistoryData': // 日线全量数据下载
            this.RequestHistoryDataV2(data, callback)
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
            console.log(event)
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
            // console.log(e);
            const ploydata = new Uint8Array(e.target.result)
            const msg = pako.inflate(ploydata, {to: 'string'})
            // console.log("[KLineChart::RequestWSData] recv ws data ",msg)
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

        this.RequestWSData(obj, (recvData, data) => { this.RecvRealtimeData(recvData, data) })
      },

      RecvRealtimeData(recvData, data) {
        if (recvData.ch != data.SendData.subUrl) return

        // if (recvData.ch != 'market.btcusdt.kline.1day') return

        var internalChart = this.leftChart.JSChartContainer
        var period = internalChart.Period
        var symbol = internalChart.Symbol
        // if (symbol != data.Symbol || period != data.Period) return

        var hqChartData = {code: 0, stock: []}
        // TODO:把recvData => hqchart内部格式 格式看教程
        // HQChart使用教程30-K线图如何对接第3方数据14-轮询增量更新日K数据

        // var stock = { symbol: data.Symbol, name: data.OriginalSymbol } //etcusdt.BIT etcusdt
        var stock = {symbol: this.Symbol, name: this.OriginalSymbol}

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
        stock.vol = item.amount
        stock.amount = item.vol

        hqChartData.stock.push(stock)

        internalChart.RecvRealtimeData(hqChartData)
      },

      //////////////////////////SocketV2/////////////////////////////

      // 发送心跳
      SendWSHeartMessageV2() {
        if (this.SocketV2) {
          var pong = {'pong': new Date().getTime()}
          this.SocketV2.send(JSON.stringify(pong))
        }
      },

      // 取消订阅上一次的信息
      SendUnSubscribeMessageV2() {
        if (!this.LastSubStringV2 || !this.SocketV2) return

        var message = JSON.stringify({unsub: this.LastSubStringV2}) // 取消上次订阅的信息
        this.SocketV2.send(message)
        this.LastSubStringV2 = null // 清空最后一个订阅信息
      },

      // ws请求
      RequestWSDataV2(data, recvCallback) {
        if (!this.SocketV2) {
          this.SocketV2 = new WebSocket(this.WSUrlV2) // 创建连接
          this.SocketV2.onopen = (event) => {
            var message = JSON.stringify(data.SendData)
            this.SocketV2.send(message)
            if (data.SendData.sub) this.LastSubStringV2 = data.SendData.sub
          }
        } else {
          // this.SendUnSubscribeMessageV2()
          var message = JSON.stringify(data.SendData)
          this.SocketV2.send(message)
          if (data.SendData.sub) this.LastSubStringV2 = data.SendData.sub // 保存最后一个订阅信息
        }

        this.SocketV2.onmessage = (event) => {
          var reader = new FileReader()
          reader.addEventListener('loadend', (e) => {
            const ploydata = new Uint8Array(e.target.result)
            const msg = pako.inflate(ploydata, {to: 'string'})
            var recvData = JSON.parse(msg)
            if (recvData.ping) {
              this.SendWSHeartMessageV2() // 回复服务器心跳包
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

        this.SocketV2.onerror = (event) => {
          console.log(event)
        }

        this.SocketV2.onclose = (e) => {
          console.log('SocketV2 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
        }
      },

      // 日K数据下载 V2 (Version 2)
      RequestHistoryDataV2(data, callback) {
        data.PreventDefault = true
        var symbol = data.Request.Data.symbol
        var period = data.Self.Period // 周期
        var postData = this.GeneratePostData(this.OriginalSymbolRight, period)

        var obj = {
          SendData: postData.Req,
          Symbol: symbol,
          OriginalSymbol: this.OriginalSymbolRight,
          Period: period,
          Callback: callback
        }

        this.RequestWSDataV2(obj, (recvData, data) => { this.RecvHistoryDataV2(recvData, data) })
      },

      // 接收到日线数据 V2
      RecvHistoryDataV2(recvData, data) { // 接收到日线数据 转化成hqchart格式数据
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

        this.SubscribRealtimeDataV2(data)
      },

      // 订阅最新日K线数据 V2
      SubscribRealtimeDataV2(data) {
        // 订阅最新数据
        var postData = this.GeneratePostData(data.OriginalSymbol, data.Period)

        var obj = {
          SendData: postData.Sub,
          Symbol: data.Symbol,
          OriginalSymbol: data.OriginalSymbol,
          Period: data.Period
        }

        this.RequestWSDataV2(obj, (recvData, data) => { this.RecvRealtimeDataV2(recvData, data) })
      },

      // 接收订阅最新日K线数据 V2
      RecvRealtimeDataV2(recvData, data) {
        if (recvData.ch != data.SendData.subUrl) return
        var internalChart = this.rightChart.JSChartContainer
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
        stock.vol = item.amount
        stock.amount = item.vol

        hqChartData.stock.push(stock)

        internalChart.RecvRealtimeData(hqChartData)
      },

      fetchData() {
        this.hotStock = []
        getHotCurrency({token: getToken()}).then(res => {
          this.hotStock = res.data
        })
      },
      goDetail(stock) {
        this.$router.push({path: '/hqdetail', query: {stock: JSON.stringify(stock)}})
      }
    },
    destroyed() {
      // 页面关闭的时候 销毁hqchart实例 和 ws连接
      if (this.leftChart) this.leftChart.StopAutoUpdate()
      if (this.rightChart) this.rightChart.StopAutoUpdate()
      if (this.Socket) this.Socket.close()
      if (this.SocketV2) this.SocketV2.close()
      console.log('热门币种websocket已关闭成功!')
    }
  }
</script>

<style lang="scss" scoped>
  /*夜间模式*/
  .custom-theme {
    .charts-wrap {
      .kline-title {
        background: #1E1F20 !important;
      }
    }
  }

</style>
<style lang="scss" scoped>
  /*夜间&白天，通用样式*/
  .charts-wrap {
    margin-right: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(100% - 16px);

    .chart-item {
      width: calc(50% - 4px);
      text-align: center;

      > .kline-title {
        background: #E8E8E8;

        > h2 {
          height: 24px;
          line-height: 24px;
          font-size: 14px;
          font-weight: bold;
          color: #F66C00;
        }
      }

      #leftKLine, #rightKLine {
        height: 311px;
      }
    }

    .chart-item:first-child {
      margin-right: 8px;
    }
  }
</style>
