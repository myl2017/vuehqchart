<template>
  <div id="SeamlessScrollWrap">
    <ul id="SeamlessScroll">
      <li v-for="(item, index) in list" :key="index" @click="onShowInfo(item)">
        <div>{{item.post_date}}</div>
        <div>{{ item.title }}</div>
      </li>
    </ul>

    <InfoDialog v-if="infoVisible" :currentInfo="currentInfo"/>
  </div>
</template>

<script>
  import { getAfficheList } from '@/api'
  import { getToken } from '@/utils/auth'
  import eventBus from '@/utils/bus.js'
  import { getInfoDetail } from '@/api'
  import InfoDialog from '../dialog/InfoDialog'

  export default {
    name: 'SeamlessScroll',
    components: { InfoDialog },
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
          source: { from: null, name: null, link: null },
          status: null,
          title: null,
          topic: null
        },
        infoVisible: false
      }
    },
    created() {
      // 阻止重复请求
      if (this.list && this.list.length > 0) return
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
      fetchData() {
        getAfficheList(this.listParam).then(res => {
        this.list = res.data

        clearInterval(this.timeout)  //fix bug 748
        this.timeout = setInterval(() => {
        this.fetchData()
        }, 60000*15) 
        })
      },
      fetchDataV2() {
        this.params.token = getToken()
        getInfoDetail(this.params).then(res => {
          if (!res.data) return
          this.currentInfo = res.data
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #SeamlessScrollWrap {
    width: 100%;
    height: 32px;
    margin-left: 20px;
    margin-right: 20px;
    overflow: hidden;
    position: relative;

    #SeamlessScroll {
      position: absolute;
      left: 0;
      top: 0;
      -webkit-animation: 80s move infinite linear;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;

      > li {
        display: flex;
        align-items: center;
        width: auto;
        height: 32px;
        font-size: $fontSize14;
        white-space: nowrap;
        margin-right: 30px; //fix bug 743

        div:nth-child(2) {
          margin-left: 10px; //fix bug 743
        }
      }
    }
  }

  @-webkit-keyframes move {
    0% {
      left: 0;
    }
    100% {
      left: -100%;
    }
  }

  @keyframes move {
    0% {
      left: 0;
    }
    100% {
      left: -100%;
    }
  }

  #SeamlessScrollWrap:hover #SeamlessScroll {
    -webkit-animation-play-state: paused; /*动画暂停播放*/
  }
</style>
