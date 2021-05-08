<template>
  <section class="userdialog-wrapper">
    <section class="userdialog">
      <ul class="head">
        <li>
          <div>个人资料</div>
        </li>
        <li @click="onClose"><img src="../../../../assets/icons/dialog/close.png" alt=""/></li>
      </ul>
      <section class="content">
        <section class="user-container">
          <ul class="data">
            <li>
              <div class="labels">用户名</div>
              <div class="values">: <span class="gap">{{userInfo.username}}</span>
                <img v-if="userInfo.is_vip!==0" src="../../../../assets/icons/common/level.png" alt="" class="level">
              </div>
            </li>
            <li>
              <div class="labels">昵称</div>
              <div class="values">: <span class="gap">{{userInfo.nickname}}</span><a class="update" @click="onUpdate(0)">修改</a></div>
            </li>
            <li>
              <div class="labels">手机号</div>
              <div class="values">: <span class="gap">{{userInfo.phone}}</span><a class="update" @click="onUpdate(1)">修改</a></div>
            </li>
          </ul>
          <div class="avatar">
            <el-upload class="avatar-uploader" :action="actionUrl" :show-file-list="false" :on-success="handleAvatarSuccess"
                       :before-upload="beforeAvatarUpload">
              <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar">
              <img class="edit-picture" src="../../../../assets/icons/dialog/edit.png" alt="">
            </el-upload>
          </div>
        </section>
        <section class="account">
          <ul class="data bottom-gap">
            <li>
              <div class="qq">QQ</div>
              <div class="values">: <span class="gap">{{userInfo.qq}}</span><a class="update bind" @click="onUpdate(2)">修改</a></div>
            </li>
            <li>
              <div class="labels">微信</div>
              <div class="values">: <span class="gap">{{userInfo.wechat}}</span><a class="update" @click="onUpdate(3)">修改</a></div>
            </li>
            <li>
              <div class="labels">邮箱</div>
              <div class="values">: <span class="gap">{{userInfo.email}}</span><a class="update" @click="onUpdate(4)">修改</a></div>
            </li>
          </ul>
          <ul class="datav2 bottom-gap">
            <li v-if="userInfo.is_vip === 1">
              <div class="labels">会员开通时间</div>
              <div class="values">: <span class="gap">{{userInfo.create_at}}</span></div>
            </li>
            <li v-else>
              <div class="labels">会员开通时间</div>
              <div class="values">: <span class="gap not-open">未开通</span><a class="open" @click="goOpen">前往开通</a></div>
            </li>
          </ul>
          <ul class="datav2">
            <li>
              <div class="labels">会员到期时间</div>
              <div class="values">: <span v-if="userInfo.is_vip === 1" class="gap">{{userInfo.vip_info.end_time}}</span></div>
            </li>
          </ul>
        </section>
      </section>
    </section>
    <section class="mask"></section>

    <el-dialog :visible.sync="updateVisible" width="24%" :before-close="handleClose" class="custom-dialog">
      <el-form label-width="80px" :model="updateForm" :rules="rules" ref="ruleForm">
        <el-form-item :label="labelNames[index]" class="update-form-item" prop="nickname" :rules="[{ required: true, message: '昵称不能为空', trigger: 'blur'}]">
          <el-input v-model="updateForm.nickname" clearable></el-input>
        </el-form-item>
        <el-form-item class="update-form-item-l">
          <el-button class="confirm-button" type="primary" @click="confirmUpdate('ruleForm')" :disabled="isOK">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="updateVisibleV2" width="24%" :before-close="handleClose" class="custom-dialog custom-dialogv2">
      <el-form label-width="80px" :model="phoneParam" :rules="rules2" ref="ruleForm">
        <el-form-item :label="labelNames[index]" class="update-form-item" prop="phone">
          <el-input v-model="phoneParam.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="验证码:" class="update-form-item item-ct" prop="code">
          <el-input v-model="phoneParam.code" clearable></el-input>
          <el-button class="send-msg-button" type="primary" @click="onSendVerifCode('ruleForm')" :disabled="isOK">发送验证码</el-button>
        </el-form-item>
        <el-form-item class="update-form-item-l">
          <el-button class="confirm-button" type="primary" @click="confirmUpdatePhone('ruleForm')" :disabled="isOK">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="updateVisibleV3" width="24%" :before-close="handleClose" class="custom-dialog">
      <el-form label-width="80px" :model="updateForm" :rules="rulesV3" ref="ruleForm">
        <el-form-item :label="labelNames[index]" class="update-form-item" prop="qq">
          <el-input v-model="updateForm.qq" clearable></el-input>
        </el-form-item>
        <el-form-item class="update-form-item-l">
          <el-button class="confirm-button" type="primary" @click="confirmUpdateV3('ruleForm')" :disabled="isOK">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="updateVisibleV4" width="24%" :before-close="handleClose" class="custom-dialog">
      <el-form label-width="80px" :model="updateForm" :rules="rulesV4" ref="ruleForm">
        <el-form-item :label="labelNames[index]" class="update-form-item" prop="wechat" :rules="[{ required: true, message: '微信号不能为空', trigger: 'blur'}]">
          <el-input v-model="updateForm.wechat" clearable></el-input>
        </el-form-item>
        <el-form-item class="update-form-item-l">
          <el-button class="confirm-button" type="primary" @click="confirmUpdateV4('ruleForm')" :disabled="isOK">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="updateVisibleV5" width="24%" :before-close="handleClose" class="custom-dialog">
      <el-form label-width="80px" :model="updateForm" :rules="rulesV5" ref="ruleForm">
        <el-form-item :label="labelNames[index]" class="update-form-item" prop="email">
          <el-input v-model="updateForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item class="update-form-item-l">
          <el-button class="confirm-button" type="primary" @click="confirmUpdateV5('ruleForm')" :disabled="isOK">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </section>
</template>

<script>
  import eventBus from '@/utils/bus'
  import {getUserInfo, updateUserInfo, bindPhone} from '@/api'
  import {getToken} from '@/utils/auth'
  import {dateFormat} from '@/utils'
  import {getSMSVerificaCode} from '@/api/login'
  import {validateEmail, validatePhoneNumber, validateQQ} from '../../../../utils/validate'

  export default {
    name: 'UserDialog',
    data() {
      var validateNickName = (rule, value, callback) => {
        console.log(rule, value, callback)
        if (value === '') {
          callback(new Error('昵称不能为空'))
        } else {
          callback()
        }
      }
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('手机号码不能为空'))
        } else {
          if (!validatePhoneNumber(value)) {
            callback(new Error('请输入正确手机号码'))
          } else {
            callback()
          }
        }
      }
      var validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('验证码不能为空'))
        } else {
          callback()
        }
      }
      var checkQQ = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('QQ号不能为空'))
        } else {
          if (!validateQQ(value)) {
            callback(new Error('请输入正确QQ号'))
          } else {
            callback()
          }
        }
      }
      var validateWX = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('微信号不能为空'))
        } else {
          callback()
        }
      }
      var checkEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('邮箱不能为空'))
        } else {
          if (!validateEmail(value)) {
            callback(new Error('请输入正确邮箱'))
          } else {
            callback()
          }
        }
      }
      return {
        actionUrl: 'https://market.newbt.cn/api/Tool/upload',
        userInfoParam: {
          token: null
        },
        userInfo: {
          id: null,
          phone: null,
          username: null,
          nickname: null,
          avatar: null,
          qq: null,
          wechat: null,
          email: null,
          is_vip: null,
          create_at: null,
          last_login: null,
          vip_info: null
        },
        updateVisible: false,
        labelNames: ['昵称:', '手机号:', 'qq:', '微信号:', '邮箱:'],
        index: 0,
        updateForm: {
          token: null,
          nickname: null,
          avatar: null,
          qq: null,
          wechat: null,
          email: null
        },
        isOK: false,
        rules: {
          nickname: [
            {validator: validateNickName, trigger: 'blur'}
          ]
        },
        phoneParam: {
          token: null,
          phone: null,
          code: null
        },
        updateVisibleV2: false,
        rules2: {
          phone: [
            {validator: validatePhone, trigger: 'blur'}
          ],
          code: [
            {validator: validateCode, trigger: 'blur'}
          ]
        },
        updateVisibleV3: false,
        rulesV3: {
          qq: [
            {validator: checkQQ, trigger: 'blur'}
          ]
        },
        updateVisibleV4: false,
        rulesV4: {
          wechat: [
            {validator: validateWX, trigger: 'blur'}
          ]
        },
        updateVisibleV5: false,
        rulesV5: {
          email: [
            {validator: checkEmail, trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.userInfoParam.token = getToken()
      this.fetchData()
    },
    methods: {
      fetchData() {
        getUserInfo(this.userInfoParam).then(res => {
          this.userInfo = res.data
          this.userInfo.create_at = dateFormat(this.userInfo.create_at)
        })
      },
      onClose() {
        eventBus.$emit('closeUser', null)
      },
      handleAvatarSuccess(res, file) {
        this.userInfo.avatar = file.response.data[0]

        this.isOk = true
        this.updateForm.token = getToken()
        this.updateForm.avatar = this.userInfo.avatar
        updateUserInfo(this.updateForm).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.isOk = false
        }).catch(e => {
          this.isOk = false
        })
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      handleClose() {
        this.$refs['ruleForm'].resetFields()  //fix bug 765

        this.updateForm.nickname = null
        this.updateForm.qq = null
        this.updateForm.wechat = null
        this.updateForm.email = null

        this.updateVisible = false
        this.updateVisibleV2 = false
        this.updateVisibleV3 = false
        this.updateVisibleV4 = false
        this.updateVisibleV5 = false
      },
      onUpdate(index) {
        switch (index) {
          case 0:
            this.index = index
            this.updateVisible = true
            break
          case 1:
            this.index = index
            this.updateVisibleV2 = true
            break
          case 2:
            this.index = index
            this.updateVisibleV3 = true
            break
          case 3:
            this.index = index
            this.updateVisibleV4 = true
            break
          case 4:
            this.index = index
            this.updateVisibleV5 = true
            break
        }
      },
      confirmUpdate(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateForm.token = getToken()
            this.isOk = true
            updateUserInfo(this.updateForm).then(res => {
              if (res.code === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.userInfo = res.data
                this.userInfo.create_at = dateFormat(this.userInfo.create_at)
              } else {
                this.$message.error(res.msg)
              }
              this.updateVisible = false
              this.isOk = false
              this.$refs[formName].resetFields()
            }).catch(e => {
              this.isOk = false
            })
          } else {
            this.isOk = false
            this.$message.error('填写信息不正确')
            return false
          }
        })
      },
      onSendVerifCode(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isOk = true
            const verifParam = {phone: this.phoneParam.phone, option: 'bindPhoneNumber'}
            getSMSVerificaCode(verifParam).then(res => {
              if (res.code === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
              } else {
                this.$message.error(res.msg)
              }
              this.isOk = false
            }).catch(e => {
              this.isOk = false
            })
          } else {
            this.isOk = false
            this.$message.error('填写信息不正确')
            return false
          }
        })
      },
      confirmUpdatePhone(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.phoneParam.token = getToken()
            this.isOk = true
            bindPhone(this.phoneParam).then(res => {
              if (res.code === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.userInfo = res.data
                this.userInfo.create_at = dateFormat(this.userInfo.create_at)
              } else {
                this.$message.error(res.msg)
              }
              this.updateVisibleV2 = false
              this.isOk = false
              this.$refs[formName].resetFields()
            }).catch(e => {
              this.isOk = false
            })
          } else {
            this.isOk = false
            this.$message.error('填写信息不正确')
            return false
          }
        })
      },
      confirmUpdateV3(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateForm.token = getToken()
            this.isOk = true
            updateUserInfo(this.updateForm).then(res => {
              if (res.code === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.userInfo = res.data
                this.userInfo.create_at = dateFormat(this.userInfo.create_at)
              } else {
                this.$message.error(res.msg)
              }
              this.updateVisibleV3 = false
              this.isOk = false
              this.$refs[formName].resetFields()
            }).catch(e => {
              this.isOk = false
            })
          } else {
            this.isOk = false
            this.$message.error('填写信息不正确')
            return false
          }
        })
      },
      confirmUpdateV4(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateForm.token = getToken()
            this.isOk = true
            updateUserInfo(this.updateForm).then(res => {
              if (res.code === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.userInfo = res.data
                this.userInfo.create_at = dateFormat(this.userInfo.create_at)
              } else {
                this.$message.error(res.msg)
              }
              this.updateVisibleV4 = false
              this.isOk = false
              this.$refs[formName].resetFields()
            }).catch(e => {
              this.isOk = false
            })
          } else {
            this.isOk = false
            this.$message.error('填写信息不正确')
            return false
          }
        })
      },
      confirmUpdateV5(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateForm.token = getToken()
            this.isOk = true
            updateUserInfo(this.updateForm).then(res => {
              if (res.code === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.userInfo = res.data
                this.userInfo.create_at = dateFormat(this.userInfo.create_at)
              } else {
                this.$message.error(res.msg)
              }
              this.updateVisibleV5 = false
              this.isOk = false
              this.$refs[formName].resetFields()
            }).catch(e => {
              this.isOk = false
            })
          } else {
            this.isOk = false
            this.$message.error('填写信息不正确')
            return false
          }
        })
      },
      goOpen() {
        this.$message('暂未开放，敬请期待！')
      }
    }
  }
</script>

<style lang="scss">
  .custom-dialogv2 {
    .update-form-item {
      label.el-form-item__label, div.el-form-item__content {
        margin-left: 0 !important;
      }

      div.el-form-item__content {
        display: inline-flex;
        align-items: center;
      }
    }

    .item-ct {
      > div.el-form-item__content {
        display: inline-flex;

        .send-msg-button {
          margin-left: 20px;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  * {
    /*outline: 1px solid red;*/
  }

  .userdialog-wrapper {
    .userdialog {
      width: 640px;
      background-color: #fff;
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 20;
      border-radius: 10px;
      color: #333333;

      ul.head {
        width: 100%;
        height: $dialogHeadHigh;
        background: #DDDDDD;
        border-radius: 10px 10px 0px 0px;
        padding-left: 21px;
        padding-right: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        li:first-child {
          > div {
            font-size: $fontSize16;
            color: #333333;
          }
        }

        li:nth-child(2) {
          > img {
            width: 18px;
            height: 18px;
          }
        }
      }

      .content {
        padding: 20px 24px 69px 22px;

        .user-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #EEEEEE;
          padding-right: 79px;
          padding-bottom: 24px;

          .avatar {
            width: 114px;
            height: 114px;
            border-radius: 50%;
            background-color: #F6F6F6;
            position: relative;
            z-index: 3030;

            .edit-picture {
              width: 31px;
              height: 31px;
              position: absolute;
              bottom: 0;
              right: 0;
              z-index: 3031;
            }
          }
        }

        .account {
          padding-top: 25px;
        }

        .data {
          display: flex;
          flex-direction: column;

          > li {
            display: flex;
            margin-bottom: 6px;

            div.labels {
              width: 72px;
              height: 25px;
              line-height: 25px;
              font-size: $fontSize14;
              display: inline-block;
              text-align: justify;
              vertical-align: top;

              &::after {
                display: inline-block;
                width: 100%;
                content: '';
                height: 0;
              }
            }

            .qq {
              width: 72px;
              height: 25px;
              line-height: 25px;
              font-size: $fontSize14;
              text-align: right;
            }

            div.values {
              height: 25px;
              line-height: 25px;
              font-size: $fontSize14;

              .gap {
                padding-left: 6px;
              }

              a {
                color: #00C2FF;
              }

              .update {
                padding-left: 30px;
              }

              .level {
                width: 26px;
                height: 22px;
                margin-left: 14px;
              }
            }
          }

          > li:last-child {
            margin-bottom: 0;
          }
        }

        .datav2 {
          display: flex;
          flex-direction: column;

          > li {
            display: flex;
            margin-bottom: 6px;

            div.labels {
              width: 126px;
              height: 25px;
              line-height: 25px;
              font-size: $fontSize14;
              display: inline-block;
              text-align: justify;
              vertical-align: top;

              &::after {
                display: inline-block;
                width: 100%;
                content: '';
                height: 0;
              }
            }

            div.values {
              height: 25px;
              line-height: 25px;
              font-size: $fontSize14;

              .gap {
                padding-left: 6px;
              }

              .not-open {
                color: #999999;
              }

              a, .bind {
                color: #00C2FF;
              }

              .open {
                padding-left: 36px;
              }
            }
          }

          > li:last-child {
            margin-bottom: 0;
          }
        }

        .bottom-gap {
          margin-bottom: 16px;
        }
      }
    }

    .mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: .5;
      background: #000;
      z-index: 19;
      width: 100%;
      height: 100%;
    }

    .custom-dialog {
      .update-form-item {
        margin-top: 24px;
        margin-bottom: 0;
      }

      .update-form-item-l {
        margin-top: 43px;
        margin-bottom: 0px !important;
        padding-bottom: 16px;
      }

      .confirm-button {
        width: 180px;
        height: 50px;
        background: rgba(0, 136, 255, 1);
        border-radius: 5px;
        font-size: $fontSize14;
        margin-left: 20px;
      }
    }
  }
</style>
