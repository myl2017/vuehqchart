<template>
  <ul class="navbar-wrapper" id="navBar">
    <li class="home-item" @click="goHome">
      <img src="../../../../assets/icons/common/home.png" alt="">
      <div>首页</div>
    </li>
    <li @click="goBack">
      <div class="back-img-wrap"></div>
      <div>返回</div>
    </li>
    <li class="classify-item">
      <div>行情</div>
    </li>
    <li v-for="item in hqSubMenu" :key="item" @click="handleSelected(item, null)">
      <div>{{item}}</div>
    </li>
    <li class="classify-item">
      <div>资讯</div>
    </li>
    <li class="info">
      <div class="info-inner">
        <div v-for="item in infoSubMenu" :key="item">{{item}}</div>
      </div>
    </li>
    <template v-if="JSON.stringify(plateClassifyData) !== '[]'">
      <li class="classify-item">
        <div>板块</div>
      </li>
      <li class="info">
        <div class="info-inner plates">
          <div v-for="item in plateClassifyData" :key="item.id" @click="handleSelected(item.plate_name, item.id)">{{item.plate_name}}</div>
          <div v-if="plateClassifyData.length < 2" v-for="d in divList" :key="'div'+ d ">分类{{d}}</div>
        </div>
      </li>
    </template>
    <li class="other-item"></li>
    <li class="last-item">
      <SubNavCard/>
    </li>
  </ul>
</template>

<script>
  import eventBus from '@/utils/bus.js'
  import SubNavCard from './SubNavCard'
  import {getToken} from '@/utils/auth'
  import {getPlateClassifyList} from '@/api/home.js'
  import {getPlateCount, batchInsertPlateClassify, queryPlateClassify} from '@/utils/sqlHelper'

  export default {
    name: 'NavBar',
    components: {SubNavCard},
    data() {
      return {
        hqSubMenu_backup: ['现货', '合约', '自选', 'BTC'],
        // hqSubMenu: ['自选','USDT', 'BTC', '合约'],
        hqSubMenu: ['自选', 'USDT', '合约'],
        infoSubMenu: ['资讯1', '资讯2', '资讯3', '资讯4'],

        // 版块
        plateClassifyParam: {
          token: null,
          limit: 15,
          page: 0,
          plate_name: ''
        },
        plateClassifyData: [],
        intervalID: null,
        sum: 1,
        isLock: false,

        divList: [0, 1]
      }
    },
    created() {
      if (getToken()) { this.initPlateClassify() }
      this.getEventData()
    },
    methods: {
      getEventData() {
        eventBus.$on('userInformation', data => {
          this.plateClassifyParam.token = data.token
          if (this.plateClassifyParam.token && sessionStorage.getItem('VersionUpgrade')) {
            this.fetchPlate()
          }
        })
      },
      goHome() {
        eventBus.$emit('homeView', false)
        this.$router.push({path: '/'})
      },
      goBack() {
        eventBus.$emit('closeFakeKLine', false)

        const strHref = window.location.href
        // string.indexOf() 如果字符串中不包含目标字符会返回-1, >= 0 代表包含在其中
        if (strHref.indexOf('?') >= 0) {
          window.history.go(-1)
        } else {
          eventBus.$emit('homeView', false)
          window.history.go(1)
        }
      },
      handleSelected(item, plate_id) {
        window.sessionStorage.setItem('CurrentSelectedPanel', item)

        eventBus.$emit('selected', item, true, plate_id)

        if (window.location.href.indexOf('hqdetail?') >= 0) {
          this.$router.push({path: '/', query: {selected: item}})
        }
      },
      initPlateClassify() {
        try {
          getPlateCount().then(data => {
            if (data[0].count > 0) {
              this.fetchPlateClassify()
            } else {
              this.plateClassifyParam.token = getToken()
              this.fetchHttpPlate(true)
            }
          })
        } catch (e) {
          this.plateClassifyParam.token = getToken()
          this.fetchHttpPlate(false)
        }
      },
      fetchHttpPlate(diff) {
        this.plateClassifyParam.page += 1
        getPlateClassifyList(this.plateClassifyParam).then(res => {
          if (res.data.list && res.data.list.length > 0) {
            this.plateClassifyData = this.plateClassifyData.concat(res.data.list)
            if (diff) {
              batchInsertPlateClassify(this.plateClassifyData, localStorage.getItem('SYS_Token'))
            } else {}
          }
        })
      },
      fetchPlateClassify() {
        // 查询 本地sqlite 板块分类表
        queryPlateClassify().then(res => {
          this.plateClassifyData = res
          eventBus.$emit('plateClassifyData', this.plateClassifyData)
        })
      },
      fetchPlate() {
        this.plateClassifyParam.page += 1
        getPlateClassifyList(this.plateClassifyParam).then(res => {
          if (res.data.list && res.data.list.length > 0) {
            this.plateClassifyData = this.plateClassifyData.concat(res.data.list)
          }
        })
      }
    },
    destroyed() {
      if (this.intervalID) clearInterval(this.intervalID)
    }
  }
</script>
<style lang="scss" scoped>
  .navbar-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    background: #fff;

    .back-img-wrap {
      width: 18px;
      height: 18px;
      background: transparent url("../../../../assets/icons/white/backhei.png") no-repeat;
      background-size: contain;
    }

    > li {
      font-size: 16px;
      font-size: $fontSize14;
      color: inherit;
      min-width: 70px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      border-top: 2px solid #F6F6F6;
      border-right: 2px solid #F6F6F6;
    }

    .home-item {
      > img {
        width: 18px;
        height: 18px;
      }
    }

    .classify-item {
      min-width: 38px;
      max-height: 40px;
      writing-mode: lr-tb;
      writing-mode: tb-rl;
      color: #F66C00;
      letter-spacing: 2px;
    }

    .info {
      .info-inner {
        width: 164px;
        display: flex;
        flex-wrap: wrap;

        > div {
          min-width: 82px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        > div:first-child {
          border-bottom: 2px solid #F6F6F6;
          border-right: 2px solid #F6F6F6;
        }

        > div:nth-child(2) {
          border-bottom: 2px solid #F6F6F6;
        }

        > div:nth-child(3) {
          border-right: 2px solid #F6F6F6;
        }
      }

      .plates {
        div:first-child {
          min-width: 86px;
        }

        div:nth-child(2) {
          border-bottom: none !important;
          border-right: 2px solid #000000;
        }
      }
    }

    .other-item {
      width: 38vw;
      background-color: blue;
    }

    .last-item {
      width: 400px;
    }
  }
</style>
