<template>
  <div class="login-wrapper">
    <header>
      <div class="tools">
        <img src="../../assets/icons/close.png" alt="" @click="handleClose"/>
      </div>
    </header>
    <section class="theme">
      <span>请登录</span>
    </section>
    <section class="main">
      <div class="left-side">
        <el-form :label-position="labelPosition" label-width="84px" :model="loginParams">
          <el-form-item label="连接:">
            <el-select v-model="currentHost" placeholder="请选择">
              <el-option
                v-for="item in hostList"
                :key="item.id"
                :label="item.ip"
                :value="item.host">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号:">
            <el-input type="text" v-model="loginParams.account" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码:" class="groups">
            <el-input type="password" v-model="loginParams.password" autocomplete="off"></el-input>
            <a href="javascript:;" class="retrieve-password" @click="onRetrievePass">找回密码</a>
          </el-form-item>
          <el-form-item class="groups">
            <div class="check-collect">
              <el-checkbox label="自动登录" name="checkbox" v-model="autoLoginChecked" @change="handleCheckAllChange"></el-checkbox>
              <el-checkbox label="记住密码" name="checkbox1" v-model="passwordChecked"></el-checkbox>
            </div>
          </el-form-item>
          <el-form-item class="login-button">
            <el-button type="primary" @click="onLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="vertical-line"></div>
      <ul class="right-side">
        <li>
          <img src="../../assets/icons/userserve.png" alt="">
          <span class="telno">客服电话: 025-1234567</span>
        </li>
        <li>
          <a href="javascript:;">还没账号?</a>
          <button class="now-register" @click="onRegister">立即注册</button>
        </li>
        <li>
          <div>其他登录方式</div>
          <div class="other-way">
            <img src="../../assets/icons/qq.png" alt="" @click="onMsg">
            <img src="../../assets/icons/wx.png" alt="" @click="onMsg">
          </div>
        </li>
      </ul>
    </section>

    <el-dialog title="提示" :visible.sync="dialogVisible" :modal="isMask" width="50%" class="custom-dialog">
      <span>是否确定要强制退出该应用?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmExit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import {getHostList, login} from '../../api/login'

  export default {
    name: 'index',
    data() {
      return {
        labelPosition: 'right',
        hostList: null,
        currentHost: '192.168.1.3',
        loginParams: {
          account: null,
          password: null
        },
        checkAll: ['自动登录', '记住密码'],
        autoLoginChecked: false,
        passwordChecked: false,
        userData: null,
        dialogVisible: false,
        isMask: false
      }
    },
    created() {
      this.initLogin()
      this.fetchData()
    },
    mounted() {
      ipcRenderer.send('loginInit')
    },
    methods: {
      initLogin() {
        const strLoginHistory = localStorage.getItem('SYS_LoginHistory')
        const strCheckedPass = localStorage.getItem('SYS_CheckedPass')
        if (strLoginHistory && strCheckedPass) {
          this.loginParams.account = JSON.parse(strLoginHistory).account
          this.loginParams.password = JSON.parse(strLoginHistory).password
          this.passwordChecked = true
        }
      },
      fetchData() {
        getHostList({}).then(res => {
          this.hostList = res.data
          if (this.hostList && this.hostList.length <= 0) {

          } else {
            this.currentHost = this.hostList[0].ip
          }
        })
      },
      handleClose() {
        this.dialogVisible = true
      },
      confirmExit() {
        ipcRenderer.send('force-exit')
      },
      handleCheckAllChange(val) {
        if (val) {
          this.passwordChecked = true
        } else {
          this.passwordChecked = false
        }
      },
      onLogin() {
        if (!this.loginParams.account)    //fix bug 770
        {
          this.$message.error({message: '请输入帐号'})
          return
        }
        if (!this.loginParams.password) {
          this.$message.error({message: '请输入密码'})
          return
        }

        login(this.loginParams).then(res => {

          if (res.code === 0) { // 登录成功
            this.$message({
              message: res.msg,
              type: 'success'
            })

            if (this.autoLoginChecked && this.passwordChecked) { // 自动登录&记住密码
              if (localStorage.getItem('SYS_CheckedPass') !== null) {
                localStorage.removeItem('SYS_CheckedPass')
              }

              localStorage.setItem('SYS_LoginHistory', JSON.stringify(this.loginParams))
              localStorage.setItem('SYS_CheckAll', JSON.stringify(this.checkAll))
            }

            if (this.passwordChecked && !this.autoLoginChecked) {
              localStorage.setItem('SYS_LoginHistory', JSON.stringify(this.loginParams))
              localStorage.setItem('SYS_CheckedPass', JSON.stringify(this.passwordChecked))
            }

            if (!this.passwordChecked && !this.autoLoginChecked) {
              if (localStorage.getItem('SYS_CheckedPass') !== null) {
                localStorage.removeItem('SYS_CheckedPass')
              }

              if (localStorage.getItem('SYS_CheckAll') !== null) {
                localStorage.removeItem('SYS_CheckAll')
              }

              localStorage.removeItem('SYS_LoginHistory')
            }

            // 子窗口与父窗口之间 消息通信
            if (!localStorage.getItem('SYS_CheckAll') && !localStorage.getItem('SYS_CheckedPass') && !localStorage.getItem('SYS_Token')) { // 第一次登录
              localStorage.setItem('SYS_Token', JSON.stringify(res.data))
              ipcRenderer.send('close', JSON.stringify(res.data)) // 刷新主窗口
              return
            }

            if (!localStorage.getItem('SYS_CheckAll') && !localStorage.getItem('SYS_CheckedPass') && localStorage.getItem('SYS_Token')) { // 不是第一次登录
              localStorage.setItem('SYS_Token', JSON.stringify(res.data))
              ipcRenderer.send('close', JSON.stringify(res.data))
              return
            }

            if (localStorage.getItem('SYS_CheckAll') && !localStorage.getItem('SYS_Token')) { // 自动登录 是第一次登录
              localStorage.setItem('SYS_Token', JSON.stringify(res.data))
              ipcRenderer.send('close', JSON.stringify(res.data)) // 刷新主窗口
              return
            }

            if (localStorage.getItem('SYS_CheckAll') && localStorage.getItem('SYS_Token')) { // 自动登录 不是第一次登录
              localStorage.setItem('SYS_Token', JSON.stringify(res.data))
              ipcRenderer.send('close', JSON.stringify(res.data))
              return
            }

            if (localStorage.getItem('SYS_CheckedPass') && !localStorage.getItem('SYS_Token')) {// 记住密码 是第一次登录
              localStorage.setItem('SYS_Token', JSON.stringify(res.data))
              localStorage.setItem('isHavePass', true)
              ipcRenderer.send('close', JSON.stringify(res.data)) // 刷新主窗口
              return
            }

            if (localStorage.getItem('SYS_CheckedPass') && localStorage.getItem('SYS_Token')) {// 记住密码 不是第一次登录
              localStorage.setItem('SYS_Token', JSON.stringify(res.data))
              ipcRenderer.send('close', JSON.stringify(res.data))
              return
            }
          } else {
            this.$message.error(res.msg)
          }
        })

      },
      onRetrievePass() {
        this.$router.push({path: 'retrievepwd'})
      },
      onRegister() {
        this.$router.push({path: 'register'})
      },
      onMsg() {
        this.$message('暂未开放，敬请期待！')
      }
    }
  }
</script>

<style lang="scss">
  .login-wrapper {
    .main {
      .left-side {
        .el-form {
          .el-form-item {
            margin-bottom: 16px;

            .el-form-item__content {
              display: flex !important;

              .el-select {
                .el-input.el-input--suffix {
                  width: 274.31px !important;
                }
              }

              .el-input {
                width: 274.31px !important;
              }

              > a {
                padding-left: 10px;
                padding-right: 24px;
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 400;
                color: rgba(0, 136, 255, 1);
                white-space: nowrap;
              }

              > button {
                width: 274px;
                height: 50px;
                background: rgba(0, 136, 255, 1);
                border-radius: 5px;
                font-size: 18px;
                font-family: PingFang SC;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
              }

              .el-checkbox {
                color: #999999;
                font-size: 14px;
              }

              .el-select {
                width: 100%;
              }
            }

            .el-form-item__label {
              font-size: 18px;
              color: #333333;
            }
          }

          .groups {
            margin-bottom: 0;

            .check-collect {
              padding-bottom: 2px;
            }
          }

          /*.login-button {*/
          /*  margin-bottom: 41px;*/
          /*}*/
        }
      }
    }

    .custom-dialog {
      .el-dialog {
        border-radius: 10px;
      }

      .el-dialog__title {
        font-size: $fontSize16 !important;
      }

      .el-dialog__header {
        height: $dialogHeadHigh;
        padding: 0 14px !important;
        background: #DCDCDC !important;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        display: flex;
        align-items: center;

        .el-dialog__headerbtn {
          top: 10px;
        }
      }

      .el-button {
        width: 72px;
        height: 32px;
        border-radius: 5px;
        font-size: 14px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }

    }
  }

</style>

<style lang="scss" scoped>
  /** {*/
  /*  outline: 1px solid red;*/
  /*}*/

  .login-wrapper {
    width: 736px;
    background-color: #fff;
    box-shadow: 0px 3px 6px rgba(10, 107, 151, 0.16);
    border-radius: 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      vertical-align: middle;
    }


    header {
      width: 100%;
      height: 180px;
      background: #0073FF url("../../assets/icons/login-head-bg.png") no-repeat;
      background-size: cover;
      background-position: 0;
      border-radius: 20px 20px 0 0;
      position: relative;

      > .tools {
        position: absolute;
        top: 17px;
        right: 19px;

        > img {
          width: 18px;
          height: 18px;
          margin-left: 21px;
        }
      }
    }

    .theme {
      width: 100%;
      height: 46px;
      background: rgba(226, 244, 255, 1);
      box-shadow: 0px 3px 6px rgba(31, 142, 200, 0.16);
      opacity: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        width: 60px;
        height: 28px;
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(28, 143, 208, 1);
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }
    }

    .main {
      background: #fff;
      display: flex;
      justify-content: space-between;
      border-radius: 0 0 20px 20px;
      margin-top: 16px;
      padding-top: 4px;
      padding-bottom: 24px;

      .left-side {
        width: 62%;
      }

      .vertical-line {
        width: 0;
        height: 198px;
        border-right: 1px solid rgba(184, 223, 250, 1);
        margin-top: 20px;
      }

      .right-side {
        flex-grow: 1;
        display: flex;
        align-items: center;
        flex-direction: column;

        li:first-child {
          img {
            width: 23px;
            height: 23px;
            margin-right: 9px;
          }

          span {
            width: 162px;
            height: 20px;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 20px;
            color: rgba(51, 51, 51, 1);
          }
        }

        li:nth-child(2) {
          padding-top: 33px;
          padding-bottom: 38px;
          display: flex;
          flex-direction: column;
          align-items: center;

          a {
            display: flex;
            width: 80px;
            height: 22px;
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 22px;
            color: rgba(7, 111, 253, 1);
          }

          .now-register {
            width: 120px;
            height: 36px;
            border: .1px solid rgba(220, 100, 5, 1);
            border-radius: 5px;
            background: #fff;
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(220, 100, 5, 1);
            margin-top: 8px;
          }
        }

        li:nth-child(3) {
          div:first-child {
            width: 96px;
            height: 22px;
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 22px;
            color: rgba(153, 153, 153, 1);
            margin-bottom: 20px;
            margin-left: auto;
            margin-right: auto;
          }

          .other-way {
            display: flex;
            align-items: center;

            img:first-child {
              width: 38px;
              height: 45px;
            }

            img:nth-child(2) {
              width: 43px;
              height: 43px;
              margin-left: 51px;
            }
          }
        }
      }
    }
  }
</style>
