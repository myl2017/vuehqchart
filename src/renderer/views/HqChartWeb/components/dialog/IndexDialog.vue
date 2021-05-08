<template>
  <section class="indexdialog-wrapper">
    <section class="indexdialog">
      <ul class="head">
        <li>
          <div>指标编辑器</div>
        </li>
        <li @click="onClose"><img src="../../../../assets/icons/dialog/close.png" alt=""/></li>
      </ul>
      <section class="content">
        <el-form ref="indexForm" :model="indexForm" label-width="80px" size="mini" class="custom-form">
          <el-row class="custom-row">
            <el-col :span="7">
              <el-form-item label="公式名称" prop="Name" :rules="[{ required: true, message: '请输入公式名称', trigger: 'blur' }]">
                <template v-if="isEdit===true">
                  <el-input v-model="indexForm.Name" :disabled="isEdit"></el-input>
                </template>
                <template v-else>
                  <el-input v-model="indexForm.Name" @blur="onBlur($event)"></el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="公式类型">
                <el-input v-model="indexForm.Type === 1 ? '自定义': ''" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="画线方法">
                <el-select v-model="indexForm.IsMainIndex" filterable placeholder="请选择" @change="handleChange">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3" class="custom-column">
              <template v-if="isEdit===true">
                <el-button class="confirm-button" size="mini" :disabled="isOk" @click="onEdit('indexForm')">确定</el-button>
              </template>
              <template v-else>
                <el-button class="confirm-button" size="mini" :disabled="isOk" @click="onSave('indexForm')">确定</el-button>
              </template>
            </el-col>
          </el-row>
          <el-row class="custom-row">
            <el-col :span="7">
              <el-form-item label="公式描述">
                <el-input v-model="indexForm.Description"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="显示小数" prop="FloatPrecision" :rules="[{ required: true, message: '请选择显示小数', trigger: 'blur' }]">
                <el-select v-model="indexForm.FloatPrecision" filterable placeholder="请选择" @change="handleChangeV2">
                  <el-option v-for="item in optionsV2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="custom-column">
              <el-button class="cancel-button" size="mini" @click="onCancel()">取消</el-button>
            </el-col>
          </el-row>
          <el-tabs type="border-card" class="custom-tabs" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="参数1-4" name="参数1-4" clas="custom-pane">
              <div class="table" id="tools_table">
                <table cellpadding="0" cellspacing="0">
                  <thead>
                  <tr>
                    <th class="number"></th>
                    <th align="left">参数</th>
                    <th align="left">最小</th>
                    <th align="left">最大</th>
                    <th align="left">缺省</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in list.slice(0,4)">
                    <td class="number">{{index+1}}</td>
                    <td v-on:click="closeEdit(index,'name')">
                      <input v-model="item.name.value" v-on:click.stop=""/>
                    </td>
                    <td v-on:click="closeEdit(index,'min')">
                      <input v-model="item.min.value" v-on:click.stop=""/>
                    </td>
                    <td v-on:click="closeEdit(index,'max')">
                      <input v-model="item.max.value" v-on:click.stop=""/>
                    </td>
                    <td v-on:click="closeEdit(index,'value')">
                      <input v-model="item.value.value" v-on:click.stop=""/>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="button-wrap">
                <div class="tips">* 本编辑器只支持通信达脚本</div>
                <div>
                  <a class="script-link" @click="onHelper($event)">函数帮助</a>
                  <el-button class="execute-button" size="mini" @click="onExecute()">执行</el-button>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="参数5-8" name="参数5-8" clas="custom-pane">
              <div class="table" id="tools_table2">
                <table cellpadding="0" cellspacing="0">
                  <thead>
                  <tr>
                    <th class="number"></th>
                    <th align="left">参数</th>
                    <th align="left">最小</th>
                    <th align="left">最大</th>
                    <th align="left">缺省</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in list.slice(4,8)">
                    <td class="number">{{indexList[index]}}</td>
                    <td v-on:click="closeEdit(index,'name')">
                      <input v-model="item.name.value" v-on:click.stop=""/>
                    </td>
                    <td v-on:click="closeEdit(index,'min')">
                      <input v-model="item.min.value" v-on:click.stop=""/>
                    </td>
                    <td v-on:click="closeEdit(index,'max')">
                      <input v-model="item.max.value" v-on:click.stop=""/>
                    </td>
                    <td v-on:click="closeEdit(index,'value')">
                      <input v-model="item.value.value" v-on:click.stop=""/>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="button-wrap">
                <div class="tips">* 本编辑器只支持通信达脚本</div>
                <div>
                  <a class="script-link" @click="onHelper($event)">函数帮助</a>
                  <el-button class="execute-button" size="mini" @click="onExecuteV2()">执行</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-input type="textarea" :rows="10" v-model="indexForm.Script"></el-input>
        </el-form>
        <section class="debug-info">
          <p class="complier-error" v-if="isDebug">Error: Line {{complierError.LineNumber}}: {{complierError.Description}}</p>
        </section>
      </section>
    </section>
    <section class="mask"></section>
  </section>
</template>

<script>
  import eventBus from '@/utils/bus'
  import {getToken} from '../../../../utils/auth'
  import {createIndex, getDetail, editIndex, validIndexName} from '../../../../api'
  import $ from 'jquery'
  import {insertFuncs, updateFuncs} from '@/utils/sqlHelper'

  const {shell} = require('electron')

  export default {
    name: 'IndexDialog',
    props: {
      indexData: {
        type: Object,
        required: true
      },
      jsChart: {
        type: Object
      },
      complierError: [Object, Error],
      isDebug: {
        type: Boolean
      }
    },
    data() {
      return {
        options: [{
          value: 1,
          label: '主图'
        }, {
          value: 2,
          label: '副图'
        }],
        optionsV2: [{
          value: 2,
          label: '2'
        }, {
          value: 1,
          label: '1'
        }, {
          value: 4,
          label: '4'
        }],
        indexForm: {
          token: null,
          ID: null,   // 指标ID
          Name: null, // 指标名字
          Type: 1, // 公式类型
          IsMainIndex: '主图', // 是否是主图指标 true=主图指标 false=副图指标
          Description: null, // 指标描述信息
          FloatPrecision: 2, // 小数位数 缺省=2
          Args: null,      // 指标参数
          ArgsList: [],  // 指标参数明细
          Script: 'A线:EMA(EMA(EMA(EMA(CLOSE,2),2),2),2),LINETHICK2,COLORD9120B;\n' +
            'B线:EMA(REF(A线,1),2),LINETHICK2,COLORFFF230;\n' +
            'DRAWICON(CROSS(B线, A线),LOW * 0.98,8);\n' +
            'DRAWICON(CROSS(A线, B线),HIGH * 1.02,7);\n' +
            '趋势:EMA(EMA(EMA(EMA(EMA(CLOSE,55),2),2),2),2),LINETHICK2,COLORE12ADE;'
        },
        list: [
          {name: {value: '', isEdit: false}, min: {value: '', isEdit: false}, max: {value: '', isEdit: false}, value: {value: '', isEdit: false}},
          {name: {value: '', isEdit: false}, min: {value: '', isEdit: false}, max: {value: '', isEdit: false}, value: {value: '', isEdit: false}},
          {name: {value: '', isEdit: false}, min: {value: '', isEdit: false}, max: {value: '', isEdit: false}, value: {value: '', isEdit: false}},
          {name: {value: '', isEdit: false}, min: {value: '', isEdit: false}, max: {value: '', isEdit: false}, value: {value: '', isEdit: false}},
          {name: {value: '', isEdit: false}, min: {value: '', isEdit: false}, max: {value: '', isEdit: false}, value: {value: '', isEdit: false}},
          {name: {value: '', isEdit: false}, min: {value: '', isEdit: false}, max: {value: '', isEdit: false}, value: {value: '', isEdit: false}},
          {name: {value: '', isEdit: false}, min: {value: '', isEdit: false}, max: {value: '', isEdit: false}, value: {value: '', isEdit: false}},
          {name: {value: '', isEdit: false}, min: {value: '', isEdit: false}, max: {value: '', isEdit: false}, value: {value: '', isEdit: false}}
        ],
        ArgsAry: null,
        ArgsAry2: null,
        activeName: '参数1-4',
        editParam: {
          token: null,
          ID: null
        },
        isEdit: false,
        isOk: false,
        validResult: false,
        ArgsList: null,
        ArgsListV2: null,
        indexList: [5, 6, 7, 8],
        isDebugV2: false
      }
    },
    watch: {
      indexData(newValue, oldValue) {
        if (newValue === null) {
          this.resetParam()
          return
        }
        if (newValue.isEdit !== true) {
          this.isEdit = false
          this.resetParam()
          return
        }
        this.editParam.ID = newValue.data.id
        this.fetchData()
        this.isEdit = true
      }
    },
    created() {
      this.isDebugV2 = this.isDebug
      this.indexForm.token = getToken()
      this.editParam.token = getToken()
      this.initList()
    },
    methods: {
      onHelper(e) {
        e.preventDefault()                           // 阻止窗口打开的默认事件
        shell.openExternal('http://opensourcecdn.zealink.com/cache/webcache/hqfunctionhelp/index.html#/1')   // 通过url在浏览器打开
      },
      resetParam() {
        this.indexForm.ID = null
        this.indexForm.Name = null
        this.indexForm.Type = 1
        this.indexForm.IsMainIndex = '主图'
        this.indexForm.Description = ''
        this.indexForm.FloatPrecision = null
        this.indexForm.Args = []
        this.indexForm.Script = 'VOL:VOL,VOLSTICK;\n' +
          'MA1:MA(VOL,M1);\n' +
          'MA2:MA(VOL,M2);'
      },
      fetchData() {
        getDetail(this.editParam).then(res => {
          console.log('detail::: ', res.data)
          if (!res.data) return
          this.indexForm.ID = res.data.ID
          this.indexForm.Name = res.data.Name
          this.indexForm.Type = res.data.Type
          this.indexForm.IsMainIndex = res.data.IsMainIndex === 1 ? '主图' : '副图'
          this.indexForm.Description = res.data.Description
          this.indexForm.FloatPrecision = res.data.FloatPrecision
          this.indexForm.Args = res.data.Args
          this.indexForm.Script = res.data.Script

          this.list = []

          if (!res.data.ArgsList) {
            this.initList()
          } else {
            this.list = JSON.parse(res.data.ArgsList)
            const plusLength = 8 - this.list.length
            if (plusLength > 0) {
              for (let i = 0; i < plusLength; i++) {
                this.list.push({
                  name: {value: '', isEdit: false},
                  min: {value: '', isEdit: false},
                  max: {value: '', isEdit: false},
                  value: {value: '', isEdit: false}
                })
              }
            }

            console.log('detail list:: ', this.list)
          }
        })
      },
      onClose() {
        sessionStorage.removeItem('CustomIndex')
        let liList = $('.target-right ul li')
        console.log('liList:::: ', liList)
        for (let i = 0; i < liList.length; i++) {
          $(liList[i]).removeClass('active-list')
        }
        eventBus.$emit('toggleIndex', {isShow: false, isEdit: -1, jsChart: this.jsChart})
      },
      initList() {
        var delfaultLength = 8
        this.list = []
        for (var i = 0; i < delfaultLength; i++) {
          this.list.push({
            name: {value: '', isEdit: false},
            min: {value: '', isEdit: false},
            max: {value: '', isEdit: false},
            value: {value: '', isEdit: false}
          })
        }
      },
      getArgs() {
        var args = []

        for (var i = 0; i < this.list.length; i++) {
          var name = this.list[i].name.value, value = this.list[i].value.value

          if (!name || !value) { continue }

          value = parseInt(value)

          args.push({
            Name: name,
            Value: value
          })
        }

        return args
      },
      clear() {
        for (var i = 0; i < this.list.length; i++) {
          if (!this.list[i].max.value && !this.list[i].min.value && !this.list[i].name.value && !this.list[i].value.value) { continue }

          this.list[i].max.value = ''
          this.list[i].max.isEdit = true

          this.list[i].min.value = ''
          this.list[i].min.isEdit = true

          this.list[i].name.value = ''
          this.list[i].name.isEdit = true

          this.list[i].value.value = ''
          this.list[i].value.isEdit = true
        }
      },
      openEdit: function (index, type) {
        this.list[index][type].isEdit = true
      },
      closeEdit: function (index, type) {
        if (this.list[index][type].value == '') {
          this.list[index][type].isEdit = true
        } else {
          this.list[index][type].isEdit = false
        }
      },
      onBlur(event) {
        var value = event.target.value
        this.validName(value)
      },
      validName(name) {
        validIndexName({token: getToken(), Name: name}).then(res => {
          if (res.data.exists) {
            this.validResult = res.data.exists
            this.$message.error('输入指标名称重复，请重试!')
            return
          } else {
            this.validResult = false
          }
        })
      },
      selectBlur(e) {
        this.indexForm.IsMainIndex = e.target.value
      },
      handleChange(value) {
        this.indexForm.IsMainIndex = value
      },
      handleChangeV2(value) {
        this.indexForm.FloatPrecision = value
      },
      handleClick(tab, event) {
        // this.clear()
      },
      onSave(formName) {
        if (this.validResult) {
          this.$message.error('输入指标名称重复，请重试!')
          return
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {

            this.indexForm.ID = this.indexForm.Name
            if (this.ArgsAry === null) {
              this.ArgsAry = []
            }
            if (this.ArgsAry2 === null) {
              this.ArgsAry2 = []
            }

            this.indexForm.Args = JSON.stringify(this.ArgsAry.concat(this.ArgsAry2))
            this.indexForm.IsMainIndex === '主图' ? this.indexForm.IsMainIndex = 1 : null // 是否是主图指标[1主图指标 2副图指标]
            this.indexForm.ArgsList = JSON.stringify(this.handlerArray(this.list))
            this.isOk = true

            console.log('保存onSave::: ', this.indexForm)

            createIndex(this.indexForm).then(res => {
              this.isOk = false

              if (res.code === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })

                // 持久化到本地sqlite3数据库
                let funcsParam = this.indexForm
                funcsParam.tree_id = '109'
                funcsParam.tree_node = '自定义'
                console.log('funcsParam::: ', funcsParam)

                insertFuncs(funcsParam, window.localStorage.getItem('SYS_Token')).then(res => {
                  console.log('insertFuncs res::: ', res)
                })

              } else {
                this.$message.error('新建出错')
              }

              this.onClose()
              $('.jchart-changeindex-box').css('display', 'none')

            }).catch(err => {
              this.$message.error('填写信息有误')
            })

          } else {
            this.$message({
              message: '编辑信息不完善',
              type: 'warning'
            })
            return false
          }
        })
      },
      onEdit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ArgsAry === null) {
              this.ArgsAry = []
            }
            if (this.ArgsAry2 === null) {
              this.ArgsAry2 = []
            }
            this.indexForm.Args = JSON.stringify(this.ArgsAry.concat(this.ArgsAry2))
            this.indexForm.IsMainIndex === '主图' ? this.indexForm.IsMainIndex = 1 : null
            this.indexForm.ArgsList = JSON.stringify(this.handlerArray(this.list))
            this.isOk = true
            editIndex(this.indexForm).then(res => {
              this.isOk = false

              if (res.code === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                sessionStorage.removeItem('CustomIndex')
                if (this.indexForm.Args && this.indexForm.Args.length <= 0) this.indexForm.Args = ''
                if (this.indexForm.ArgsList && this.indexForm.ArgsList.length <= 0) this.indexForm.ArgsList = ''

                updateFuncs(this.indexForm).then(res => {
                  console.log('updateFuncs::: ', res)
                })
              } else {
                this.$message.error('编辑出错')
              }
              this.onClose()
              $('.jchart-changeindex-box').css('display', 'none')
            }).catch(err => {
              this.$message.error('填写信息有误')
            })
          } else {
            this.$message({
              message: '编辑信息不完善',
              type: 'warning'
            })
            return false
          }
        })
      },
      onCancel() {
        this.indexForm.ID = null
        this.indexForm.Name = null
        this.indexForm.Description = null
        this.indexForm.FloatPrecision = null
        this.clear()
        this.onClose()
      },
      onModifyIndex(form, args) {
        console.log('IsMainIndex::: ', form.IsMainIndex, typeof form.IsMainIndex)
        let windowIndex = 0  // 默认主图指标
        if (form.IsMainIndex === '主图' || form.IsMainIndex === 1) {
          windowIndex = 0
        } else {
          windowIndex = 1    // 副图指标
        }
        this.jsChart.ChangeScriptIndex(windowIndex, {Name: form.Name, Script: form.Script, Args: args, 'Modify': false, 'Change': false})
        console.log('========onModifyIndex=======')
        console.log(form)
        console.log(args)
      },
      onExecute() {
        this.ArgsAry = []
        let args = this.getArgs()
        for (let i = 0; i < args.length; i++) {
          this.ArgsAry.push(args[i])
        }

        this.onModifyIndex(this.indexForm, this.ArgsAry)

        this.isDebugV2 = false
        eventBus.$emit('debugError', this.isDebugV2)
      },
      onExecuteV2() {
        this.ArgsAry2 = []
        let args = this.getArgs()
        for (let i = 0; i < args.length; i++) {
          this.ArgsAry2.push(args[i])
        }

        this.onModifyIndex(this.indexForm, this.ArgsAry2)

        this.isDebugV2 = false
        eventBus.$emit('debugError', this.isDebugV2)
      },
      handlerArray(list) {
        var newArray = []

        for (var i = 0; i < list.length; i++) {
          var name = list[i].name.value, value = list[i].value.value

          if (!name || !value) { continue }

          newArray.push(list[i])
        }

        return newArray
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss" scoped>
  * {
    /*outline: 1px solid red;*/
  }

  .indexdialog-wrapper {
    .indexdialog {
      width: 640px;
      background-color: #fff;
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      color: #333333;
      border-radius: 10px;

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
            font-size: 16px;
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
        .custom-form {
          background-color: #DEDEDE;

          .custom-row:first-child {
            padding-right: 20px;
          }

          .custom-row {
            padding-right: 20px;
          }

          .custom-column {
            text-align: right !important;

            > button {
              color: #fff;
            }

            .confirm-button {
              background: rgba(28, 143, 208, 1);
            }

            .cancel-button {
              background: rgba(194, 194, 194, 1);
            }
          }

          .button-wrap {
            float: right;
            display: flex;
            flex-direction: column;
            width: 50%;

            .tips {
              color: #EE0000;
              height: 100px;
              padding-top: 6px;
              width: 100%;
            }

            > div:nth-child(2) {
              display: flex;
              justify-content: flex-end;

              .script-link {
                display: flex;
                align-items: center;
                margin-right: 16px;
                color: rgba(28, 143, 208, 1);
                margin-bottom: 15px;
                text-decoration: underline;
              }

              .execute-button {
                background-color: #F66C00;
                color: #fff;
                margin-right: 10px;
                margin-bottom: 15px;
              }
            }
          }

          .table {
            width: 50%;
            float: left;
          }

          .table table {
            width: 100%;
            margin-left: 1px;
          }

          .table table tbody td, .table table thead th {
            height: 24px;
            padding: 2px;
            width: 95px;
            text-align: center;
          }

          .table table td input {
            width: 60px;
            height: 24px;
            border: 1px solid #eee;
          }

          .table table td span {
            width: 50px;
            height: 24px;
            display: inline-flex;
          }

          .el-textarea {
            .el-textarea__inner {
              margin-top: -3px;
              outline: none;
              border: 1px solid #dddddd;
            }
          }
        }

        .debug-info {
          height: 108px;
          background-color: #fff;
          padding: 12px 22px;
          border-radius: 0 0 10px 10px;

          .complier-error {
            color: #EE0000;
            padding: 10px 0;
          }
        }
      }
    }

    .mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: .1;
      background: #000;
      z-index: 999;
      width: 100%;
      height: 100%;
    }
  }
</style>
