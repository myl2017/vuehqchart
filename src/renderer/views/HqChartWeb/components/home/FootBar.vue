<template>
  <footer class="footer-wrapper" id="footBar">
    <div class="custom-serve">
      <div class="suggestion">
        <a class="suggest-text" @click="onShowSuggestion">意见反馈</a>
        <div class="v-line"></div>
        <a href="javascript:;">客服电话: {{configData.KF_tel}}</a>
      </div>
      <SeamlessScroll/>
      <div class="message">
        <a class="send-button" @click="onCustomServe('1006154436', $event)"><img src="../../../../assets/icons/common/customserve.png" alt=""/><span>联系客服</span></a>
        <div class="datetime">{{datetime}}</div>
      </div>
    </div>

    <el-dialog title="意见反馈" :visible.sync="suggestionVisible" width="34%" :before-close="handleSuggestionClose" class="custom-dialog suggestion-dialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
        <el-form-item prop="content">
          <div class="custom-label">具体描述:</div>
          <el-input type="textarea" v-model="ruleForm.content" :rows="6"></el-input>
        </el-form-item>
        <el-form-item prop="pic_url">
          <div class="custom-label">上传图片(最多三张):</div>
          <el-upload ref="image_upload" :action="actionUrl" list-type="picture-card" :auto-upload="false" :limit="3" :on-change="handleChange">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
              <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)"><i class="el-icon-zoom-in"></i></span>
                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                         <i class="el-icon-download"></i>
                     </span>
                     <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                          <i class="el-icon-delete"></i>
                     </span>
               </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item class="button-align">
          <el-button type="primary" @click="submitForm('ruleForm')" :disabled="isOk">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" class="custom-dialog">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </footer>
</template>

<script>
  // Vue 单文件组件, 代码超过150行就有可优化的空间
  import SeamlessScroll from './SeamlessScroll'
  import {getToken} from '@/utils/auth'
  import {addSuggestion} from '@/api'
  import {getConfig} from '../../../../api/home'
  import clip from '@/utils/clipboard' // use clipboard directly
  import clipboard from '@/directive/clipboard/index.js'

  export default {
    name: 'FootBar',
    directives: {
      clipboard
    },
    components: {SeamlessScroll},
    data() {
      return {
        datetime: null,
        suggestionVisible: false,
        ruleForm: {
          token: null,
          content: null,
          pic_url: []
        },
        rules: {
          content: [
            {required: true, message: '请填写具体描述', trigger: 'blur'}
          ],
          pic_url: [
            {type: 'array', required: true, message: '请至少选择一个图片', trigger: 'change'}
          ]
        },
        actionUrl: 'http://118.126.82.129:6789/api/Tool/upload',
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        isOk: false,
        configData: {
          KF_tel: null,
          LB_switch: null,
          recommendations: null
        }
      }
    },
    created() {
      this.fetchData()
      this.ruleForm.token = getToken()
    },
    mounted() {
      setInterval(() => {
        this.clock()
      }, 1000)
    },
    methods: {
      fetchData() {
        getConfig({}).then(res => {
          console.log(res)
          this.configData = res.data
        })
      },
      clock() {
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        this.datetime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute
      },
      onShowSuggestion() {
        this.suggestionVisible = true
      },
      onCleanImageList() {//bug 763
        this.ruleForm.content = ''
        this.$refs['image_upload'].clearFiles()
      },
      handleSuggestionClose() {
        this.suggestionVisible = false
        this.onCleanImageList()
      },
      handleRemove(file) {
        console.log(file)
      },
      handleChange(file, fileList) {
        console.log(file, fileList.length)
        if (fileList.length > 3) {
          this.$message({
            message: '最多上传3张图片',
            type: 'warning'
          })
        } else {
          this.ruleForm.pic_url.push(file.url)
        }
        this.fileList = fileList
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleDownload(file) {
        console.log(file)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isOk = true
            addSuggestion(this.ruleForm).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.onCleanImageList()
              this.$refs[formName].resetFields()
              this.isOk = false
              this.suggestionVisible = false
            }).catch(e => {
              this.isOk = false
            })
          } else {
            return false
          }
        })
      },
      onCustomServe(text, event) {
        clip(text, event)
        this.$message({
          message: `${text}群号已复制请前往粘贴`,
          type: 'success'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .footer-wrapper {
    width: 100%;
    height: 32px;
    position: relative;
    background: #DBDBDB;

    .custom-serve {
      min-height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 10px;
      padding-right: 20px;

      .suggestion, .message {
        display: flex;
        align-items: center;
      }

      .suggestion {
        .suggest-text {
          display: inline-block;
          font-size: $fontSize14;
          color: #00A0FB;
        }

        .v-line {
          width: 0;
          height: 18px;
          border-right: 1px solid #707070;
          margin-left: 11px;
          margin-right: 10px;
        }

        a {
          font-size: $fontSize14;
          white-space: nowrap;
        }
      }

      > .div:nth-child(2) {
        flex-grow: 1;
      }

      .message {
        .send-button {
          display: flex;
          align-items: center;
          padding: 2px 6px 2px 6px;
          border: 1px solid #F66C00;
          border-radius: 5px;
          white-space: nowrap;

          > img {
            width: 16px;
            height: 16px;
          }

          > span {
            font-size: $fontSize13;
            color: #F66C00;
            margin-left: 5px;
          }
        }

        .datetime {
          font-size: $fontSize14;
          margin-left: 14px;
          white-space: nowrap;
        }
      }
    }
  }
</style>
