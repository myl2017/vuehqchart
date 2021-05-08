<template>
  <el-table :data="list" v-loading="loading" element-loading-text="拼命加载中" :default-sort="{prop: 'id', order: 'ascending'}" fit highlight-current-row
            class="common-table" @row-click="handleClick" @row-dblclick="handledbClick" v-el-table-infinite-scroll="load" :height="height">
    <el-table-column type="index" label="序号" sortable width="60" align="center"></el-table-column>
    <el-table-column prop="name" label="代码" align="left"></el-table-column>
    <el-table-column prop="close" label="价格" align="right"></el-table-column>
    <el-table-column prop="rate" label="涨跌幅" align="right">
      <template slot-scope="{row}">
        <div v-if="row.rate < 0" class="rate-down">
          <span>{{ row.rate }}%</span>
        </div>
        <div v-else class="rate-up">
          <span>+{{ row.rate }}%</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="price_limit" label="涨跌额" align="right">
      <template slot-scope="{row}">
        <div v-if="row.price_limit < 0" class="rate-down">
          <span>{{ row.price_limit }}</span>
        </div>
        <div v-else class="rate-up">
          <span>+{{ row.price_limit }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="high" label="最高价" align="right"></el-table-column>
    <el-table-column prop="low" label="最低价" align="right"></el-table-column>
    <el-table-column prop="amount" label="成交量" align="right" width="220"></el-table-column>
    <el-table-column prop="vol" label="成交金额" align="right" width="220"></el-table-column>
  </el-table>
</template>

<script>
  import eventBus from '@/utils/bus.js'
  import {getPlateListById} from '@/api/home.js'
  import {getToken} from '@/utils/auth.js'
  import {batchInsertPlateList, getPlateDetailCount, queryPlateList} from '../../../../utils/sqlHelper'
  import pako from 'pako'

  export default {
    name: 'TabPanelPlate',
    props: {
      market: {
        type: String,
        required: true
      },
      plateId: {
        type: Number
      },
      height: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        // 板块数据
        plateParam: {
          token: null,
          plate_id: null,
          limit: 15,
          page: 0
        },
        list: [],
        total: 0,
        loading: false,

        intervalID: null,
        sum: 1,

        WSUrl: 'ws://xhusdt.newbt.cn/',
        Socket: null,
        LastSubString: null, // 最后一个订阅的数据
      }
    },
    created() {
      this.getEventData()
    },
    mounted() {

      this.handlePostData(this.plateId)

      this.plateParam.token = getToken()
      this.initPlateList()

      this.socketConnect()
    },
    methods: {
      initPlateList() {
        if (!this.plateId) return
        getPlateDetailCount(this.plateId).then(res => {
          if (res[0].count > 0) {
            this.plateParam.page = 1
            queryPlateList(this.plateParam).then(res => {
              this.list = res
            })
          } else {
            this.plateParam.token = getToken()
            this.plateParam.plate_id = this.plateId

            //重新初始化
            this.plateParam.page = 0
            this.sum = 1

            this.intervalID = setInterval(() => {
              if (this.plateParam.page < this.sum) {
                if (this.isLock) return
                this.isLock = true

                this.plateParam.page += 1
                getPlateListById(this.plateParam).then(res => {
                  this.sum = Math.ceil(res.data.count / this.plateParam.limit)
                  this.list = this.list.concat(res.data.list)
                  this.isLock = false
                  console.log('哒哒::: ', this.list)
                })
              } else {
                if (this.list.length > 0) {
                  batchInsertPlateList(this.list, this.plateId)
                }
                clearInterval(this.intervalID)
              }
            }, 1500)

          }
        })
      },
      getEventData() {
        eventBus.$on('selected', (value1, value2) => {
          window.isMaximize = value2
        })
      },
      handlePostData(plateId) {
        this.plateParam.plate_id = plateId
        this.fetchPlateData()
      },
      fetchPlateData() {
        console.log('one total::: ', this.total)

        this.list = []
        this.loading = true
        this.plateParam.page = 1
        queryPlateList(this.plateParam).then(data => {
          this.list = data
          this.loading = false
        })
      },
      load() {
        console.log('plate load currentpage===::: ', this.plateParam.page)
        if (this.plateParam.page < this.total) {
          this.plateParam.page += 1
          queryPlateList(this.plateParam).then(data => {
            this.list = this.list.concat(data)
          })
        }
      },
      format(num) {
        num = parseInt(num)
        var reg = /\d{1,3}(?=(\d{3})+$)/g
        return (num + '').replace(reg, '$&,')
      },
      handleClick(row) {
        window.DefaultNormalSymbol = row.symbol
        if (!window.isMaximize) return
        eventBus.$emit('clickSelected', row, window.isMaximize)
      },
      handledbClick(row) {
        this.$router.push({path: '/hqdetail', query: {stock: JSON.stringify(row)}})
      },

      // 发送心跳
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
      // ws请求
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
              // recvCallback(recvData, data)
              this.RecvOverviewRealtimeData(recvData)
            }
          })

          reader.readAsArrayBuffer(event.data, 'utf-8')
        }

        this.Socket.onerror = (event) => {
          console.log(event)
          if (this.$route.path === '/') {
            this.socketConnect()
          }
        }

        this.Socket.onclose = (e) => {
          if (this.$route.path === '/') {
            this.socketConnect()
          }
        }
      },
      socketConnect() {
        var obj = {SendData: {sub: 'overview'}}
        this.RequestWSData(obj)
      },
      RecvOverviewRealtimeData(recvData) {
        let objData = recvData.data
        this.list = this.list && this.list.filter((item) => {
          let objKey = item.name.toLowerCase() + item.market.toLowerCase()
          let recvItem = objData[`${objKey}`]

          if (!recvItem) {

          } else {
            item.close = recvItem.close
            item.price_limit = recvItem.price_limit.toFixed(item.price_precision)
            item.rate = recvItem.rate.toFixed(2)
            item.high = recvItem.high
            item.low = recvItem.low
            item.amount = this.format(recvItem.amount)
            item.vol = this.format(recvItem.vol)
          }

          return item
        })
      }
    },

    destroyed() {
      if (this.Socket) this.Socket.close()
      console.log(`${this.market} TabPanelPlate Socket close success!`)
      if (this.intervalID) clearInterval(this.intervalID)
    }
  }
</script>

<style lang="scss">
  /*table reset*/
  .common-table.el-table {
    background-color: #F6F6F6;

    thead {
      .cell {
        /*text-align: center; // table 表头 左对齐*/
      }
    }

    tr {
      height: 24px;
      line-height: 24px;
    }

    /*去掉table的border start */
    border: 0;

    th,
    tr,
    td,
    th.is-leaf {
      border: 0;
      background-color: #F6F6F6;
      cursor: pointer;
      padding: 3px !important;
    }

    td:nth-child(2) {
      color: #FFDE3A;
    }

    td:nth-child(3), td:nth-child(7) {
      color: #00C2FF;
    }

    td:nth-child(4), td:nth-child(6) {
      color: #EE0000;
    }

    td:nth-child(5) {
      color: #FFAA00;
    }

    &::before {
      height: 0px;
    }

    &::after {
      width: 0;
    }

    .el-table__fixed:before {
      height: 0;
    }

    .rate-down > span {
      color: #00FF11;
    }

    .rate-up > span {
      color: #EE0000;
    }
  }
</style>
