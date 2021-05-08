<template>
  <Layout class-prefix="layout-wrapper" :userData="userData">
    <div class="home-main">
      <section class="left-aside">
        <ChartPanel v-if="!isMaximize"></ChartPanel>
        <section class="list-container">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <template v-if="tabArray.indexOf(activeName) >= 0">
              <el-tab-pane label="自选" name="自选">
                <TabPanel v-if="activeName === '自选'" :market="activeName" :height="height"></TabPanel>
              </el-tab-pane>
              <el-tab-pane label="USDT" name="USDT" v-if="isSysToken!==null">
                <TabPanel v-if="activeName === 'USDT'" :market="activeName" :height="height"></TabPanel>
              </el-tab-pane>
              <!-- <el-tab-pane label="BTC" name="BTC" >
                <TabPanel v-if="activeName === 'BTC'" :market="activeName" :height="height"></TabPanel>
              </el-tab-pane> -->
              <el-tab-pane label="合约" name="合约">
                <TabPanelContract v-if="activeName === '合约'" :market="activeName" :height="height"></TabPanelContract>
              </el-tab-pane>
            </template>
            <template v-else>
              <el-tab-pane label="DeFi板块" name="DeFi板块">
                <TabPanelPlate v-if="activeName === 'DeFi板块'" :market="activeName" :plateId="plateId" :height="height"></TabPanelPlate>
              </el-tab-pane>
              <el-tab-pane label="波卡生态板块" name="波卡生态板块">
                <TabPanelPlate v-if="activeName === '波卡生态板块'" :market="activeName" :plateId="plateId" :height="height"></TabPanelPlate>
              </el-tab-pane>
              <!-- <el-tab-pane label="板块3" name="板块3">
                <TabPanelPlate v-if="activeName === '板块3'" :market="activeName" :plateId="plateId" :height="height"></TabPanelPlate>
              </el-tab-pane> -->
              <!-- <el-tab-pane label="板块4" name="板块4">
                <TabPanelPlate v-if="activeName === '板块4'" :market="activeName" :plateId="plateId" :height="height"></TabPanelPlate>
              </el-tab-pane> -->
            </template>
          </el-tabs>
        </section>
      </section>
      <section class="right-aside">
        <template v-if="configData.LB_switch === '1' && !isMaximize">
          <div class="swiper-panel">
            <iframe :src="iframeURL" width="100%" height="300" frameborder="0"></iframe>
          </div>
        </template>
        <template v-else>
          <EducationPanel v-show="!isMaximize"></EducationPanel>
        </template>
        <ChartsCard v-if="isFullHotList&&isMaximize&&isSwitchVisible"></ChartsCard>
        <HotPanel v-if="isSysToken!==null"></HotPanel>
      </section>
    </div>
    <FakeKLine v-if="isShowFakeKLine"/>
    <el-dialog
      title="版本升级" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" :visible.sync="centerDialogVisible" width="30%" center
      class="custom-dialog update-dialog">
      <span> {{this.versionInfo.desc}}</span>
      <span slot="footer" class="dialog-footer">
        <el-progress class="connect-progress" :text-inside="true" :stroke-width="20" :color="customColor" :percentage="percentage"></el-progress>
        <!--        <el-button @click="onVersionCancel" v-if="!versionInfo.is_force">取 消</el-button>-->
        <!--        <el-button type="primary" @click="onVersionOk">确 定</el-button>-->
      </span>
    </el-dialog>
  </Layout>
</template>

<script>
  import {ipcRenderer} from 'electron'

  ipcRenderer.send('max')
  import eventBus from '@/utils/bus.js'
  import TabPanel from './components/home/TabPanel'
  import HotPanel from './components/home/HotPanel'
  import ChartPanel from './components/home/ChartPanel'
  import EducationPanel from './components/home/EducationPanel'
  import ChartsCard from './components/home/ChartsCard'
  import Layout from '../layout/Layout'

  import {getConfig} from '@/api/home'
  import FakeKLine from './components/home/FakeKLine'
  import {getVersion} from '../../api/index'
  import {getToken, removeToken} from '../../utils/auth'
  import {getNotification} from '../../api/index'
  import config from '../../../../package.json'
  import TabPanelPlate from './components/home/TabPanelPlate'
  import TabPanelContract from './components/home/TabPanelContract'

  export default {
    name: 'StockList',
    components: {TabPanelContract, TabPanelPlate, FakeKLine, Layout, ChartsCard, EducationPanel, ChartPanel, HotPanel, TabPanel},
    data() {
      return {
        theme: true,
        tabArray: ['USDT', 'BTC', '合约', '自选'],
        activeName: 'USDT',
        isMaximize: false,  // 是否最大化显示
        height: 560,
        configData: {
          KF_tel: null,
          LB_switch: null,
          recommendations: null
        },
        versionInfo: {
          desc: null,
          version_number: null,
          link: null,
          is_force: null // 0不强制，1强制
        },
        notificationInfo: {
          title: null,
          content: null,
          id: null,
          status: null,
          create_at: null
        },
        iframeURL: process.env.NODE_ENV === 'development' ? '../../../../static/swiper/lazy-load-images.html' : `${__dirname}/static/swiper/lazy-load-images.html`,
        isFullHotList: false, //是否最大展示热门资讯
        clientWidth: null,
        Message: '弹窗显示的内容，爱我中国',
        isShowFakeKLine: false,
        centerDialogVisible: false,
        desc: null,
        percentage: 0,
        customColor: '#67c23a',
        plateId: null,
        plateClassifyData: [],
        isSysToken: {},
        userData: JSON.parse(localStorage.getItem('SYS_Token')),
        isSwitchVisible: true,

        // 自动更新
        timeOutId: null,
        updaterMessage: {
          error: '检查更新出错',
          checking: '正在检查更新……',
          updateAva: '检测到新版本，正在下载……',
          updateNotAva: '现在使用的就是最新版本，不用更新',
        },
      }
    },
    created() {
      this.onVersion()
      this.onNotification()
      this.fetchUser()

      this.clientWidth = document.body.clientWidth
      if (this.clientWidth <= 1366) {
        this.height = 180
      }
      this.getUrLParam()
      this.getEventData()
      this.fetchData()
      this.getVersionMsg()
      this.getWaring()
    },
    methods: {
      fetchUser() {
        const strCheckAll = window.localStorage.getItem('SYS_CheckAll')

        if (strCheckAll) {
          ipcRenderer.send('close', window.localStorage.getItem('SYS_Token'))
        }
      },
      onNotification() {
        //功能暂时不做
        // getNotification({token: getToken()}).then(res => {
        //   this.notificationInfo.title = res.data.title,
        //     this.notificationInfo.content = res.data.content,
        //     this.notificationInfo.id = res.data.id,
        //     this.notificationInfo.create_at = res.data.create_at,
        //     this.notificationInfo.status = res.data.status
        //   this.$notify({
        //     duration: 5000,
        //     type: 'info',
        //     title: this.notificationInfo.title,
        //     message: this.notificationInfo.content,
        //     position: 'bottom-right'
        //   })
        // }).catch(e => {
        //   this.$message.error(e.text)
        // })
      },
      onVersion() {
        this.versionInfo.version_number = config.version
        getVersion(this.versionInfo).then(res => {
          this.versionInfo.version_number = res.data.version_number
          this.versionInfo.desc = res.data.desc
          this.desc = res.data.desc
          this.versionInfo.link = res.data.link
          this.versionInfo.is_force = res.data.is_force
          if (config.version !== this.versionInfo.version_number) {
            // this.centerDialogVisible = true
            // localStorage.setItem('VersionUpgrade', res.data.version_number)
            this.triggerAutoUpdater(this.versionInfo.is_force)
          }
        }).catch(e => {
          this.$message.error(e.text)
        })
      },
      onVersionOk() {
        if (this.percentage === 0) {
          ipcRenderer.send('download', JSON.stringify({
            command: 'startDownload',
            versionUrl: this.versionInfo.link
          }))
        }
      },
      onVersionCancel() {
        if (this.versionInfo.is_force === 0)
          this.centerDialogVisible = false
        ipcRenderer.send('download', JSON.stringify({
          command: 'cancelDownload',
          versionUrl: this.versionInfo.link
        }))
      },
      getUrLParam() {
        const strHref = window.location.href
        if (strHref.indexOf('?selected') >= 0) {
          this.activeName = this.$route.query.selected
          this.isMaximize = true
          this.isShowFakeKLine = true

          if (this.clientWidth <= 1366) {
            this.height = 540
          } else {
            this.height = 900
          }
        }
      },
      getWaring() {
        eventBus.$on('show-waring', (value1, value2) => {
          let latestMsg = '您订阅的币种' + value1 + ',' + value2
          if (this.Message === latestMsg) {
            if (this.$route.path === '/hqdetail') {
              let elements = document.querySelectorAll('.el-notification')
              if (elements && elements.length > 1) {
                for (let i = 0; i < elements.length; i++) {
                  elements[i].remove()
                }
              }
              if (elements.length === 0) {
                this.showWaring('您订阅的币种' + value1 + ',' + value2)
              }
            } else {
              return
            }
          } else {
            this.Message = '您订阅的币种' + value1 + ',' + value2
            this.showWaring('您订阅的币种' + value1 + ',' + value2)
          }
        })
      },
      getVersionMsg() {
        // // 更新下载窗口的任务进度
        // ipcRenderer.on('download-item-updated', (e, item) => {
        //   if (item.state == 'interrupted') {
        //     this.$message({
        //       message: '下载失败',
        //       type: 'info'
        //     })
        //   }
        //   let percent = Number(((item.receivedBytes / item.totalBytes) * 100).toFixed(2))
        //   this.percentage = Math.ceil(percent)
        // }),
        //   // 下载结束，更新数据
        //   ipcRenderer.on('download-item-done', (e, item) => {
        //     if (item.state == 'completed') {
        //       this.$message({
        //         message: '下载成功，请安装',
        //         type: 'info'
        //       })
        //     }
        //   })
      },
      triggerAutoUpdater(isForce) {
        let isUpdate = true
        if (!isForce) { // null/0 (0不强制，1强制)
          this.$confirm('检测到最新版本, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$electron.ipcRenderer.send('checkForUpdate')
          }).catch(() => {
            isUpdate = false
            this.$message({
              type: 'info',
              message: '已取消版本更新'
            })
          })
          return isUpdate
        } else {
          this.$alert('检测到最新版本, 请更新', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$electron.ipcRenderer.send('checkForUpdate')
            }
          }).catch(() => {})
        }
        this.$electron.ipcRenderer.on('message', (event, text) => {
          console.log('messge arguments::: ', arguments)
          if (this.updaterMessage.checking === text) {

          } else if (this.updaterMessage.updateAva === text) {
            this.centerDialogVisible = true
          } else if (this.updaterMessage.updateNotAva === text) {
            this.$alert(text, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.centerDialogVisible = false
              }
            })
          } else if (this.updaterMessage.error === text) {
            this.centerDialogVisible = false
            this.$message.error(text)
          }
        })
        this.$electron.ipcRenderer.on('downloadProgress', (event, progressObj) => {
          console.log('downloadProgress::: ', progressObj)
          this.percentage = Math.round(parseFloat(progressObj.percent)) || 0
          if (this.percentage >= 100) {

            let result = removeToken()
            if (result) {
              localStorage.removeItem('SYS_LoginHistory')
              localStorage.removeItem('SYS_CheckAll')
              localStorage.removeItem('SYS_CheckedPass')
              localStorage.removeItem('isFirstIn')
              localStorage.removeItem('isHavePass')
            }

            this.centerDialogVisible = false
            this.$message({message: '下载成功，请安装', type: 'success'})

          }
        })

        this.$electron.ipcRenderer.on('updateDownloaded', () => {

          let result = removeToken()
          if (result) {
            localStorage.removeItem('SYS_LoginHistory')
            localStorage.removeItem('SYS_CheckAll')
            localStorage.removeItem('SYS_CheckedPass')
            localStorage.removeItem('isFirstIn')
            localStorage.removeItem('isHavePass')
          }

          this.$electron.ipcRenderer.send('isUpdateNow')
        })
      },
      getEventData() {
        eventBus.$on('selected', (value1, value2, value3) => {
          this.activeName = value1
          this.isMaximize = value2
          this.plateId = value3
          if (this.clientWidth <= 1366) {
            this.height = 540
          } else {
            this.height = 900
          }
          this.isShowFakeKLine = true
          this.isFullHotList = false
        })

        eventBus.$on('clickSelected', (value1, value2) => {
          this.isFullHotList = value2
          this.isShowFakeKLine = false
          this.isSwitchVisible = true
        })

        eventBus.$on('homeView', (value) => {
          this.activeName = 'USDT'
          this.isMaximize = value
          if (this.clientWidth <= 1366) {
            this.height = 180
          } else {
            this.height = 560
          }
          this.isFullHotList = false
          this.isShowFakeKLine = false
        })

        eventBus.$on('closeFakeKLine', value => {
          this.isShowFakeKLine = value
        })

        eventBus.$on('plateClassifyData', value => {
          this.plateClassifyData = value
        })

        eventBus.$on('changeSymbol', value => {
          // 移除组件
          this.isFullHotList = value
          // 在组件移除后，重新渲染组件
          // this.$nextTick可实现在DOM 状态更新后，执行传入的方法
          this.$nextTick(() => {
            this.isFullHotList = true
          })
        })

        eventBus.$on('userInformation', (value) => {
          this.isSysToken = null
          this.$nextTick(() => {
            this.isSysToken = value
          })
        })

        eventBus.$on('visibleChartsCard', (value) => {
          this.isSwitchVisible = false
          this.$nextTick(() => {
            this.isSwitchVisible = value
          })
        })
      },
      showWaring(warningInfo) {
        this.$notify({
          duration: 3000,
          type: 'warning',
          title: '雷达预警',
          message: warningInfo,
          position: 'bottom-right'
        })
      },
      handleClick(tab, event) {
        this.activeName = tab.label
        this.isSwitchVisible = false
        window.sessionStorage.setItem('CurrentSelectedPanel', this.activeName)

        for (let i = 0; i < this.plateClassifyData.length; i++) {
          if (this.activeName === this.plateClassifyData[i].plate_name) {
            this.plateId = this.plateClassifyData[i].id
          }
        }
      },
      fetchData() {
        getConfig({}).then(res => {
          console.log(res)
          this.configData = res.data
        })
      }
    },
    destroyed() {
      if (this.timeOutId) clearTimeout(this.timeOutId)
    }
  }
</script>
<style lang="scss" scoped>
  /** {*/
  /*  outline: 1px solid red;*/
  /*}*/

  /*夜间&白天，通用样式*/
  .home-main {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    margin-top: 2px;

    .left-aside {
      width: calc(100vw - 575px);
      height: calc(100vh - 120px);
      background-color: #F6F6F6;

      .main-title {
        font-size: 14px;
        font-weight: bold;
        padding: 14px 0 6px 10px;
      }
    }

    .right-aside {
      width: 575px;
      max-height: calc(100vh - 120px);

      overflow: hidden;
      display: flex;
      flex-direction: column;

      .swiper-panel {
        width: 100%;
        height: 300px;
        margin-top: 24px;
        margin-bottom: 10.5px;
      }
    }

    @media screen and (max-width: 1367px) { /*如果文档宽度小于 1367 像素则修改*/
      .left-aside {
        width: calc(100vw - 375px);
        height: calc(100vh - 120px);
      }
      .right-aside {
        max-width: 375px;
        max-height: calc(100vh - 120px);

        .swiper-panel {
          width: 100%;
          height: 140px;
          margin-top: 24px;
          margin-bottom: 51.97%;
        }
      }
    }
  }
</style>
