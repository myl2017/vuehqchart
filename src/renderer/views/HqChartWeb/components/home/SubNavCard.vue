<template>
  <div class="subnavcard-wrapper">
    <div class="stock-fullname">{{name}}</div>
    <div class="introduction" @click="onIntroduction">简介</div>
    <div v-if="isContract !== 1" class="collection" :class="{'active': isActive, 'disabled': isOk}" @click="toggleClasses"></div>

    <IntroductDialog v-if="introVisible" :stock="stock"></IntroductDialog>
    <ContractDialog v-if="contractVisible" :stock="stock"></ContractDialog>
  </div>
</template>

<script>
  import IntroductDialog from '../dialog/IntroductDialog'
  import eventBus from '@/utils/bus'
  import {createCollect, deleteCollect} from '@/api'
  import {getToken} from '@/utils/auth'
  import ContractDialog from '../dialog/ContractDialog'
  import {getCollectList} from '@/api/home.js'

  export default {
    name: 'SubNavCard',
    components: {ContractDialog, IntroductDialog},
    data() {
      return {
        isActive: false,
        name: null,
        introVisible: false,
        stock: null,

        params: {
          token: null,
          currency_id: null
        },
        isOk: false,
        isContract: null,
        contractVisible: false
      }
    },
    created() {
      this.getEventData()
    },
    mounted() {
      let strStock = sessionStorage.getItem('CurrentStock')
      this.updateMsg(strStock)
      this.fetchCollectData()
    },
    methods: {
      updateMsg(strStock) {
        if (strStock) {
          let objStock = JSON.parse(strStock)
          this.stock = objStock
          if (objStock.type && objStock.type === 'swap') {
            this.isContract = 1
            this.name = objStock.symbol + '永续'
            return // 不会往下再执行
          } else if (objStock.type && objStock.type === 'contract') {
            this.isContract = 1
            if (objStock.market) {
              objStock.contract_type = objStock.market
            }
            switch (objStock.contract_type) {
              case 'this_week':
                this.name = objStock.symbol + '·当周'
                break
              case 'next_week':
                this.name = objStock.symbol + '·次周'
                break
              case 'quarter':
                this.name = objStock.symbol + '·当季'
                break
              case 'next_quarter':
                this.name = objStock.symbol + '·次季'
                break
            }
            return // 不会往下再执行
          }

          this.name = objStock.display_name
          // if (objStock.is_collect === 1) {
          //   this.isActive = true
          // } else {
          //   this.isActive = false
          // }
        }
      },
      fetchCollectData() {
        if (!sessionStorage.getItem('CurrentStock')) { return }
        let stock = JSON.parse(sessionStorage.getItem('CurrentStock'))
        getCollectList({token: getToken()}).then(res => {
          let result = res.data && res.data.filter(item => {
            return item.name === stock.name
          })
          if (result[0] && result[0].is_collect === 1) {
            this.isActive = true
          } else {
            this.isActive = false
          }
        })
      },
      toggleClasses() {
        this.isActive = !this.isActive

        this.params.token = getToken()
        this.params.currency_id = this.stock.id

        if (this.isActive) {
          this.isOk = true
          createCollect(this.params).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.isOk = false
            this.stock.is_collect = 1
            eventBus.$emit('CollectDataV2', this.stock)
          })
        } else {
          this.isOk = true
          deleteCollect(this.params).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.isOk = false
            this.stock.is_collect = 0
            eventBus.$emit('CollectDataV2', this.stock)
          })
        }
      },
      onIntroduction() {
        if (!this.isContract) {
          this.introVisible = true
        }

        if (this.isContract === 1) {
          this.contractVisible = true
        }
      },
      getEventData() {
        eventBus.$on('closeIntro', () => {
          this.introVisible = false
        })

        eventBus.$on('CollectData', (data) => {
          data.is_collect === 1 ? this.isActive = true : this.isActive = false
        })

        eventBus.$on('closeContract', (data) => {
          this.contractVisible = false
        })
        eventBus.$on('searchItem', data => {
          this.updateMsg(data)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .custom-theme {
    .subnavcard-wrapper {
      background: #121212;

      .collection {
        background: url("../../../../assets/icons/black/unstar.png") no-repeat;
        background-size: cover;
        background-position: 0;
      }

      .collection.active {
        background: url("../../../../assets/icons/black/star.png") no-repeat;
        background-size: cover;
        background-position: 0;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .subnavcard-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    background: #F6F6F6;

    .stock-fullname {
      margin-left: 8px;
      margin-right: 41px;
      font-size: 18px;
      color: rgba(246, 108, 0, 1) !important;
    }

    .introduction {
      width: 54px;
      height: 28px;
      background: rgba(8, 83, 126, 1);
      border-radius: 5px;
      font-size: $fontSize16;
      margin-right: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #DCDCDC;
      font-size: $fontSize15;
    }

    .collection {
      width: 24px;
      height: 24px;
      background: url("../../../../assets/icons/white/unstarhei.png") no-repeat;
      background-size: cover;
      background-position: 0;
      margin-right: 70px;
    }

    .collection.active {
      background: url("../../../../assets/icons/black/star.png") no-repeat;
      background-size: cover;
      background-position: 0;
    }

    .collection.disabled {
      pointer-events: none; /*禁用div不可点击*/
    }
  }
</style>
