<template>
  <div id="SearchBox" class="search-wrapper" :class="isOpen===false ? 'hide':''">
    <div class="title">
      <div @click="close">
        <img src="../../../../assets/icons/dialog/miniclose.png" alt=""/>
      </div>
    </div>
    <ul id="searchResult" class="search-result">
      <li v-for="(item,index) in reslist" :key="index" :class="{active:index === selectedIndex}"
          v-if="`${index === selectedIndex ? createSession.setItem('selectedItem',JSON.stringify(item)):null}`" @click="onSelected(item,index)">
        <img class="result-icon" src="../../../../assets/icons/common/xh.png" v-show="item.type === ''">
        <img class="result-icon" src="../../../../assets/icons/common/qh.png" v-show="futuresArray.indexOf(item.type) >= 0">
        <div class="display_name">{{item.display_name}}</div>
      </li>
    </ul>
    <div class="search-box">
      <input id="searchKeywords" name="search" type="text" :value="keywords" @input="onValueChanged($event.target.value)" :placeholder="this.placeholder" autocomplete="off"
             autofocus v-focus/>
      <!-- <img src="../../../../assets/clear.png" alt="" v-show="isClear" @click="handleClear"> -->
    </div>
  </div>
</template>

<script>
  import {getSearch} from '@/api'
  import {getToken} from '../../../../utils/auth'
  import eventBus from '@/utils/bus'

  export default {
    name: 'SearchBox',
    props: {
      placeholder: {
        type: String
      },
      keyValue: {
        type: String
      }
      // selectedIndex: {
      //   type: Number
      // },
      // counts: {
      //   type: Number
      // }
    },
    data() {
      return {
        timer: null,
        keywords: null,
        newlist: [],
        reslist: [], // 模糊搜索结果
        isClear: false,
        isOpen: true,
        selectedIndex:null,
        selected:null,  
        counts:null,
        count: 0,
        createSession: window.sessionStorage,
        futuresArray: ['swap', 'contract']
      }
    },
    directives: { // 注册局部指令，组件中也接受一个 directives 的选项
      focus: {
        // 指令的定义
        inserted: function (el, {value}) {
          if (value) {
            $(el).find('input').focus()// 聚焦输入框
            // el.focus()
          }
        }
      }
    },
    watch: {
      keyValue(newval, oldval) {
        console.log('watchP:::', this.keywords)
        if (this.keywords === null) {
          this.keywords = newval
        }
      }
    },
    created() {
      this.getEventData()
    },
   mounted() {
      window.addEventListener('keydown', (e) => {
        // 键盘上下键
        if (e.keyCode === 38) {
          if (this.selectedIndex > 0) {
            this.selectedIndex--
          } else {
            this.selectedIndex = 0
          }
        } else if (e.keyCode === 40) {
          if (this.selectedIndex < this.counts-1) {
            this.selectedIndex++
          } else {
            this.selectedIndex = this.counts-1
          }
        }

        if (e.keyCode === 13) {
          if(this.selected!==this.selectedIndex)
          { //相同就过滤
            this.selected = this.selectedIndex
            let item = this.reslist[this.selectedIndex]
            this.$router.push({path: '/hqdetail', query: {stock: JSON.stringify(item)}})
            eventBus.$emit('searchItem',JSON.stringify(item))
          }
        }
      })
    },
    methods: {
      getEventData() {
        eventBus.$on('updateVisible', data => {
          this.isOpen = data
        })
      },
      close() {
        this.isOpen = false
      },
      onValueChanged(value) {
        if (this.timer) {
          window.clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.timer = null
          const searchValue = value.trim()
          if (searchValue === '') {
            this.isClear = false
            return
          } else {
            this.reslist = []
            getSearch({token: getToken(), keyword: searchValue}).then(res => {
              this.newlist = res.data
              // 字符串方法indexOf
              for (let i = 0; i < this.newlist.length; i++) {
                // 如果字符串中不包含目标字符会返回-1, >= 0 代表包含在其中
                if (this.newlist[i].display_name.indexOf(searchValue.toLowerCase()) >= 0 ||
                  this.newlist[i].display_name.indexOf(searchValue.toUpperCase()) >= 0) { // 且支持大小写模糊匹配
                  this.reslist.push(this.newlist[i])
                  this.counts = this.reslist.length
                  this.$emit('update:counts', this.reslist.length)
                }
              }
            })
            this.isClear = true
            return this.reslist
          }
        }, 400)
        this.keywords = value.trim()
      },
      handleClear() {
        this.keywords = ''
        this.isClear = false
      },
      onSelected(item,index) {
         if(index!==this.selectedIndex)
          {
            this.selectedIndex = index
            this.$router.push({path: '/hqdetail', query: {stock: JSON.stringify(item)}})
            eventBus.$emit('searchItem',JSON.stringify(item))
          }
      },
      handleUp(item) {
        console.log('up:::', item)
      },
      handleDown(item) {
        console.log('down:::', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  /** {*/
  /*  outline: 1px solid red;*/
  /*}*/

  .search-wrapper {
    position: fixed;
    right: 12px;
    bottom: 0;
    border: 1px solid #ccc;
    width: 340px;
    height: 350px;
    background: #fff;
    display: flex;
    flex-direction: column;
    border-radius: 10px;

    .title {
      background: rgb(240, 240, 240);
      color: #666;
      padding: 10px 20px 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 10px 10px 0px 0px;

      > div {
        cursor: pointer;

        > img {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      }
    }

    .search-result {
      background-color: red;
      flex-grow: 1;
      background: #fff;
      width: calc(100% - 8px);
      height: 240px;
      margin-left: auto;
      margin-right: auto;
      overflow-y: auto;

      > li.active {
        background: #dddddd;
      }

      > li {
        color: #333;
        letter-spacing: 1px;
        font: 500 14px/24px Avenir, Helvetica, Arial, sans-serif;
        padding: 2px 0 2px 8px;
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        > img.result-icon {
          width: 32px;
          height: 32px;
        }

        > div.display_name {
          height: 22px;
          font-size: 15px;
          color: rgba(51, 51, 51, 1);
          margin-left: 15px;
        }
      }
    }

    .search-box {
      background: #DDDDDD;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 18px 7px 18px;
      border-radius: 0 0 10px 10px;

      img {
        width: 22px;
        height: 22px;
      }

      input {
        width: 305px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-family: Helvetica;
        color: rgba(142, 142, 147, 1);
        outline: none;
        border: none;
        border-radius: 3px;
        background-color: #fff;
        padding-left: 11px;
      }
    }

  }

  .search-wrapper.hide {
    display: none;
  }
</style>
