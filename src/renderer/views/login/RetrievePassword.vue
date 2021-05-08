<template>
  <div class="retrieve-pwd-wrapper">
    <section class="retrieve-bar">
      <div class="title">找回密码</div>
      <div class="tools">
        <img src="../../assets/icons/close.png" alt="" @click="handleClose"/>
      </div>
    </section>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
      <el-form-item label="手机号：" prop="phone">
        <el-input type="tel" v-model="ruleForm.phone" autocomplete="off" clearable></el-input>
        <span></span>
      </el-form-item>
      <el-form-item label="验证码：" prop="code">
        <el-input v-model.number="ruleForm.code" autocomplete="off" clearable></el-input>
        <el-button class="verif-code" @click="handleSMS">{{buttonContent}}</el-button>
      </el-form-item>
      <el-form-item label="新密码：" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off" clearable placeholder="请输入6-16个字母、数字的组合"></el-input>
        <span></span>
      </el-form-item>
      <el-form-item label="确认密码：" prop="confirmPass">
        <el-input type="password" v-model="ruleForm.confirmPass" autocomplete="off" clearable></el-input>
        <span></span>
      </el-form-item>
      <el-form-item>
        <el-button class="register-button" @click="submitForm('ruleForm')" :disabled="isOk">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import {validatePassword, validatePhoneNumber} from '../../utils/validate'
  import {getSMSVerificaCode, retrievePass} from '../../api/login'

  export default {
    name: 'RetrievePassword',
    data() {
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号码'))
        } else {
          if (!validatePhoneNumber(value)) {
            callback(new Error('请输入正确手机号码'))
          } else {
            callback()
          }
        }
      }
      var checkCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('验证码不能为空'))
        } else if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          callback()
        }
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (!validatePassword(value)) {
            callback(new Error('请输入6-16个字母、数字的组合'))
          } else {
            callback()
          }
        }
      }
      var validConfirmPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          phone: '',
          code: '',
          password: '',
          confirmPass: ''
        },
        rules: {
          phone: [
            {validator: validatePhone, trigger: 'blur'}
          ],
          code: [
            {validator: checkCode, trigger: 'blur'}
          ],
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          confirmPass: [
            {validator: validConfirmPass, trigger: 'blur'}
          ]
        },
        isOk: false,
        SMSParams: {
          phone: null,
          option: 'findBackPassword'
        },
        buttonContent: '获取验证码',
        disabled: false,
        totalTime: 60
      }
    },
    methods: {
      handleClose() {
        this.$router.push({path: '/login'})
      },
      handleSMS() {
        this.$refs.ruleForm.validateField('phone', (valid) => {
          if (valid) {
            this.$message.error('请输入正确手机号')
            return false
          } else {
            this.SMSParams.phone = this.ruleForm.phone
            getSMSVerificaCode(this.SMSParams).then(res => {
              if (res.code === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })

                var auth_timetimer = setInterval(() => {
                  this.totalTime--
                  this.buttonContent = this.totalTime + '秒'
                  if (this.totalTime < 0) {
                    this.totalTime = 60
                    clearInterval(auth_timetimer)
                    this.buttonContent = '重新发送'
                  }
                }, 1000)
              } else {
                this.$message.error(res.msg)
              }
            }).catch(err => {
              this.$message.error('服务器错误')
            })
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isOk = true
            const params = {phone: this.ruleForm.phone, code: this.ruleForm.code, password: this.ruleForm.password}
            retrievePass(params).then(res => {
              if (res.code === 0) { // 找回成功
                const newLoginParam = {'account': this.ruleForm.phone, 'password': this.ruleForm.password}
                window.localStorage.setItem('SYS_LoginHistory', JSON.stringify(newLoginParam))
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.isOk = false
                this.$refs[formName].resetFields()
                this.$router.push({path: 'login'})
              } else {
                this.$message.error(res.msg)
                this.$router.push({path: 'login'})
              }
            })
          } else {
            this.$message.error('请填写正确信息')
            return false
          }
        })
      }
    }
  }
</script>


<style lang="scss">
  .retrieve-pwd-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    button {
      outline: none;
      border: none;
    }

    .el-form {
      margin-top: 38px;

      .el-form-item {
        margin-bottom: 20px;

        .el-form-item__content {
          display: flex !important;

          > span:not(.verif-code) {
            width: 164px;
            margin-right: 92px;
            margin-left: 16px;
          }

          > .verif-code {
            width: 164px;
            height: 40px;
            background: rgba(93, 146, 230, 1);
            border-radius: 5px;
            white-space: nowrap;
            margin-right: 92px;
            margin-left: 16px;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            padding: 10px 0;
            text-align: center;
          }
        }

        .el-form-item__label {
          font-size: 18px;
          color: #333333;
        }
      }

      .small-gap {
        margin-bottom: 2px;
      }

      .large-gap {
        margin-bottom: 50px;
      }

      .register-button {
        width: 274px;
        height: 50px;
        background: rgba(0, 136, 255, 1);
        border-radius: 5px;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        margin-left: 73px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  * {
    /*outline: 1px solid red;*/
  }

  .retrieve-pwd-wrapper {
    width: 736px;
    height: 460px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 6px rgba(10, 107, 151, 0.16);
    border-radius: 20px;
    display: flex;
    flex-direction: column;

    .retrieve-bar {
      width: 100%;
      height: 71px;
      background: linear-gradient(180deg, rgba(129, 178, 255, 1) 0%, rgba(58, 123, 226, 1) 100%);
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 20px 20px 0 0;

      .title {
        width: 80px;
        height: 28px;
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 28px;
        color: rgba(255, 255, 255, 1);
      }

      > .tools {
        position: absolute;
        top: 50%;
        right: 19px;
        transform: translateY(-50%);

        > img {
          width: 18px;
          height: 18px;
          margin-left: 21px;
        }
      }
    }

    .el-form {
      flex-grow: 1;
    }
  }
</style>
