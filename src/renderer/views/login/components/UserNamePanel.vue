<template>
  <div class="username-panel">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="ruleForm.username" placeholder="4-16位英文、数字组合" autocomplete="off" clearable></el-input>
        <span></span>
      </el-form-item>
      <el-form-item label="密   码：" prop="password">
        <el-input type="password" v-model="ruleForm.password" placeholder="请输入6-16个字母、数字的组合" autocomplete="off" clearable></el-input>
        <span></span>
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input type="tel" v-model="ruleForm.phone" autocomplete="off" clearable></el-input>
        <span></span>
      </el-form-item>
      <el-form-item label="验证码：" prop="code" class="small-gap">
        <el-input v-model.number="ruleForm.code" autocomplete="off" clearable></el-input>
        <el-button class="verif-code" @click="handleSMS" :disabled="disabled">{{buttonContent}}</el-button>
      </el-form-item>
      <el-form-item label="" prop="type" class="large-gap">
        <el-checkbox-group v-model="agreeChecked">
          <el-checkbox label="同意《连币用户协议》" name="agreeChecked"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button class="register-button" @click="submitForm('ruleForm')" :disabled="isOk">立即注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {validateName, validatePassword, validatePhoneNumber} from '../../../utils/validate'
  import {getSMSVerificaCode, userNameRegister} from '../../../api/login'

  export default {
    name: 'UserNamePanel',
    data() {
      var validateUserName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'))
        } else {
          if (!validateName(value)) {
            callback(new Error('请输入4-16位英文、数字组合'))
          } else {
            callback()
          }
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
      return {
        ruleForm: {
          username: '',
          password: '',
          phone: '',
          code: ''
        },
        rules: {
          username: [
            {validator: validateUserName, trigger: 'blur'}
          ],
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          phone: [
            {validator: validatePhone, trigger: 'blur'}
          ],
          code: [
            {validator: checkCode, trigger: 'blur'}
          ]
        },
        agreeChecked: false,
        isOk: false,
        SMSParams: {
          phone: null,
          option: 'register'
        },
        buttonContent: '获取验证码',
        disabled: false,
        totalTime: 60
      }
    },
    methods: {
      handleSMS() {
        this.$refs.ruleForm.validateField('phone', (valid) => {
          if (valid) {
            return false
          } else {
            this.SMSParams.phone = this.ruleForm.phone
            this.disabled = true
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
                    this.disabled = false
                  }
                }, 1000)
              } else {
                this.disabled = false
                this.$message.error(res.msg)
              }
            }).catch(err => {
              this.disabled = false
              this.$message.error('网络异常')
            })
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!this.agreeChecked) {
              this.$alert('请勾选同意《连币用户协议》', '提示', {
                confirmButtonText: '确定'
              })
              return false
            } else {
              this.isOk = true
              userNameRegister(this.ruleForm).then(res => {
                if (res.code === 0) {  //fix bug 717 xxc
                  this.clearStorage()
                  this.$message({
                    message: res.msg,
                    type: 'success'
                  })
                  this.isOk = false
                  this.$refs[formName].resetFields()
                  this.$router.push({path: 'login'})
                } else {
                  this.isOk = false
                  this.$message.error(res.msg)
                }
              }).catch(err => {
                this.isOk = false
                this.$message.error('网络异常')
              })
            }
          } else {
            this.$message.error('请填写正确信息')
            return false
          }
        })
      },
      clearStorage() {
        window.localStorage.removeItem('SYS_LoginHistory')
        window.localStorage.removeItem('SYS_CheckAll')
        window.localStorage.removeItem('SYS_CheckedPass')
        window.localStorage.removeItem('SYS_Token')
      }
    }
  }
</script>


<style lang="scss">
  .username-panel {
    /*padding-top: 38px;*/

    button {
      outline: none;
      border: none;
    }

    .el-form {
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
        margin-bottom: 8px;
      }

      .large-gap {
        margin-bottom: 10px;
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
