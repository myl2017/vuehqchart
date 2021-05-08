<template>
  <div class="hot-container">
    <div class="hot-bar">
      <div class="hot-bg"></div>
      <h2>7*24全球</h2>
    </div>
    <div class="hot-info">
      <a v-for="(item,index) in list" :key="`${item.title}`+index" @click="onShowInfo(item)">
        <div class="time">{{item.post_date}}</div>
        <div class="info-text" v-if="item.is_top === 0">{{item.title}}</div>
        <img src=../../../../assets/icons/black/ding.png v-if="item.is_top === 1" alt=""/>
        <div class="info-ding" v-if="item.is_top === 1">{{item.title}}</div>
      </a>
    </div>

    <InfoDialog v-if="infoVisible" :currentInfo="currentInfo"/>
  </div>
</template>

<script>
  import {getInfoList} from '@/api/home.js'
  import {getToken} from '@/utils/auth'
  import eventBus from '@/utils/bus.js'
  import {getInfoDetail} from '@/api'
  import InfoDialog from '../dialog/InfoDialog'

  export default {
    name: 'HotPanel',
    components: {InfoDialog},
    data() {
      return {
        listParam: {
          token: null
        },
        list: null,

        params: {
          token: null,
          id: null
        },
        currentInfo: {
          content: null,
          cover: null,
          desc: null,
          id: null,
          is_top: null,
          label: null,
          original_link: null,
          post_date: null,
          source: {from: null, name: null, link: null},
          status: null,
          title: null,
          topic: null
        },
        timeout: null,
        infoVisible: false
      }
    },
    created() {
      this.listParam.token = getToken()
      this.fetchData()
      this.getEventData()
    },
    methods: {
      getEventData() {
        eventBus.$on('closeInfo', (data) => {
          this.infoVisible = false
        })
      },
      onShowInfo(item) {
        this.infoVisible = true
        this.params.id = item.id
        this.fetchDataV2()
      },
      fetchDataV2() {
        this.params.token = getToken()
        getInfoDetail(this.params).then(res => {
          if (!res.data) return
          this.currentInfo = res.data
        })
      },
      beforeDestory() {
        clearInterval(this.timeout)
      },
      fetchData() {
        getInfoList(this.listParam).then(res => {
          this.list = res.data
          clearInterval(this.timeout)  //fix bug 747
          this.timeout = setInterval(() => {
            this.fetchData()
          }, 60000 * 15)
        })
      }
    }
  }
</script>


<style lang="scss" scoped>
  .hot-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    .hot-bar {
      display: flex;
      align-items: center;
      padding: 8px 0 6px 18px;
      width: 100%;

      .hot-bg {
        width: 16px;
        height: 16px;
        background: transparent url("../../../../assets/icons/black/hothuang.png") no-repeat;
        background-size: contain;
      }

      > h2 {
        font-size: $fontSize14;
        font-weight: bold;
        margin-left: 9px;
      }
    }

    .hot-info {
      padding-left: 18px;
      padding-right: 20px;
      overflow: hidden;
      flex-grow: 1;

      > a {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 22px;
        font-size: $fontSize14;
        // padding-bottom: 4px;   //fix bug 745 xxc
        // margin-bottom: 5px;

        .time {
          white-space: nowrap;
          margin-right: 32px;
        }

        .info-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          flex-grow: 1;
        }

        .info-ding {
          margin-left: 5px;
          overflow: hidden;
          color: #d81e06;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          flex-grow: 1;
        }
      }

      > a:hover {
        color: #FFAA00;
        position: relative;
      }

      > a:hover::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 2px;
        width: 100%;
        height: 0;
        border-bottom: 1px solid rgba(255, 170, 0, 1);
      }
    }
  }
</style>
