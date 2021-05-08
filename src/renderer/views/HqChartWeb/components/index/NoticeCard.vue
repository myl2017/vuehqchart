<template>
  <div class="noticecard-wrapper" id="noticeCard">
    <section class="left-notice">
      <ol class="title-bar">
        <li class="first-item" v-if="this.isCollapse">资讯</li>
        <li></li>
      </ol>
      <transition name="slide">
        <ul class="list" v-show="isCollapse">
          <li v-if="list&&list.length<=0" class="empty-tips">暂无数据</li>
          <li v-for="(item,index) in list" :key="`${item.title}`+index" @click="onShowInfo(item)" v-else>
            <div class="time">{{item.post_date}}</div>
            <div class="info-text">{{item.title}}</div>
          </li>
        </ul>
      </transition>
    </section>
    <section class="right-notice">
      <ol class="title-bar collapse-bar">
        <li class="first-item" v-if="this.isCollapse">笔记</li>
        <li class="sec-item">
          <div class="write" @click="onAdd">写笔记</div>
          <div class="collapse" @click="onManage">管理</div>
        </li>
      </ol>
      <transition name="slide">
        <div class="listv2" v-show="isCollapse">
          <el-table :data="notesTable" height="200" v-el-table-infinite-scroll="load" class="clear-table-border" v-if="isUpdateTable">
            <el-table-column prop="type" label="目录" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="symbol" label="品种" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="create_at" label="记录日期" align="center" width="200" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="left" width="70">
              <template slot-scope="scope">
                <el-button plain size="mini" class="custom-look-btn" @click="onDetail(scope.row,0)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </transition>
    </section>

    <!-- 资讯信息弹框 -->
    <InfoDialog v-if="infoVisible" :currentInfo="currentInfo"/>

    <!-- 添加&编辑 笔记 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%" class="custom-dialog write-note-dialog" :before-close="onClose">
      <el-form :label-position="labelPosition" label-width="80px" :model="formParam" :rules="rules" ref="ruleForm" :disabled="Boolean(isEdit)">
        <el-row>
          <el-col :span="14">
            <el-form-item label="标题:" prop="title">
              <el-input size="small" v-model="formParam.title" class="custom-input"></el-input>
            </el-form-item>
            <el-form-item label="分类:" prop="type">
              <el-select v-model="formParam.type" @change="onChangeType">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交易币种:" prop="symbol">
              <el-autocomplete v-model="formParam.symbol" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect" @blur="hanldeInput">
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="内容:" prop="content">
              <el-input type="textarea" v-model="formParam.content" :rows="6" class="custom-input"></el-input>
            </el-form-item>
            <el-form-item label="公开发布:">
              <div class="col-wrap">
                <el-switch v-model="formParam.is_public" active-color="#409eff" inactive-color="#dddddd"></el-switch>
                <div class="public-tips"><img src="../../../../assets/icons/common/tips.png" alt=""/><span>选择公开发布, 将有机会被推荐到网站首页</span></div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <template v-if="this.formParam.type === '交易复盘' || this.formParam.type === '1'">
              <el-form-item label="交易时间:" prop="transaction_time" required>
                <el-date-picker size="small" v-model="formParam.transaction_time" type="date" placeholder="选择日期" value-format="timestamp"
                                format="yyyy-MM-dd HH:mm"></el-date-picker>
              </el-form-item>
              <el-form-item label="买卖方向:" prop="direction" required>
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
                  <el-input size="small" type="number" v-model.number="formParam.transaction_amount" min="0" class="custom-input"></el-input>
                  <div class="current-market"></div>
                </div>
              </el-form-item>
            </template>
          </el-col>
        </el-row>
        <el-form-item>
          <!-- <el-button size="small" @click="resetForm('ruleForm')" v-if="!(title === '笔记详情')">取 消</el-button> -->
          <el-button size="small" type="primary" @click="editForm('ruleForm')" :disabled="isOk" v-if="showEdit">确 定</el-button>
          <el-button size="small" type="primary" @click="submitForm('ruleForm')" :disabled="isOk" v-if="isAdd">创 建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 笔记管理 -->
    <el-dialog title="笔记管理" :visible.sync="dialogManageVisible" width="40%" class="custom-dialog note-manage-dialog" :before-close="handleClose">
      <el-row class="row-gap">
        <el-col :span="4" class="col-gap">
          <el-input size="small" v-model="searchParam.code" placeholder="按币种查询"></el-input>
        </el-col>
        <el-col :span="4" class="col-gap">
          <el-input size="small" v-model="searchParam.title" placeholder="按标题查询"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch" :disabled="isOk">搜索笔记</el-button>
        </el-col>
        <el-col :span="1">
          <el-button size="small" plain @click="onSyncNote" :loading="isOk" :disabled="isOk">同步笔记</el-button>
        </el-col>
      </el-row>
      <el-table :data="noteList" border id="noteTable" v-if="isUpdateTable">
        <el-table-column property="type" label="目录"></el-table-column>
        <el-table-column property="title" label="标题" show-overflow-tooltip></el-table-column>
        <el-table-column property="symbol" label="品种" width="140"></el-table-column>
        <el-table-column property="create_at" label="记录日期" width="160"></el-table-column>
        <el-table-column label="操作" align="left" width="230">
          <template slot-scope="scope">
            <el-button plain size="mini" class="custom-look-btn" @click="onDetail(scope.row,1)">查看</el-button>
            <el-button type="primary" plain size="mini" class="custom-edit-btn" @click="onEdit(scope.row)" :disabled="isOk">编辑</el-button>
            <el-button type="danger" plain size="mini" class="custom-del-btn" @click="onDelete(scope.row)" :disabled="isOk">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="row-align">
        <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next"
                       :total="total"></el-pagination>
      </el-row>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="dialogDeleteVisible" width="24%" class="custom-dialog">
      <span>确认要删除该条笔记？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDeleteVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {getInfoList} from '@/api/home.js'
  import {getToken} from '@/utils/auth'
  import eventBus from '@/utils/bus.js'
  import {createNote, getNoteList, editNote, deleteNote, getInfoDetail, getSearch} from '@/api'
  import InfoDialog from '../dialog/InfoDialog'
  import {dateFormat} from '@/utils'
  import {getNoteCount, insertNote, queryNote, updateNote, deleteNoteRow, closeDB} from '@/utils/sqlHelper'
  import {validateNumber} from '@/utils/validate'

  export default {
    name: 'NoticeCard',
    components: {InfoDialog},
    props: {
      CurrentStock: {
        type: Object,
        required: true
      },
      collapseSwitch: {
        type: Boolean,
        required: true
      }
    },
    data() {
      var validateType = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择笔记类型'))
        } else {
          callback()
        }
      }
      var validateTitle = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入标题'))
        } else {
          callback()
        }
      }
      var validateContent = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入内容'))
        } else {
          callback()
        }
      }
      var validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入关联币种'))
        } else {
          callback()
        }
      }
      var validateTPrice = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入交易价格'))
        } else {
          if (!validateNumber(value)) {
            callback(new Error('请输入正确数字'))
          } else {
            callback()
          }
        }
      }
      var validateTAmount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入交易数量'))
        } else {
          if (Number(value) < 0) {
            callback(new Error('交易数量不能小于零'))
          } else {
            callback()
          }
        }
      }
      return {
        params: {
          token: null,
          id: null
        },
        currentInfo: {
          content: null,
          cover: null,
          desc: null,
          id: null,
          is_top: null,
          label: null,
          original_link: null,
          post_date: null,
          source: {from: null, name: null, link: null},
          status: null,
          title: null,
          topic: null
        },
        infoVisible: false,

        listParam: {
          token: null,
          stock: null
        },
        list: null,

        notesTable: [],

        noteParam: {
          token: null,
          code: '',
          title: '',
          limit: 10,
          page: 0
        },
        noteList: [],
        total: 2,
        totalPage: 0,

        isCollapse: true,

        dialogFormVisible: false,
        formParam: {
          token: null,
          id: '',
          type: '',                      // 分类(1 交易复盘, 2 自建)
          title: '',                     // 标题
          content: '',                   // 内容
          code: '',                      // 关联的币种名称
          market: '',                    // 关联的币种市场
          symbol: '',                    // 关联的交易对
          create_at: '',                 // 记录时间
          is_public: false,              // 是否公开
          direction: '',                 // 交易方向
          transaction_time: '',          // 交易时间
          transaction_price: '',         // 交易价格
          transaction_amount: '',        // 交易数量
          association_type: ''           // 关联币的类型
        },
        rules: {
          type: [
            {required: true, validator: validateType, trigger: 'change'}
          ],
          title: [
            {required: true, validator: validateTitle, trigger: 'blur'}
          ],
          content: [
            {required: true, validator: validateContent, trigger: 'blur'}
          ],
          symbol: [
            {required: true, validator: validateCode, trigger: 'blur'}
          ],
          direction: [
            {required: true, message: '请至少选择一个交易方向', trigger: 'change'}
          ],
          transaction_time: [
            {type: 'date', required: true, message: '请选择交易时间', trigger: 'change'}
          ],
          transaction_price: [
            {required: true, validator: validateTPrice, trigger: 'blur'}
          ],
          transaction_amount: [
            {required: true, validator: validateTAmount, trigger: 'blur'}
          ]
        },
        isOk: false,

        title: '添加笔记',
        options: [{
          value: '1',
          label: '交易复盘'
        }, {
          value: '2',
          label: '自建'
        }],

        labelPosition: 'left',

        dialogManageVisible: false,

        currentPage: 1,
        allOption: [],
        inputData: {
          code: null,
          market: null,
          symbol: null,
          value: null
        },
        timeout: null,
        isEdit: false,
        showEdit: false,
        isAdd: false,

        searchParam: {
          code: '',
          title: ''
        },

        dialogDeleteVisible: false,
        deleteParam: {
          token: null,
          id: null
        },

        //sqlite3 使用参数
        noteTableCount: 0,
        intervalID: null,
        isLock: false,

        sum: 1, // 服务器同步到本地 分页总数
        syncCloundData: null,
        syncLocalData: null,
        bsData: [],
        isUpdateTable: true,

        timeoutV2: null,
        diffUpdaterTable: 0
      }
    },
    watch: {
      collapseSwitch: (newValue, oldValue) => {
        this.isCollapse = newValue
        eventBus.$emit('updateChart', this.isCollapse)
      }
    },
    created() {
      this.listParam.token = getToken()
      this.formParam.token = getToken()

      this.fetchData()
      this.getEventData()

      this.getTableCount()
      this.fetchOption()

    },
    methods: {
      getTableCount() { // 获取表总记录数
        getNoteCount().then(res => {
          this.noteTableCount = res[0].count
          this.total = res[0].count
          this.totalPage = Math.ceil(res[0].count / this.noteParam.limit)

          this.getDataSource()

        })
      },
      getDataSource() {
        if (this.noteTableCount > 0) {
          this.noteParam.page = 1
          this.fetchSQLite3Note()
        } else { // 笔记表 为空
          this.initListData()
          this.initLocalNoteTable()
        }
      },
      initListData() {
        this.noteParam.token = getToken()
        this.noteParam.page = 1
        getNoteList(this.noteParam).then(res => {
          this.notesTable = res.data.list && res.data.list.map(item => {
            switch (item.type) {
              case 1:
                item.type = '交易复盘'
                break
              case 2:
                item.type = '自建'
                break
            }
            item.create_at = dateFormat(item.create_at)
            return item
          })
        })
      },
      fetchSQLite3Note() { // 封装列表获取
        this.notesTable = []
        queryNote(this.noteParam).then(res => {

          this.bsData = JSON.stringify(res)

          this.notesTable = res && res.map(item => {
            switch (item.type) {
              case 1:
                item.type = '交易复盘'
                break
              case 2:
                item.type = '自建'
                break
            }
            item.create_at = dateFormat(item.create_at)
            return item
          })

          eventBus.$emit('bsData', this.bsData)

        })
      },
      getSQLite3NoteList() { // 封装列表获取
        queryNote(this.noteParam).then(res => {
          this.noteList = res && res.map(item => {
            switch (item.type) {
              case 1:
                item.type = '交易复盘'
                break
              case 2:
                item.type = '自建'
                break
            }
            item.create_at = dateFormat(item.create_at)
            return item
          })
          this.total = this.noteList.length
        })
      },
      initLocalNoteTable() {
        this.noteParam.page = 0
        this.isOk = true
        this.intervalID = setInterval(() => {
          if (this.noteParam.page < this.sum) { // 笔记总页数
            if (this.isLock) return
            this.isLock = true

            this.noteParam.token = getToken()
            this.noteParam.page += 1
            getNoteList(this.noteParam).then(res => {
              this.sum = Math.ceil(res.data.count / this.noteParam.limit)
              this.noteList = this.noteList.concat(res.data.list)
              this.total = res.data.count
              this.isLock = false
            })
          } else {
            insertNote(this.noteList)
            this.isOk = false
            this.noteTableCount = this.total
            this.totalPage = this.sum
            clearInterval(this.intervalID)
          }
        }, 2000)
      },

      getEventData() {
        eventBus.$on('closeInfo', (data) => {
          this.infoVisible = false
        })

        eventBus.$on('updateChartV2', data => {
          this.isCollapse = data
        })
      },
      onShowInfo(item) {
        this.infoVisible = true
        this.params.id = item.id
        this.fetchDataV2()
      },
      fetchDataV2() {
        this.params.token = getToken()
        getInfoDetail(this.params).then(res => {
          if (!res.data) return
          this.currentInfo = res.data
        })
      },
      fetchData() {
        this.listParam.stock = this.CurrentStock.name
        getInfoList(this.listParam).then(res => {
          this.list = res.data
        })
      },

      fetchNoteData() {
        this.noteParam.token = getToken()
        getNoteList(this.noteParam).then(res => {
          this.noteList = res.data.list && res.data.list.map(item => {
            switch (item.type) {
              case 1:
                item.type = '交易复盘'
                break
              case 2:
                item.type = '自建'
                break
            }
            item.create_at = dateFormat(item.create_at)
            return item
          })
          this.total = res.data.count
          this.totalPage = Math.ceil(res.data.count / this.noteParam.limit)
        })
      },
      load() {
        if (this.noteTableCount > 0) {  // 从本地sqlite3数据库中获取
          if (this.noteParam.page < this.totalPage) {
            this.noteParam.page += 1
            queryNote(this.noteParam).then(res => {
              let datas = res && res.map(item => {
                switch (item.type) {
                  case 1:
                    item.type = '交易复盘'
                    break
                  case 2:
                    item.type = '自建'
                    break
                }
                item.create_at = dateFormat(item.create_at)
                return item
              })
              this.notesTable = this.notesTable.concat(datas)
            })
          } else {
          }
        } else {
          if (this.noteParam.page < this.totalPage) {
            this.noteParam.page += 1
            getNoteList(this.noteList).then(data => {
              this.noteList = this.noteList.concat(data)
            })
          }
        }
      },
      onSearch() {
        this.noteParam.page = 1
        this.noteParam.code = this.searchParam.code
        this.noteParam.title = this.searchParam.title
        if (this.noteTableCount > 0) {
          this.getSQLite3NoteList()
        } else {
          this.fetchNoteData()
        }
      },
      onSyncNote() {
        // this.getTableCount()
        if (this.noteList && this.noteList.length > 0) {
          this.$message.warning('已有数据信息不再进行同步')
          return
        } else {
          this.noteParam.page = 0
          this.initLocalNoteTable()
        }
      },
      onClose() {
        this.$refs['ruleForm'].resetFields()
        this.dialogFormVisible = false
        this.diffUpdaterTable === 0 ? null : this.getSQLite3NoteList()
      },
      handleClose() {
        this.dialogManageVisible = false
        // this.fetchSQLite3Note()
      },
      onDetail(item, diff) {
        this.title = '笔记详情'

        this.isEdit = true
        this.showEdit = false
        this.isAdd = false

        this.dialogFormVisible = true
        this.diffUpdaterTable = diff

        this.formParam = item
        if (this.formParam.transaction_time.toString().length === 10) {
          this.formParam.transaction_time = this.formParam.transaction_time * 1000
        } else if (this.formParam.transaction_time.toString().length > 13) {
          this.formParam.transaction_time = this.formParam.transaction_time / 1000
        }

        this.formParam.direction === 1 ? this.formParam.direction = '1' : this.formParam.direction = '2'
        if (this.formParam.is_public === 1) { // 是否公开（1公开，0不公开）
          this.formParam.is_public = true
        }
        if (this.formParam.is_public === 0) { // 是否公开（1公开，0不公开）
          this.formParam.is_public = false
        }
      },
      onEdit(item) {
        this.title = '编辑笔记'

        this.isEdit = false
        this.isAdd = false
        this.showEdit = true

        this.dialogFormVisible = true
        this.formParam = item
        if (item.transaction_time.toString().length === 10) {
          this.formParam.transaction_time = item.transaction_time * 1000
        } else if (item.transaction_time.toString().length > 13) {
          this.formParam.transaction_time = item.transaction_time / 1000
        }

        this.formParam.direction === 1 ? this.formParam.direction = '1' : this.formParam.direction = '2'

        if (this.formParam.is_public === 0) { // 是否公开（1公开，0不公开）
          this.formParam.is_public = false
        }
        if (this.formParam.is_public === 1) {
          this.formParam.is_public = true
        }
      },
      onDelete(item) {
        this.deleteParam.id = item.id
        this.dialogDeleteVisible = true
      },
      confirmDelete() {
        this.deleteParam.token = getToken()
        this.isOk = true
        if (this.noteTableCount > 0) {
          deleteNoteRow(this.deleteParam).then(res => {
            this.$message({
              message: res,
              type: 'success'
            })
            this.isOk = false
            this.dialogDeleteVisible = false
            this.noteParam.page = 1
            this.getSQLite3NoteList()
            this.fetchSQLite3Note()
          }).catch(err => {
            this.isOk = false
            this.dialogDeleteVisible = false
            this.$message.error('删除出错')
          })
        } else {
          deleteNote(this.deleteParam).then(res => {
            if (res.code === 0) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
            } else {
              this.$message.error(res.msg)
            }
            this.isOk = false
            this.dialogDeleteVisible = false
            this.noteParam.page = 1
            this.fetchNoteData()
          }).catch(err => {
            this.isOk = false
            this.dialogDeleteVisible = false
            this.$message.error('删除出错')
          })
        }
      },
      onAdd() {
        this.title = '添加笔记'

        this.isEdit = false
        this.showEdit = false
        this.isAdd = true

        this.formParam = {
          token: null,
          id: '',
          type: '',
          title: '',
          content: '',
          code: '',
          market: '',
          symbol: '',
          create_at: '',
          is_public: false,
          direction: '',
          transaction_time: '',
          transaction_price: '',
          transaction_amount: '',
        }

        this.dialogFormVisible = true
      },
      onManage() {
        this.dialogManageVisible = true
        this.noteParam.page = 1
        this.getSQLite3NoteList()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.dialogFormVisible = false
      },
      onChangeType(value) {
        this.formParam.type = value
      },
      editForm(formName) {
        // 默认选择 处理
        this.formParam.token = getToken()

        switch (this.formParam.type) {
          case '交易复盘':
            this.formParam.type = 1
            break
          case '自建':
            this.formParam.type = 2
            break
        }

        this.formParam.direction === '买' ? this.formParam.direction = 1 : null

        this.formParam.transaction_time !== '' ? this.formParam.transaction_time = new Date(this.formParam.transaction_time).getTime() : null

        this.formParam.is_public === true ? this.formParam.is_public = 1 : this.formParam.is_public = 0
        this.formParam.create_at = Math.round(new Date() / 1000) // 时间戳


        this.isOk = true

        if (this.noteTableCount > 0) {
          updateNote(this.formParam).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.isOk = false
            this.resetForm(formName)

            // this.dialogManageVisible = false

            this.noteParam.page = 1
            // 移除组件
            this.isUpdateTable = false
            this.timeoutV2 = setTimeout(() => {
              // this.fetchSQLite3Note()
              this.getSQLite3NoteList()
              this.isUpdateTable = true
              eventBus.$emit('addBSIcon', this.formParam)
              clearTimeout(this.timeoutV2)
            }, 600)
          }).catch(err => {
            this.isOk = false
            this.$message.error('修改出错')
          })
        } else {
          editNote(this.formParam).then(res => {
            if (res.code === 0) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
            } else {
              this.$message.error(res.msg)
            }
            this.isOk = false
            this.resetForm(formName)
            this.noteParam.page = 1
            this.fetchNoteData()
          }).catch(err => {
            this.isOk = false
            this.$message.error('提交信息出错')
          })
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isOk = true

            // 默认选择 处理
            this.formParam.token = getToken()
            this.formParam.type === '交易复盘' ? this.formParam.type = 1 : null
            this.formParam.direction === '买' ? this.formParam.direction = 1 : null

            this.formParam.transaction_time !== '' ? this.formParam.transaction_time = new Date(this.formParam.transaction_time).getTime() / 1000 : null

            this.formParam.is_public === true ? this.formParam.is_public = 1 : this.formParam.is_public = 0
            this.formParam.create_at = Math.round(new Date() / 1000) // 时间戳
            this.formParam.association_type === undefined ? this.formParam.association_type = '' : null

            if (this.noteTableCount > 0) {
              insertNote([this.formParam], 'single').then(res => {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.isOk = false
                this.dialogFormVisible = false

                // 移除组件
                this.isUpdateTable = false
                this.timeoutV2 = setTimeout(() => {
                  this.fetchSQLite3Note()
                  this.isUpdateTable = true
                  eventBus.$emit('addBSIcon', this.formParam)
                  clearTimeout(this.timeoutV2)
                }, 600)
              }).catch(err => {
                this.isOk = false
                this.resetForm(formName)
                this.$message.error('提交信息出错')
              })
            } else {
              createNote(this.formParam).then(res => {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.isOk = false
                this.resetForm(formName)
                this.noteParam.page = 1
                this.fetchNoteData()
              })
            }
          } else {
            this.$message.error('请填写必填信息')
            return false
          }
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.noteParam.page = val
        if (this.noteTableCount > 0) {
          this.getSQLite3NoteList()
        } else {
          this.fetchNoteData()
        }
      },
      fetchOption() {
        this.allOption = []
        const PARAM = {token: getToken(), keyword: '*'}
        getSearch(PARAM).then(res => {
          res.data && res.data.forEach(item => {
            let objItem = {code: item.code, market: item.market, symbol: item.symbol, value: item.symbol, association_type: item.type}
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
        }, 500)
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect(item) {
        this.formParam.code = item.code
        this.formParam.market = 'USDT'   //item.market
        this.formParam.symbol = item.symbol
        this.formParam.association_type = item.association_type
      },
      hanldeInput(item) {
        let restaurants = this.allOption
        let result = restaurants.filter(this.createStateFilter(item.target.value))
        this.inputData = result[0]
        this.formParam.code = item.code
        this.formParam.market = result[0].market
        this.formParam.symbol = result[0].symbol
      }
    },
    destroyed() {
      if (this.intervalID) clearInterval(this.intervalID)
    }
  }
</script>

<style lang="scss" scoped>
  /** {*/
  /*  outline: 1px solid red;*/
  /*}*/

  .noticecard-wrapper {
    display: flex;

    .title-bar {
      background: #DBDBDB;
      height: 24px;
      display: flex;

      li.first-item {
        width: 122px;
        border: 2px solid rgba(233, 233, 233, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: $fontSize14;
        background: #CCCCCC;
        margin-right: 2px;
      }

      li:nth-child(2) {
        flex-grow: 1;
      }
    }

    .left-notice {
      flex-grow: 1;
      margin-right: 4px;

      .list {
        height: 205px;
        overflow-y: hidden;
        padding: 8px 54px 0 25px;

        > li {
          font-size: $fontSize14;
          height: 22px;
          // margin-bottom: 13px;    //fix bug 757 xxc
          display: flex;
          justify-content: space-between;
          align-items: center;

          .time {
            margin-right: 32px;
            white-space: nowrap;
          }

          .info-text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
            flex-grow: 1;
          }
        }

        > li:hover {
          color: #FFAA00;
          position: relative;
          cursor: pointer;
        }

        > li:hover::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 2px;
          width: 100%;
          height: 0;
          border-bottom: 1px solid rgba(255, 170, 0, 1);
        }

        .empty-tips {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        li.empty-tips:hover {
          color: #DCDCDC;
        }
      }
    }

    .right-notice {
      width: 45%;

      .collapse-bar {
        position: relative;
        background-color: green;

        .write {
          position: absolute;
          top: 50%;
          right: 80px;
          transform: translateY(-50%);
          font-size: $fontSize14;
          color: #F66C00;
        }

        .collapse {
          width: 32px;
          height: 22px;
          line-height: 22px;
          font-size: $fontSize14;
          color: #F66C00;
          position: absolute;
          top: 50%;
          right: 30px;
          transform: translateY(-50%);
        }
      }

      .listv2 {
        padding-left: 10px;

        .empty-tips {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding-top: 12%;
        }
      }

    }
  }
</style>
