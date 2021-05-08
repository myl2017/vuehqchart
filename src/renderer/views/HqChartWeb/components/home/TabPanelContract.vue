<template>
  <el-table :data="list" v-loading="loading" element-loading-text="拼命加载中" :default-sort="{prop: 'id', order: 'ascending'}" fit highlight-current-row
            class="common-table" @row-click="handleClick" @row-dblclick="handledbClick" v-el-table-infinite-scroll="load" :height="height">
    <el-table-column type="index" label="序号" sortable width="60" align="center"></el-table-column>
    <el-table-column prop="contract_code" label="代码" align="left" width="160">
      <template slot-scope="{row}">
        <!-- 类型（交割合约contract、永续swap）-->
        <template v-if="row.type === 'swap'">{{ row.contract_code }}</template>
        <template v-if="row.type === 'contract'">
          <!-- 当周: this_week, 次周: next_week, 当季: quarter, 次季: next_quarter -->
          <template v-if="row.contract_type === 'this_week'">{{ row.contract_code }}</template>
          <template v-if="row.contract_type === 'next_week'">{{ row.contract_code }}</template>
          <template v-if="row.contract_type === 'quarter'">{{ row.contract_code }}</template>
          <template v-if="row.contract_type === 'next_quarter'">{{ row.contract_code }}</template>
        </template>
      </template>
    </el-table-column>  <!--fix bug 781-->
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
    <el-table-column prop="high" label="最高价" align="right">
      <template slot-scope="{row}">
        <div class="high">
          <span>{{ row.high }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="low" label="最低价" align="right"></el-table-column>
    <el-table-column prop="vol" label="24H量(张)" align="right" width="220"></el-table-column>
    <el-table-column prop="amount" label="24H成交金额" align="right" width="220"></el-table-column>
  </el-table>
</template>

<script>
  import eventBus from '@/utils/bus.js'
  import {getContractList} from '@/api/home.js'
  import {getToken} from '@/utils/auth.js'
  import pako from 'pako'

  export default {
    name: 'TabPanelContract',
    props: {
      market: {
        type: String,
        required: true
      },
      height: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        listParam: {
          token: null,
          limit: 15,
          page: 1,
          type: ''     // 类型（交割合约contract、永续swap）
        },
        list: [],
        total: 0,
        loading: false,

        WSUrl: 'ws://swap.newbt.cn/',         // 永续合约
        Socket: null,
        LastSubString: null,                  // 最后一个订阅的数据


        WSUrlV2: 'ws://contract.newbt.cn/',   // 交割合约
        SocketV2: null,
        LastSubStringV2: null,                // 最后一个订阅的数据

        timeOutID: null
      }
    },
    watch: {
      list(newval, oldval) {
        if (newval && newval.length !== oldval.length) {
          if (this.SocketV2) {
            this.SocketV2.close()
            this.SocketV2 = null
            this.handleNextData()
            console.log('Watch handleNextData')
          }
        }
      }
    },
    created() {
      this.getEventData()

      this.listParam.token = getToken()
      if (!this.listParam.token) return

      this.handlePostData(this.market)

    },
    mounted() {
      this.createWSConnect()

      this.handleNextData()
    },
    methods: {
      handleNextData() {
        this.timeOutID = setTimeout(() => {

          this.createWSConnectV2()

          let flag = 0, data = []
          for (var i = 0; i < this.list.length; i++) {
            let index = ''
            for (var j = 0; j < data.length; j++) {
              if (data[j][0].symbol === this.list[i].symbol) {
                flag = 1
                index = j
                break
              }
            }
            if (flag === 1) {
              data[index].push(this.list[i])
              flag = 0
            } else if (flag === 0) {
              let itemAry = new Array()
              itemAry.push(this.list[i])
              data.push(itemAry)
            }
          }

        }, 1600)
      },
      createWSConnect() {
        var obj = {SendData: {sub: 'overview'}}
        this.RequestWSData(obj)
      },
      createWSConnectV2() {
        var obj = {SendData: {sub: 'overview'}}
        this.RequestWSDataV2(obj)
      },

      getEventData() {
        eventBus.$on('selected', (value1, value2) => {
          window.isMaximize = value2
        })
      },
      handlePostData(value) {
        switch (value) {
          case '合约':
            this.fetchContractData()
            break
        }
      },
      format(num) {
        num = parseInt(num)
        var reg = /\d{1,3}(?=(\d{3})+$)/g
        return (num + '').replace(reg, '$&,')
      },
      fetchContractData() {
        this.list = []
        this.loading = true
        getContractList(this.listParam).then(res => {
          this.list = res.data.data
          window.sessionStorage.setItem('DefaultContractSymbol', this.list[0].contract_short_type)

          this.total = Math.ceil(res.data.count / this.listParam.limit)

          this.loading = false
        })
      },
      load() {
        if (this.listParam.page < this.total) {
          this.listParam.page += 1
          getContractList(this.listParam).then(res => {
            this.list = this.list.concat(res.data.data)
          })
        }
      },
      handleClick(row) {
        window.sessionStorage.setItem('DefaultContractSymbol', row.contract_short_type)
        window.sessionStorage.setItem('ContractType', row.type)
        window.sessionStorage.setItem('YAxisDecimal', row.price_precision)

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
          if (this.$route.path === '/') {
            if (this.Socket) {
              this.Socket.close()
              this.Socket = null
            }
            this.createWSConnect()
            console.log('已重连成功createWSConnect fn...')
          }
        }

        this.Socket.onclose = (e) => {
          console.log('Socket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
          if (this.$route.path === '/') {
            if (this.Socket) {
              this.Socket.close()
              this.Socket = null
            }
            this.createWSConnect()
            console.log('已重连成功createWSConnect fn...')
          }
        }
      },

      RecvOverviewRealtimeData(recvData) {
        let objData = recvData.data

        this.list = this.list && this.list.filter((item) => {
          let objKey = item.contract_short_type.toLowerCase()
          let recvItem = objData[`${objKey}`]
          if (!recvItem) {

          } else {
            item.close = recvItem.close
            item.price_limit = recvItem.price_limit.toFixed(item.price_precision)
            item.rate = recvItem.rate.toFixed(2)
            item.high = recvItem.high
            item.low = recvItem.low
            item.amount = this.format(recvItem.vol * item.contract_size)
            item.vol = this.format(recvItem.vol)
          }
          return item
        })
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
              // recvCallback(recvData, data)
              this.RecvOverviewRealtimeDataV2(recvData)
            }
          })

          reader.readAsArrayBuffer(event.data, 'utf-8')
        }

        this.SocketV2.onerror = (event) => {
          if (this.$route.path === '/') {
            if (this.SocketV2) {
              this.SocketV2.close()
              this.SocketV2 = null
            }
          }
          this.createWSConnectV2()
          console.log('已重连成功createWSConnectV2 fn...')
        }

        this.SocketV2.onclose = (e) => {
          console.log('SocketV2 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
          if (this.$route.path === '/') {
            if (this.SocketV2) {
              this.SocketV2.close()
              this.SocketV2 = null
            }
          }
          this.createWSConnectV2()
          console.log('已重连成功createWSConnectV2 fn...')
        }
      },

      RecvOverviewRealtimeDataV2(recvData) {
        let objData = recvData.data

        this.list = this.list && this.list.filter((item) => {
          let objKey = item.contract_short_type.toLowerCase()
          let recvItem = objData[`${objKey}`]
          if (!recvItem) {

          } else {
            item.close = recvItem.close
            item.price_limit = recvItem.price_limit.toFixed(2)
            item.rate = recvItem.rate.toFixed(2)
            item.high = recvItem.high
            item.low = recvItem.low
            item.amount = this.format(recvItem.vol * item.contract_size)
            item.vol = this.format(recvItem.vol)
          }
          return item
        })
      }
    },
    destroyed() {
      if (this.Socket) this.Socket.close()
      if (this.SocketV2) this.SocketV2.close()
      console.log(`${this.market} 合约Socket已关闭!`)
      if (this.timeOutID) clearTimeout(this.timeOutID)
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

    td:nth-child(3) {
      color: #00C2FF;
    }

    td:nth-child(4), td:nth-child(6), td:nth-child(7) {
      color: #EE0000;
    }

    td:nth-child(5) {
      color: #FFAA00;
    }

    td:nth-child(8) {
      color: #00C2FF !important;
    }

    td:nth-child(9) {
      color: #F6F6F6;
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

    .high > span {
      color: #FFAA00;
    }
  }
</style>
