<template>
  <div class="tabbar-wrapper">
    <div class="tab-item tab-bg" @click="handleSelected(1)" :class="{'active': this.selectedIndex === 1}">
      <div class="icon-all"></div>
    </div>
    <div class="tab-item" @click="handleSelected(2)" :class="{'active': this.selectedIndex === 2}">
      <img src="../../../../assets/icons/black/buy.png" alt=""/>
    </div>
    <div class="tab-item" @click="handleSelected(3)" :class="{'active': this.selectedIndex === 3}">
      <img src="../../../../assets/icons/black/sell.png" alt=""/>
    </div>
    <el-dropdown class="custom-dropdown" v-show="false">
      <el-button class="custom-btn" type="primary">1<i class="el-icon-arrow-down el-icon--right"></i></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>1</el-dropdown-item>
        <el-dropdown-item>2</el-dropdown-item>
        <el-dropdown-item>3</el-dropdown-item>
        <el-dropdown-item>4</el-dropdown-item>
        <el-dropdown-item>5</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import eventBus from '@/utils/bus'

  export default {
    name: 'TabBar',
    data() {
      return {
        selectedIndex: 1 // 默认选中全部
      }
    },
    methods: {
      handleSelected(index) {
        this.selectedIndex = index
        console.log('diff:::', index)
        switch (index) {
          case 1:
            eventBus.$emit('update:rows', 'default')
            break
          case 2:
            eventBus.$emit('update:rows', 'buy')
            break
          case 3:
            eventBus.$emit('update:rows', 'sell')
            break
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .custom-theme {
    .tabbar-wrapper {
      background: #121212;

      .tab-bg {
        > .icon-all {
          width: 24px;
          height: 20px;
          background: url("../../../../assets/icons/black/all.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .tabbar-wrapper {
    display: flex;

    .tab-bg {
      > .icon-all {
        width: 24px;
        height: 20px;
        background: url("../../../../assets/icons/white/allv2.png") no-repeat;
        background-size: 100% 100%;
      }
    }

    .tab-item {
      padding: 6px;
      margin-right: 10px;
      cursor: pointer;

      > img {
        width: 24px;
        height: 20px;
      }
    }

    .tab-item.active {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 5px;
    }

    .custom-dropdown {
      display: flex;
      align-items: center;

      .custom-btn {
        padding: 8px 10px;
        background: #DC6405;
        border: none;
      }
    }
  }
</style>
