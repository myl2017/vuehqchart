<template>
  <section id="topBar">
    <ul class="topbar-wrapper">
      <li class="section-left">
        <div class="logo-container">
          <img src="../../../../assets/icons/common/logo.png" alt="">
          <span class="title icon-align">连币软件</span>
        </div>
        <ul class="menus">
          <li class="menu-item">
            <a class="level-one">
              <div class="title">系统(F)</div>
              <ol class="dropmenu">
                <li>
                  <a class="level-two" @click="onConnect">
                    <div class="subtitle">切换连接</div>
                  </a>
                </li>
                <li>
                  <a class="level-two" @click="onSystemSetting">
                    <div class="subtitle">系统设置</div>
                  </a>
                </li>
                <li>
                  <a class="level-two" @click="onLogout">
                    <div class="subtitle">退出登录</div>
                  </a>
                </li>
              </ol>
            </a>
          </li>
          <li class="menu-item">
            <a class="level-one">
              <div class="title">工具</div>
              <ol class="dropmenu">
                <li>
                  <a class="level-two" @click="onFormula">
                    <div class="subtitle">公式管理</div>
                  </a>
                </li>
                <li>
                  <a class="level-two">
                    <div class="subtitle plus-title">多窗口<img src="../../../../assets/icons/common/arrowright.png" alt=""/></div>
                    <ol class="subdropmenu">
                      <li>
                        <a class="level-three" @click="changeWindow(1)">
                          <div class="win-sel-wrap"><img src="../../../../assets/icons/common/win-sel.png" class="win-sel" v-show="selectedIndex === 1"/></div>
                          <div class="subtitle3">1个</div>
                        </a>
                      </li>
                      <li>
                        <a class="level-three" @click="changeWindow(2)">
                          <div class="win-sel-wrap"><img src="../../../../assets/icons/common/win-sel.png" class="win-sel" v-show="selectedIndex === 2"/></div>
                          <div class="subtitle3">2个</div>
                        </a>
                      </li>
                      <li>
                        <a class="level-three" @click="changeWindow(3)">
                          <div class="win-sel-wrap"><img src="../../../../assets/icons/common/win-sel.png" class="win-sel" v-show="selectedIndex === 3"/></div>
                          <div class="subtitle3">3个</div>
                        </a>
                      </li>
                      <li>
                        <a class="level-three" @click="changeWindow(4)">
                          <div class="win-sel-wrap"><img src="../../../../assets/icons/common/win-sel.png" class="win-sel" v-show="selectedIndex === 4"/></div>
                          <div class="subtitle3">4个</div>
                        </a>
                      </li>
                      <li>
                        <a class="level-three" @click="changeWindow(5)">
                          <div class="win-sel-wrap"><img src="../../../../assets/icons/common/win-sel.png" class="win-sel" v-show="selectedIndex === 5"/></div>
                          <div class="subtitle3">5个</div>
                        </a>
                      </li>
                    </ol>
                  </a>
                </li>
                <li>
                  <a class="level-two" @click="onScreen">
                    <div class="subtitle">截屏工具</div>
                  </a>
                </li>
                <li class="visibles">
                  <a class="level-two">
                    <div class="subtitle">隐藏菜单</div>
                  </a>
                </li>
                <li class="visibles">
                  <a class="level-two">
                    <div class="subtitle">隐藏菜单</div>
                  </a>
                </li>
              </ol>
            </a>
          </li>
          <li class="menu-item">
            <a class="level-one" @click="onShowRadar">
              <div>雷达预警</div>
            </a>
          </li>
          <li class="menu-item">
            <a class="level-one">
              <div class="title">帮助(H)</div>
              <ol class="dropmenu">
                <li>
                  <a class="level-two" @click="onHelp">
                    <div class="subtitle">帮助说明</div>
                  </a>
                </li>
                <li>
                  <a class="level-two" @click="openBrowser($event,path)">
                    <div class="subtitle">连币网站</div>
                  </a>
                </li>
                <li>
                  <a class="level-two" @click="oneclaration">
                    <div class="subtitle">服务协议</div>
                  </a>
                </li>
                <li>
                  <a class="level-two" @click="onPrivacy">
                    <div class="subtitle">隐私政策</div>
                  </a>
                </li>
                <li>
                  <a class="level-two" @click="onAbout">
                    <div class="subtitle">关于我们</div>
                  </a>
                </li>
              </ol>
            </a>
          </li>
        </ul>
      </li>
      <li class="section-right">
        <div class="assist">
          <img src="../../../../assets/icons/common/recommend.png" alt="" @click="onRecommend(configData.recommendations,$event)">
          <span class="recommend-text icon-align" @click="onRecommend(configData.recommendations,$event)">推荐给好友</span>
          <div class="speed-wrap" @click="onSpeed"><img src="../../../../assets/icons/common/speed.png" alt=""><span class="icon-align">极速开户</span></div>
          <div class="username" @click="onShowUser">{{userName}}</div>
        </div>
        <div class="button-wrap">
          <div class="toggle-theme icon-gap" @click="toggleTheme()"></div>
          <div class="min icon-gap" @click="onMinimize">
            <div class="min-inner"></div>
          </div>
          <div class="max sizes icon-gap" @click="onMaximize"></div>
          <div class="close sizes" @click="onClose"></div>
        </div>
      </li>
    </ul>

    <el-dialog :visible.sync="connectVisible" width="20%" :before-close="handleClose" class="custom-dialog connect-dialog">
      <el-form label-width="80px" :model="connectParams">
        <el-form-item label="连接:" class="connect-form-item">
          <el-select v-model="value" placeholder="请选择" style="width:12vw;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="connect-form-item-l">
          <el-button class="connect-button" type="primary" @click="connectVisible = false">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="系统设置" :visible.sync="sysSettingVisible" width="20%" :before-close="handleSysSettingClose"
               class="custom-dialog">
      <div class="min-dialog-inner">
        <strong>最小化设置</strong>
        <el-checkbox-group v-model="checked" class="custome-checkbox">
          <el-checkbox label="最小化时缩小到系统托盘"></el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button class="sysset-button" type="primary" @click="onSysSetting">确 定</el-button>
        </span>
      </div>
    </el-dialog>

    <PrivacyDialog v-if="privacyVisible"></PrivacyDialog>

    <HelpDialog v-if="helpVisible"></HelpDialog>

    <AboutDialog v-if="aboutVisible"></AboutDialog>

    <AgreementDialog v-if="agreementDialog"></AgreementDialog>

    <RecommendDialog v-if="recommendVisible"></RecommendDialog>

    <UserDialog v-if="userVisible"></UserDialog>

    <el-dialog title="提示" :visible.sync="logoutVisible" width="23.6%" class="custom-dialog">
      <span>确认要退出登录吗?</span>
      <span slot="footer" class="dialog-footer">
        <div style="padding-bottom: 14px;">
           <el-button @click="logoutVisible = false">取 消</el-button>
           <el-button type="primary" @click="confirmLogout">确 定</el-button>
        </div>
      </span>
    </el-dialog>

    <el-dialog title="雷达设置" :visible.sync="radarSetVisible" width="40%" :close-on-click-modal="false" class="custom-dialog radar-dialog">
      <el-table :data="warnList" border highlight-current-row @current-change="handleCurrentChange" class="radar-table" height="400">
        <el-table-column property="fullname" label="预警币种" width="150" align="center"></el-table-column>
        <el-table-column property="number" label="价格" width="150" align="center"></el-table-column>
        <el-table-column property="condition" label="预警条件" width="200" align="center">
          <template slot-scope="{row}">{{row.condition.replace('元','')}}</template>
        </el-table-column>
        <el-table-column label="预警方式" align="center">
          <template slot-scope="{row}">
            <template v-if="row.local_notice===1">本地预警、</template>
            <template v-if="row.wechat_notice===1">微信预警、</template>
            <template v-if="row.sms_notice===1">短信预警</template>
          </template>
        </el-table-column>
      </el-table>
      <section class="button-container">
        <el-button @click="onAdd">增加</el-button>
        <el-button @click="onDelete">删除</el-button>
        <el-button @click="onUpdate">修改</el-button>
        <el-button @click="radarSetVisible = false">确定</el-button>
      </section>
    </el-dialog>

    <el-dialog title="设置预警条件" :visible.sync="warnConditionVisible" width="40%" class="custom-dialog condition-dialog">
      <el-form :model="conditionForm" :rules="rules" ref="conditionForm" label-width="100px" class="condition-form">
        <el-form-item label="币种名称:" prop="code" class="condition-head">
          <el-autocomplete v-model="conditionForm.code" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect"
                           @blur="hanldeInput"></el-autocomplete>
        </el-form-item>
        <el-form-item class="condition-main">
          <el-col :span="11" class="left-aside">
            <ul class="condition-list">
              <li v-for="(item, index) in conditionAry" :key="item.label" @click="onSelectedItem(item, index+1)"
                  :class="{'active': item.label===selectedItem.label}">
                --00{{index+1}} {{item.label}}N{{item.unit}}
              </li>
            </ul>
          </el-col>
          <el-col :span="13" class="right-aside">
            <el-row>
              <div class="label-text filter">条件筛选：</div>
              <el-form-item :label="selectedItem.label" prop="number" class="price-item">
                <el-input v-model="conditionForm.number"></el-input>
                <!--                <span>{{selectedItem.unit}}</span>-->
                <span class="selected-unit">USD</span>
              </el-form-item>
            </el-row>
            <el-row>
              <div class="label-text local-wran">本地预警：</div>
              <el-form-item class="checkboxs">
                <el-checkbox v-model="conditionForm.local_notice">弹出窗口</el-checkbox>
              </el-form-item>
            </el-row>
            <el-row>
              <div class="label-text">云端预警：</div>
              <el-form-item class="checkboxs">
                <!-- <el-checkbox label="微信通知" v-model="conditionForm.wechat_notice"></el-checkbox> -->
                <!-- <el-checkbox label="短信通知" v-model="conditionForm.sms_notice"></el-checkbox> -->
                <el-checkbox label="微信通知" v-model="isChecked" @change="onCloudNotice"></el-checkbox>
                <el-checkbox label="短信通知" v-model="isChecked" @change="onCloudNotice"></el-checkbox>
              </el-form-item>
            </el-row>
          </el-col>
        </el-form-item>
        <el-form-item class="condition-foot">
          <div class="btn-con">
            <el-button v-if="!isEdit" @click="submitForm('conditionForm')" :disabled="isOk">确定</el-button>
            <el-button v-if="isEdit" @click="editForm('conditionForm')" :disabled="isOk">确定</el-button>
            <el-button @click="resetForm('conditionForm')">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="30%" class="custom-dialog">
      <span>{{warnText}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" v-if="warnText === '确认要删除该条预警'" @click="confirmDelete" :disabled="isOk">确 定</el-button>
        <el-button type="primary" v-else-if="warnText === '请先选中要修改预警'" @click="confirmVisible = false">确 定</el-button>
        <el-button type="primary" v-else @click="confirmVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </section>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import {toggleClass} from '@/utils'
  import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
  import eventBus from '@/utils/bus'
  import {getToken, removeToken} from '@/utils/auth'
  import $ from 'jquery'
  import AboutDialog from '../dialog/AboutDialog'
  import AgreementDialog from '../dialog/AgreementDialog'
  import HelpDialog from '../dialog/HelpDialog'
  import PrivacyDialog from '../dialog/PrivacyDialog'
  import RecommendDialog from '../dialog/RecommendDialog'
  import clip from '@/utils/clipboard' // use clipboard directly
  import clipboard from '@/directive/clipboard/index.js'
  import UserDialog from '../dialog/UserDialog' // use clipboard by v-directive
  import {getWarnList, getSearch, addWarn, deleteWarn, editWarn} from '@/api'
  import {getConfig} from '../../../../api/home'
  import {validateNumber} from '@/utils/validate'
  import {ScreenShot} from '../../../../lib/screenshot'
  import pako from 'pako'

  const {shell} = require('electron')

  export default {
    name: 'Topbar',
    directives: {
      clipboard
    },
    components: {UserDialog, PrivacyDialog, AgreementDialog, HelpDialog, RecommendDialog, AboutDialog},
    props: {
      chartType: {
        type: String
      },
      minuteChart: {
        type: Object
      },
      historyChart: {
        type: Object
      },
      userData: {
        type: Object
      }
    },
    data() {
      var validateCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('币种名称不能为空'))
        } else {
          callback()
        }
      }
      var validateNum = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('条件筛选不能为空'))
        } else if (!validateNumber(value)) {    //fix bug 790 xxc
          return callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }
      return {
        connectVisible: false,
        lockInfo: {
          token: null,
          id: null,
          lock: 0
        },
        options: [{
          value: '1',
          label: '南京电信（139.159.229.136）'
        }, {
          value: '2',
          label: '苏州电信（139.159.229.136）'
        }],
        value: '南京电信（139.159.229.136）',
        connectParams: {},
        sysSettingVisible: false,
        checked: false,
        aboutVisible: false,
        helpVisible: false,
        privacyVisible: false,
        agreementDialog: false,
        recommendVisible: false,
        userVisible: false,
        userName: null,
        logoutVisible: false,
        //socket
        WSUrl: 'ws://xhusdt.newbt.cn/',
        Socket: null,
        LastSubString: null, // 最后一个订阅的数据
        //雷达预警
        radarSetVisible: false,
        warnParams: {
          token: null
        },
        warnList: null,
        warnConditionVisible: false,
        path: 'https://www.lianbi.io',
        conditionForm: {
          token: null,
          code: null,
          market: null,
          condition: 1,
          number: null,
          local_notice: 0,
          wechat_notice: 0,
          sms_notice: 0
        },
        rules: {
          code: [
            {validator: validateCode, trigger: 'blur'}
          ],
          number: [
            {validator: validateNum, trigger: 'blur'}
          ]
        },
        searchParam: {
          token: null,
          keyword: '*'
        },
        allOption: [],
        timeout: null,
        conditionAry: [
          {label: '价格上破', unit: ''},
          {label: '价格下破', unit: ''},
          {label: '今日涨幅大于', unit: '%'},
          {label: '今日涨幅小于', unit: '%'}
        ],
        selectedItem: {label: '价格上破', unit: '元'},
        isOk: false,
        currentRow: null,
        conAry: ['价格上破N元', '价格下破N元', '今日涨幅大于N%', '今日涨幅小于N%'],
        warnText: null,
        confirmVisible: false,
        deleteParam: {
          token: null,
          id: null
        },
        isEdit: false,

        configData: {
          KF_tel: null,
          LB_switch: null,
          recommendations: null
        },
        versionInfo: {
          desc: null,
          version_number: null,
          link: null,
          is_force: null
        },
        isChecked: false,
        titles: '暂未开放，敬请期待！',
        selectedIndex: null,
        isFirstIn: null,
        inputData: {
          code: null,
          market: null,
          symbol: null,
          value: null
        }
      }
    },
    watch: {
      userName(newValue, oldValue) {
        // const user = localStorage.getItem('SYS_Token')
        // if (!user) { this.userName = '未登录' } else {
        //   this.userName = JSON.parse(user).userName
        // }
      },
      $route: { /*用watch监听当前路由*/
        handler(newRouter) {
          if (newRouter.path === '/hqdetail') {
            this.userName = this.userData.username
            if (this.userData) {
              this.warnParams.token = JSON.parse(localStorage.getItem('SYS_Token')).token
              this.fetchWarnData()
            }
          } else {
            if (sessionStorage.getItem('ForLogin')) { // '/'
              this.userName = this.userData.username
              if (localStorage.getItem('SYS_Token')) {
                this.warnParams.token = JSON.parse(localStorage.getItem('SYS_Token')).token
              }
            }
          }
        },
        immediate: true
      }
    },
    created() {
      this.fetchData()
      this.getEventData()

      ipcRenderer.on('dataFromChildWindow', (e, message) => {
        this.userName = JSON.parse(message).username
        sessionStorage.setItem('ForLogin', true)

        this.warnParams.token = JSON.parse(message).token
        this.fetchWarnData()

        eventBus.$emit('userInformation', JSON.parse(message))
        return false
      })

      if (localStorage.getItem('SYS_Token') && localStorage.getItem('SYS_CheckAll')) {    // 第一次且自动登录
        this.userName = JSON.parse(localStorage.getItem('SYS_Token')).username
        return
      }

      if (localStorage.getItem('isFirstIn') && !localStorage.getItem('SYS_CheckAll') && !localStorage.getItem('SYS_CheckedPass')) {
        // this.userName = null
        return
      }

      if (localStorage.getItem('SYS_Token') && !localStorage.getItem('SYS_CheckAll') && !localStorage.getItem('SYS_CheckedPass') && !localStorage.getItem('isFirstIn')) { // 第一次登录
        this.userName = JSON.parse(localStorage.getItem('SYS_Token')).username
        localStorage.setItem('isFirstIn', true)
        return
      }

      if (localStorage.getItem('isHavePass') && localStorage.getItem('SYS_CheckedPass')) { // 第一次登录记住密码
        this.userName = JSON.parse(localStorage.getItem('SYS_Token')).username
        localStorage.removeItem('isHavePass')
      }

      if (!localStorage.getItem('SYS_CheckAll') && localStorage.getItem('SYS_LoginHistory') && localStorage.getItem('SYS_CheckedPass')) { // 记住密码
        this.userName = null
        return
      }

      if (localStorage.getItem('SYS_Token') && localStorage.getItem('isFirstIn')) {        // 第一次且普通登录
        this.userName = JSON.parse(localStorage.getItem('SYS_Token')).username
        return
      }

      if (sessionStorage.getItem('ForLogin')) {
        this.userName = this.userData.username
      }
      // this.userName = this.userData.username
      ipcRenderer.on('loginInit', (e) => {
        //显示登陆界面时候，清楚用户名
        this.userName = null
        return false
      })
    },
    mounted() {
      if (!sessionStorage.getItem('TrayExist')) { // 当前系统没有默认添加系统托盘时处理
        if (localStorage.getItem('SYS_Tray')) {
          this.checked = Boolean(localStorage.getItem('SYS_Tray'))
          if (this.checked) {
            ipcRenderer.send('put-in-tray')
            sessionStorage.setItem('TrayExist', this.checked)
          }
        }
      }

      var obj = {SendData: {sub: 'overview'}}
      this.RequestWSData(obj)
    },
    methods: {
      fetchData() {
        getConfig({}).then(res => {
          console.log(res)
          this.configData = res.data
        })
      },
      toggleTheme() {
        this.$message('暂未开放，敬请期待！')
        // toggleClass(document.body, 'custom-theme') // 切换主题
      },
      onMinimize() {
        ipcRenderer.send('main-minimize')
      },
      onMaximize() {
        ipcRenderer.send('main-maximize')
      },
      onClose() {
        this.userName = null
        ipcRenderer.send('main-close')
      },
      onConnect() {
        this.connectVisible = true
      },
      handleClose() {
        this.connectVisible = false
      },
      onSystemSetting() {
        this.sysSettingVisible = true
      },
      handleSysSettingClose() {
        this.sysSettingVisible = false
        ipcRenderer.send('remove-tray')
      },
      onLogout() {
        this.logoutVisible = true
      },
      onScreen() {
        ScreenShot()
      },
      openBrowser(e, href) {

        e.preventDefault()         // 阻止窗口打开的默认事件
        shell.openExternal(href)   // 通过url在浏览器打开
      },
      confirmLogout() {
        this.logoutVisible = false
        let result = removeToken()

        if (result) {
          localStorage.removeItem('SYS_LoginHistory')
          localStorage.removeItem('SYS_CheckAll')
          localStorage.removeItem('SYS_CheckedPass')
          localStorage.removeItem('isFirstIn')
          localStorage.removeItem('isHavePass')

          this.userName = null
          ipcRenderer.send('main-exit')
        }
      },
      onFormula() {
        if ($('#kLine3 [identify="0"] .index_change')[0]) {
          $('#kLine3 [identify="0"] .index_change')[0].click()
          eventBus.$emit('toggleFormula', true)
          return
        }

        if ($('#fakekLine [identify="0"] .index_change')[0]) {
          $('#fakekLine [identify="0"] .index_change')[0].click()
          eventBus.$emit('toggleFormula', true)
          return
        }

        if ($('#leftKLine [identify="0"] .index_change')[0]) {
          $('#leftKLine [identify="0"] .index_change')[0].click()
          eventBus.$emit('toggleFormula', true)
          return
        }

        if (this.chartType === 'minute') {
          if ($('#minuteChartID [identify="2"] .index_change')[0]) {
            $('#minuteChartID [identify="2"] .index_change')[0].click()
            eventBus.$emit('toggleFormula', true)
          }
        } else if (this.chartType === 'history') {
          if ($('#kLine [identify="0"] .index_change')[0]) {
            $('#kLine [identify="0"] .index_change')[0].click()
            eventBus.$emit('toggleFormula', true)
          }
        }
      },
      changeWindow(number) {
        this.selectedIndex = number
        if (this.chartType === 'history') {
          this.historyChart.ChangeIndexWindowCount(number)
        } else if (this.chartType === 'minute') {
          this.minuteChart.ChangeIndexWindowCount(number + 1)
        }
        window.localStorage.setItem('WindowIndexCounts', number)
      },
      getEventData() {
        eventBus.$on('closeAbout', () => {
          this.aboutVisible = false
        })
        eventBus.$on('closeHelp', () => {
          this.helpVisible = false
        })
        eventBus.$on('closePrivacy', () => {
          this.privacyVisible = false
        })

        eventBus.$on('closeRecommend', () => {
          this.recommendVisible = false
        })

        eventBus.$on('closeUser', () => {
          this.userVisible = false
        })

        eventBus.$on('closeFakeKLine', () => {
          this.userName = this.userData.username
        })

      },
      onPrivacy() {
        this.privacyVisible = true
      },
      onHelp() {
        this.helpVisible = true
      },
      onAbout() {
        this.aboutVisible = true
      },
      oneclaration() {
        this.agreementDialog = true
      },
      onRecommend(text, event) {
        clip(text, event)
        this.recommendVisible = true
      },
      onSpeed() {
        this.$message('暂未开放，敬请期待！')
      },
      onShowUser() {
        this.userVisible = true
      },
      onSysSetting() {
        if (localStorage.getItem('SYS_Tray')) {
          this.sysSettingVisible = false
          return
        }

        if (this.checked) {
          ipcRenderer.send('put-in-tray')
        } else {
          ipcRenderer.send('remove-tray')
        }
        localStorage.setItem('SYS_Tray', this.checked)
        sessionStorage.setItem('TrayExist', this.checked)
        this.sysSettingVisible = false
      },
      onLock(params) {
        editWarn(params).then(res => {
          if (res.code === 0) {
          }
        })
      },
      onShowRadar() {
        this.radarSetVisible = true
        this.warnParams.token = JSON.parse(localStorage.getItem('SYS_Token')).token
        this.fetchWarnData()
      },
      fetchWarnData() {
        getWarnList(this.warnParams).then(res => {
          this.warnList = res.data && res.data.map(item => {
            item.fullname = item.code + '/' + item.market
            return item
          })
          this.currentRow = null
          this.deleteParam.token = null
          this.deleteParam.id = null
          // window.sessionStorage.setItem('CurrentWarnList',this.warnList)  //add xxc
        })
      },
      onAdd() {
        this.isEdit = false
        this.warnConditionVisible = true

        this.selectedItem = {label: '价格上破', unit: '元'}
        this.conditionForm.condition = 1
        this.conditionForm.token = getToken()
        this.searchParam.token = getToken()

        this.conditionForm.number = null
        this.conditionForm.code = null
        this.conditionForm.local_notice = 0
        this.conditionForm.wechat_notice = 0
        this.conditionForm.sms_notice = 0
        this.loadAll()
      },
      loadAll() {
        this.allOption = []
        getSearch(this.searchParam).then(res => {
          res.data && res.data.forEach(item => {
            let objItem = {code: item.code, market: item.market, symbol: item.symbol, value: item.display_name}
            this.allOption.push(objItem)
          })
        })
      },
      querySearchAsync(queryString, cb) {
        var restaurants = this.allOption
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 3000 * Math.random())
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect(item) {
        this.conditionForm.code = item.code
        this.conditionForm.market = item.market
      },
      hanldeInput(item) {
        let restaurants = this.allOption
        let result = restaurants.filter(this.createStateFilter(item.target.value))

        this.inputData = result[0]
      },
      onSelectedItem(item, index) {
        this.selectedItem = item
        this.conditionForm.condition = index
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!this.conditionForm.market) {
              this.conditionForm.code = this.inputData.code
              this.conditionForm.market = this.inputData.market
            }
            this.handlerChecked(this.conditionForm)
            this.isOk = true
            addWarn(this.conditionForm).then(res => {
              if (res.code === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
              } else {
                this.$message.error(res.msg)
              }
              this.isOk = false
              this.warnConditionVisible = false
              this.$refs[formName].resetFields()
              this.fetchWarnData()
            }).catch(e => {
              this.$message.error('添加预警失败')
            })
          } else {
            return false
          }
        })
      },
      handlerChecked() {
        this.conditionForm.local_notice = this.conditionForm.local_notice === true ? 1 : 0
        // this.conditionForm.wechat_notice = this.conditionForm.wechat_notice === true ? 1 : 0
        // this.conditionForm.sms_notice = this.conditionForm.sms_notice === true ? 1 : 0
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.warnConditionVisible = false
      },
      handleCurrentChange(val) {
        if (val) {
          this.currentRow = val
          this.deleteParam.id = val.id
        }
      },
      onDelete() {
        if (!this.deleteParam.id) {
          this.warnText = '请先选中要删除预警'
        } else {
          this.warnText = '确认要删除该条预警'
        }
        this.confirmVisible = true
      },
      confirmDelete() {
        this.deleteParam.token = getToken()
        this.isOk = true
        deleteWarn(this.deleteParam).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.isOk = false
          this.confirmVisible = false
          this.fetchWarnData()
        }).catch(e => {
          this.$message.error(e.text)
        })
      },
      onUpdate() {
        if (!this.currentRow) {
          this.warnText = '请先选中要修改预警'
          this.confirmVisible = true
          return
        } else {
          this.isEdit = true
          this.warnConditionVisible = true
          this.conditionForm.token = getToken()
          this.conditionForm.code = this.currentRow.code
          this.conditionForm.market = this.currentRow.market

          this.conditionForm.condition = this.handlerConAry()
          this.conditionForm.number = Number(this.currentRow.number)
          this.conditionForm.local_notice = this.currentRow.local_notice === 1 ? true : false
          // this.conditionForm.wechat_notice = this.currentRow.wechat_notice === 1 ? true : false
          // this.conditionForm.sms_notice = this.currentRow.sms_notice === 1 ? true : false
          this.selectedItem = this.conditionAry[this.conditionForm.condition - 1]

          this.searchParam.token = getToken()
          this.loadAll()
        }
      },
      handlerConAry() {
        let condition = 0
        for (let i = 0; i < this.conAry.length; i++) {
          if (this.conAry[i] === this.currentRow.condition) {
            condition = i + 1
          }
        }
        console.log('handlerConAry::: ', condition)
        return condition
      },
      editForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handlerChecked(this.conditionForm)
            let params = this.conditionForm
            params.id = this.currentRow.id
            this.isOk = true
            editWarn(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
              } else {
                this.$message.error(res.msg)
              }

              this.isOk = false
              this.warnConditionVisible = false
              this.isEdit = false
              this.fetchWarnData()
              let tId = setTimeout(() => {
                this.$refs[formName].resetFields()
                clearTimeout(tId)
              }, 1000)
            }).catch(e => {
              this.$message.error('编辑预警失败')
            })
          } else {
            return false
          }
        })
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
        }
      },

      RecvOverviewRealtimeData(recvData) {
        let objData = recvData.data
        this.warnList = this.warnList && this.warnList.filter((item) => {
          let objKey = item.code.toLowerCase() + item.market.toLowerCase()
          let recvItem = objData[`${objKey}`]
          if (!recvItem) {

          } else {
            if (item.local_notice == '1') {
              let condition = item.condition
              this.lockInfo.id = item.id
              this.lockInfo.token = getToken()

              switch (item.condition) {
                case this.conAry[0]:
                  if (recvItem.close > item.number) {
                    if (item.lock === 0) {
                      condition = condition.replace('N', item.number)
                      condition = condition.replace('元', 'USD')
                      eventBus.$emit('show-waring', objKey, condition)
                      item.lock = 1
                      this.lockInfo.lock = 1
                      this.onLock(this.lockInfo)
                    }
                  } else if (item.lock !== 0) {
                    //突破后，有下降，修改状态
                    item.lock = 0
                    this.lockInfo.lock = 0
                    this.onLock(this.lockInfo)
                  }
                  break
                case this.conAry[1]:
                  if (recvItem.close < item.number) {
                    if (item.lock === 0) {
                      condition = condition.replace('N', item.number)
                      condition = condition.replace('元', 'USD')
                      eventBus.$emit('show-waring', objKey, condition)
                      item.lock = 1
                      this.lockInfo.lock = 1
                      this.onLock(this.lockInfo)
                    }
                  } else if (item.lock !== 0) {
                    item.lock = 0
                    this.lockInfo.lock = 0
                    this.onLock(this.lockInfo)
                  }
                  break
                case this.conAry[2]:
                  if (recvItem.rate > item.number) {
                    if (item.lock === 0) {
                      condition = condition.replace('N', item.number)
                      condition = condition.replace('元', 'USD')
                      eventBus.$emit('show-waring', objKey, condition)
                      item.lock = 1
                      this.lockInfo.lock = 1
                      this.onLock(this.lockInfo)
                    }
                  } else if (item.lock !== 0) {
                    item.lock = 0
                    this.lockInfo.lock = 0
                    this.onLock(this.lockInfo)
                  }
                  break
                case this.conAry[3]:
                  if (recvItem.rate < item.number) {
                    if (item.lock === 0) {
                      condition = condition.replace('N', item.number)
                      condition = condition.replace('元', 'USD')
                      eventBus.$emit('show-waring', objKey, condition)
                      item.lock = 1
                      this.lockInfo.lock = 1
                      this.onLock(this.lockInfo)
                    }
                  } else if (item.lock !== 0) {
                    item.lock = 0
                    this.lockInfo.lock = 0
                    this.onLock(this.lockInfo)
                  }
                  break
                default:
              }
            }
          }
          return item
        })
      },
      onCloudNotice() {
        this.isChecked = false
        this.$message('暂未开放，敬请期待！')
      }
    }
  }
</script>

<style lang="scss">
  .connect-dialog {
    .connect-form-item {
      .el-input--suffix .el-input__inner {
        padding-right: 0 !important;
      }
    }
  }

  .radar-dialog {
    .el-dialog__body {
      padding: 0;

      .radar-table {
        th, tr, td {
          cursor: pointer;
          padding: 0 !important;
          height: 32px;
          overflow: hidden;
        }

        th, tr, td, th.is-leaf {
          color: #333333 !important;
          font-size: $fontSize14;
          white-space: nowrap !important;
        }

        &::before {
          height: 0;
        }

        &::after {
          width: 0;
        }

        .el-table__fixed:before {
          height: 0;
        }
      }

      .button-container {
        background-color: #DDDDDD;
        padding-top: 12px;
        padding-bottom: 11px;
        display: flex;
        justify-content: flex-end;
        border-radius: 0 0 10px 10px;

        > .el-button {
          width: $buttonWidthSmall;
          height: 26px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          color: #333;
          font-size: $fontSize14;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          border: 0;
          margin-right: 12px;
        }

        button:last-child {
          background-color: #1C8FD0;
          color: #fff;
        }
      }
    }
  }

  .condition-dialog {
    .el-dialog__body {
      padding: 0 !important;

      .condition-form {
        .el-form-item {
          margin-bottom: 0 !important;
        }
      }

      .condition-head {
        background-color: #ECECEC;

        > label {
          color: #EE0000;
        }

        input {
          width: 259px;
          height: 32px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: none;
          font-size: $fontSize14;
          padding: 0 8px;
        }
      }

      .condition-main {
        .left-aside {
          padding-top: 20px;

          .condition-list {
            font-size: $fontSize14;
            color: #333333;

            > li {
              padding-left: 20px;

              &.active {
                background-color: #FFF5E7;
              }
            }
          }
        }

        .right-aside {
          height: 100%;
          border-left: 1px solid #ddd;
          padding: 4px 30px 30px 20px;

          .label-text {
            width: 90px;
            height: 25px;
            font-size: $fontSize14;
            line-height: 14px;
            color: #333333;
            white-space: nowrap;
          }

          .filter {
            margin-top: 7px;
            margin-bottom: 11px;
          }

          .selected-unit {
            white-space: nowrap;
          }

          .price-item {
            background-color: #F6F6F6;
            display: flex;
            padding: 0 0 109px 14px;

            .el-form-item__content {
              display: flex;
            }

            .el-input__inner {
              width: 100px;
              height: 30px;
              background: rgba(255, 255, 255, 1);
              border-radius: 4px;
              border: none;
              margin-right: 9px;
            }
          }

          .el-form-item {
            .el-form-item__label {
              height: 20px;
              font-size: $fontSize14;
              color: rgba(51, 51, 51, 1);
            }
          }

          .local-wran {
            margin-top: 13px;
          }

          .checkboxs {
            margin-left: 80px;
          }
        }

        .el-form-item__content {
          margin-left: 0 !important;
        }
      }

      .condition-foot {
        background-color: #DDDDDD;
        padding: 12px 20px 11px 20px;
        border-radius: 0 0 10px 10px;

        .el-form-item__content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-left: 0 !important;

          button {
            width: $buttonWidthSmall;
            height: 32px;
            background: rgba(28, 143, 208, 1);
            border-radius: 4px;
            padding: 0 !important;
            font-size: $fontSize14;
            color: #fff;
          }

          .btn-con {
            flex-grow: 1;
            text-align: right;

            > button:last-child {
              background-color: #fff;
              color: #999;
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .custom-theme {
    li.section-right {
      .button-wrap {
        .toggle-theme {
          background: url("../../../../assets/icons/black/theme.png") no-repeat !important;
        }

        .min {
          .min-inner {
            background: url("../../../../assets/icons/black/minimize.png") no-repeat !important;
          }
        }

        .max {
          background: url("../../../../assets/icons/black/maximize.png") no-repeat !important;
        }

        .close {
          background: url("../../../../assets/icons/black/close.png") no-repeat !important;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  /** { outline: 1px solid red;}*/
  .topbar-wrapper {
    width: 100%;
    height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 20px 4px 20px;

    li.section-left {
      display: flex;
      align-items: center;

      .logo-container {
        display: flex;
        align-items: center;

        > img {
          width: 18px;
          height: 18px;
          margin-right: 13px;
        }

        > span {
          min-width: 108px;
          font-size: $fontSize14;
          font-weight: bold;
        }

        margin-right: 102px;
      }

      .menus {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        > li.menu-item {
          font-size: $fontSize14;
          white-space: nowrap;
          margin-right: 40px;
          position: relative;
          height: 24px;

          a.level-one {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            padding-left: 8px;
            padding-right: 8px;

            div.title {
              white-space: nowrap;
            }

            ol.dropmenu {
              display: none;
              position: absolute;
              top: 100%;
              left: 0;
              z-index: 100;

              > li {
                font-size: $fontSize14;
                font-weight: 400;
                color: #333333;
                white-space: nowrap;
                background: #fff;

                a.level-two {
                  display: flex;

                  div.subtitle {
                    padding: 8px 28px 8px 20px;
                  }

                  div.plus-title {
                    padding-left: 20px;
                    padding-right: 0px;

                    > img {
                      margin-left: 22px;
                    }
                  }

                  ol.subdropmenu {
                    display: none;
                    position: absolute;
                    top: 25%;
                    left: 100%;
                    background: #fff;

                    > li {
                      font-size: $fontSize14;
                      font-weight: 400;
                      color: #333333;
                      white-space: nowrap;

                      a.level-three {
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .win-sel-wrap {
                          width: 24px;

                          .win-sel {
                            width: 18px;
                            height: 18px;
                            margin-left: 6px;
                          }
                        }

                        div.subtitle3 {
                          padding: 8px 28px 8px 4px;
                        }
                      }

                      a.level-three:hover {
                        background: #FFEEE1;
                      }
                    }
                  }

                }

                a.level-two:hover {
                  background: #FFEEE1;

                  ol.subdropmenu {
                    display: flex;
                    flex-direction: column;
                  }
                }
              }

              > li.visibles {
                visibility: hidden;
                background: none;
              }
            }
          }

          a.level-one:hover {
            background: #F66C00;
            color: #FFFFFF;

            ol.dropmenu {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
          }
        }

        .menu-item.active {
          color: #F66C00;
        }
      }
    }

    li.section-right {
      display: flex;
      align-items: center;

      .assist {
        display: flex;
        align-items: center;

        > img {
          width: 19px;
          height: 19px;
          margin-right: 9px;
        }

        .recommend-text {
          font-size: $fontSize14;
          margin-right: 30px;
        }

        .speed-wrap {
          padding: 2px 4px;
          border: #F66C00;
          border-radius: 5px;
          display: flex;
          align-items: center;
          border: 1px solid #F66C00;

          > img {
            width: 11px;
            height: 14px;
            margin-right: 4px;
          }

          > span {
            font-size: $fontSize13;
            color: #F66C00;
          }
        }

        .username {
          font-size: $fontSize14;
          margin-left: 40px;
        }
      }

      .button-wrap {
        display: flex;
        align-items: center;
        margin-left: 76px;

        .icon-gap {
          margin-right: 15px;
        }

        > div {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .toggle-theme {
          width: 25px;
          height: 21px;
          background: url("../../../../assets/icons/white/themehei.png") no-repeat;
          background-size: 100% 100%;
        }

        .min {
          width: 18px;
          height: 18px;
          display: inline-flex;
          justify-content: center;
          align-items: center;

          .min-inner {
            width: 18px;
            height: 2px;
            background: url("../../../../assets/icons/white/minhei.png") no-repeat;
            background-size: 100% 100%;
          }
        }

        .max {
          width: 18px;
          height: 18px;
          background: url("../../../../assets/icons/white/maxhei.png") no-repeat;
          background-size: 100% 100%;
        }

        .close {
          width: 18px;
          height: 18px;
          background: url("../../../../assets/icons/white/closehei.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }

    .icon-align {
      margin-bottom: -2px;
    }
  }

  .custom-dialog {
    .connect-form-item-l {
      margin-top: 24px;
      margin-bottom: 0px !important;
      padding-bottom: 16px;
    }

    .connect-button {
      width: $buttonWidth;
      height: 40px;
      background: rgba(0, 136, 255, 1);
      border-radius: 5px;
      font-size: $fontSize14;
      margin-left: 32px;
    }
  }

  .min-dialog-inner {
    text-align: center;

    > strong {
      font-size: $fontSize14;
    }

    .custome-checkbox {
      margin-top: 8px;
      margin-bottom: 20px;
    }

    .sysset-button {
      width: $buttonWidth;
      height: 40px;
      background: rgba(0, 136, 255, 1);
      border-radius: 5px;
      font-size: $fontSize14;
    }
  }
</style>
