<template>
  <scroll-bar class="scroll-ct">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'
  import ScrollBar from '@/components/ScrollBar'

  export default {
    components: { SidebarItem, ScrollBar },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      routes() {
        return this.$router.options.routes
      },
      isCollapse() {
        return !this.sidebar.opened
      },
      created() {
        console.log(this.$router.options.routes)
      }
    }
  }
</script>
<style lang="scss">
  .scroll-ct {
    a[href="#/usermanage/msgmanage"] {
      display: none!important;
    }
    a[href="#/contentmanage/detail"] {
      display: none!important;
    }
  }
</style>
