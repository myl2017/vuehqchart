<template>
  <!-- 添加&编辑 笔记 -->
  <el-dialog v-if="dialogFormVisible" :title="title" :visible.sync="dialogFormVisible" width="40%" class="custom-dialog write-note-dialog"
             :before-close="handleClose">
    <el-form :label-position="labelPosition" label-width="70px" :model="formParam" ref="ruleForm" :disabled="isEdit">
      <el-row>
        <el-col :span="14">
          <el-form-item label="标题:" prop="title">
            <el-input size="small" v-model="formParam.title" class="custom-input"></el-input>
          </el-form-item>
          <el-form-item label="分类:" prop="type">
            <el-select v-model="formParam.type">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="相关股票:" prop="symbol">
            <el-autocomplete v-model="formParam.symbol"></el-autocomplete>
          </el-form-item>
          <el-form-item label="内容:" prop="content">
            <el-input type="textarea" v-model="formParam.content" :rows="6" class="custom-input"></el-input>
          </el-form-item>
          <el-form-item label="公开发布:" prop="is_public">
            <div class="col-wrap">
              <el-switch v-model="formParam.is_public" active-color="#409eff" inactive-color="#dddddd"></el-switch>
              <div class="public-tips"><img src="../../../../assets/icons/common/tips.png" alt=""/><span>选择公开发布, 将有机会被推荐到网站首页</span></div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <template v-if="this.formParam.type === '交易复盘' || this.formParam.type === '1'">
            <el-form-item label="交易时间:" prop="transaction_time">
              <el-input size="small" v-model="formParam.transaction_time"></el-input>
            </el-form-item>
            <el-form-item label="买卖方向:" prop="direction">
              <el-radio v-model="formParam.direction" label="1">买入</el-radio>
              <el-radio v-model="formParam.direction" label="2">卖出</el-radio>
            </el-form-item>
            <el-form-item label="交易价格:" prop="transaction_price">
              <div class="transaction-wrap">
                <el-input size="small" v-model="formParam.transaction_price" class="custom-input"></el-input>
                <div class="current-market">{{formParam.market}}</div>
              </div>
            </el-form-item>
            <el-form-item label="交易数量:" prop="transaction_amount">
              <div class="transaction-wrap">
                <el-input size="small" type="number" v-model.number="formParam.transaction_amount" class="custom-input"></el-input>
                <div class="current-market"></div>
              </div>
            </el-form-item>
          </template>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  import eventBus from '@/utils/bus.js'
  import {xDateFormat, xTimeFormat, dateFormat} from '../../../../utils'

  export default {
    name: 'BSDialog',
    props: {
      bsList: {
        type: String
      },
      BSDateAry: {
        type: Array
      },
      BSTimeAry: {
        type: Array
      },
      CurrentBSSymbol: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        title: 'BS点信息',
        labelPosition: 'right',
        dialogFormVisible: false,
        formParam: {
          token: null,
          id: null,
          type: null,                    // 分类(1 交易复盘, 2 自建)
          title: null,                   // 标题
          content: null,                 // 内容
          code: null,                    // 关联的币种名称
          market: null,                  // 关联的币种市场
          symbol: null,                  // 关联的交易对
          create_at: null,               // 记录时间
          is_public: null,               // 是否公开
          direction: '',                 // 交易方向
          transaction_time: '',          // 交易时间
          transaction_price: '',         // 交易价格
          transaction_amount: '',        // 交易数量
        },
        options: [{
          value: '1',
          label: '交易复盘'
        }, {
          value: '2',
          label: '自建'
        }],
        isEdit: true
      }
    },
    watch: {
      bsList(newValue, oldValue) {
        this.initForm()
      }
    },
    created() {
      this.initForm()

      this.getEventData()
    },
    methods: {
      getEventData() {
        eventBus.$on('showBSDetailEvent', data => {
          this.dialogFormVisible = true
        })
      },
      handleClose(done) {
        done()
        this.dialogFormVisible = false
      },
      initForm() {

        let dataSource = null
        let bsData = JSON.parse(this.bsList)

        if (this.BSTimeAry.length <= 0) {
          dataSource = bsData.map(item => {
            item.create_at = xDateFormat(item.create_at)
            return item
          })

          for (let i = 0; i < this.BSDateAry.length; i++) {
            let temp = this.BSDateAry[i]
            for (let j = 0; j < dataSource.length; j++) {
              if (temp === Number(dataSource[j].create_at) && dataSource[j].symbol === this.CurrentBSSymbol) {
                this.formParam = dataSource[j]
              }
            }
          }
          this.formParam.type === 1 ? this.formParam.type = '交易复盘' : null
          this.formParam.direction == 1 ? this.formParam.direction = '1' : this.formParam.direction = '2'
          this.formParam.transaction_time = dateFormat(this.formParam.transaction_time)
          this.formParam.is_public === 1 ? this.formParam.is_public = true : this.formParam.is_public = false  // 是否公开（1公开，0不公开）

        } else { // 精确到分钟
          dataSource = bsData.map(item => {
            item.create_at = xDateFormat(item.create_at) + xTimeFormat(item.create_at)
            return item
          })

          for (let i = 0; i < this.BSDateAry.length; i++) {
            let temp = this.BSDateAry[i] + '' + this.BSTimeAry[i]
            for (let j = 0; j < dataSource.length; j++) {
              if (temp === dataSource[j].create_at && dataSource[j].symbol === this.CurrentBSSymbol) {
                this.formParam = dataSource[j]
              }
            }
          }
          this.formParam.type === 1 ? this.formParam.type = '交易复盘' : null
          this.formParam.direction == 1 ? this.formParam.direction = '1' : this.formParam.direction = '2'
          this.formParam.transaction_time = dateFormat(this.formParam.transaction_time)
          this.formParam.is_public === 1 ? this.formParam.is_public = true : this.formParam.is_public = false

        }
      }
    }
  }
</script>
