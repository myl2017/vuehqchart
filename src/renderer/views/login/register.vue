<template>
  <div class="register-wrapper">
    <div class="tools">
      <img src="../../assets/icons/close.png" alt="" @click="handleClose"/>
    </div>
    <ul class="tabs">
      <li class="tab-item" v-for="(tab,index) in tabs" @click="toggle(index,tab.view)" :class="{active:active==index}" :key="index">
        <span :class="`tab${index}`">{{tab.type}}</span>
      </li>
    </ul>
    <div class="panels">
      <div class="panel" v-if="currentView==='手机'">
        <PhonePanel></PhonePanel>
      </div>
      <div class="panel top-gap" v-if="currentView==='用户名'">
        <UserNamePanel></UserNamePanel>
      </div>
    </div>
  </div>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import PhonePanel from './components/PhonePanel'
  import UserNamePanel from './components/UserNamePanel'

  export default {
    name: 'register',
    components: {UserNamePanel, PhonePanel},
    data() {
      return {
        active: 0,
        currentView: '手机',
        tabs: [
          {
            type: '手机',
            view: '手机'
          },
          {
            type: '用户名',
            view: '用户名'
          }
        ]
      }
    },
    methods: {
      handleClose() {
        this.$router.push({path: '/login'})
      },
      toggle(index, view) {
        this.active = index
        this.currentView = view
      }
    }
  }
</script>

<style lang="scss" scoped>
  /** {*/
  /*  outline: 1px solid red;*/
  /*}*/

  .register-wrapper {
    width: 736px;
    height: 470px;
    background: #eee;
    box-shadow: 0px 3px 6px rgba(10, 107, 151, 0.16);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    > .tools {
      position: absolute;
      top: 24px;
      right: 19px;
      z-index: 4;

      > img {
        width: 18px;
        height: 18px;
        margin-left: 21px;
      }
    }

    .tabs {
      height: 71px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;

      .tab-item {
        height: 71px;
        position: absolute;

        span {
          height: 28px;
          font-size: 20px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 28px;
          color: rgba(255, 255, 255, 1);
        }

        .tab0 {
          position: absolute;
          top: 50%;
          left: 154px;
          transform: translateY(-50%);
          width: 40px;
          opacity: 1;
        }

        .tab1 {
          position: absolute;
          top: 50%;
          right: 154px;
          transform: translateY(-50%);
          width: 60px;
          opacity: 0.5;
        }
      }

      .tab-item:first-child {
        background: transparent url("../../assets/icons/tab-def-left.png") no-repeat;
        background-size: 100% 100%;
        width: 500px;
        top: 0;
        left: 0;
        z-index: 2;
      }

      .tab-item:nth-child(2) {
        background: transparent url("../../assets/icons/tab-def-right.png") no-repeat;
        background-size: 100% 100%;
        width: 585px;
        top: 0;
        right: 0;
        z-index: 1;
      }

      .tab-item:first-child.active {
        background: transparent url("../../assets/icons/tab-sel-left.png") no-repeat;
        background-size: 100% 100%;
        z-index: 3;
      }

      .tab-item:nth-child(2).active {
        background: transparent url("../../assets/icons/tab-sel-right.png") no-repeat;
        background-size: 100% 100%;
        z-index: 3;
      }
    }

    .panels {
      flex-grow: 1;
      background: #fff;
      border-radius: 0 0 20px 20px;
    }

    .top-gap {
      margin-top: 30px;
    }
  }
</style>
