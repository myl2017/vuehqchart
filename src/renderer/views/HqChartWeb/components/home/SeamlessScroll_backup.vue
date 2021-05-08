<template>
  <div class="seamless-scroll-wrap">
    <div class="seamless-scroll" ref='seamlessScroll' @mouseover="stopScroll" @mouseout="startScroll">
      <ul>
        <li v-for="(item, index) in list" :key="index">
          <div>{{item.post_date}}</div>
          <div>{{ item.title }}</div>
        </li>
      </ul>
      <ul>
        <li v-for="(item, index) in list" :key="index+item.id">
          <div>{{item.post_date}}</div>
          <div>{{ item.title }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { getAfficheList } from '@/api'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'SeamlessScroll',
    data() {
      return {
        scrollW: 0, // 记录滚动到哪了
        listParam: {
          token: null
        },
        list: null
      }
    },
    created() {
      // 阻止重复请求
      if (this.list && this.list.length > 0) return
      this.listParam.token = getToken()
      this.fetchData()
    },
    mounted() {
      this.scroll()
    },
    methods: {
      fetchData() {
        getAfficheList(this.listParam).then(res => {
          this.list = res.data
          this.list.map(item => {
            item.post_date = this.timeFormat(item.post_date)
            return item
          })
        })
      },
      timeFormat(ts) {
        const date = new Date(ts)
        const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return hour + ':' + minute + ':' + second
      },
      stopScroll() { // 鼠标悬停 停止滚动
        clearInterval(this.scrollTime)
      },
      startScroll() { // 鼠标移开 接着滚动
        var target = this.$refs.seamlessScroll
        this.scrollW = target.offsetLeft
        this.scroll()
      },
      scroll() { // 循环滚动
        var target = this.$refs.seamlessScroll
        var initLeft = 0
        if (this.scrollW < 0) {
          initLeft = this.scrollW * (-1)
        }
        this.scrollTime = setInterval(function() {
          initLeft++
          if (initLeft >= target.offsetWidth / 2) {
            initLeft = 0
          }
          target.style.left = '-' + initLeft + 'px'
        }, 20)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .seamless-scroll-wrap {
    width: 100%;
    height: 40px;
    display: flex;
    margin-left: 20px;
    margin-right: 20px;
    overflow: hidden;
    position: relative;

    .seamless-scroll {
      position: absolute;
      white-space: nowrap;
      display: flex;
      flex-direction: row;

      ul {
        display: flex;
        flex-direction: row;

        li {
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          display: flex;
          flex-direction: row;
          white-space: nowrap;
          margin-right: 100px;

          div:nth-child(2) {
            margin-left: 20px;
          }
        }
      }
    }
  }
</style>
