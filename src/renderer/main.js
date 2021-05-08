import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import ImageViewer from '@/components/ImageViewer'
import elTableInfiniteScroll from 'el-table-infinite-scroll'

import App from './App'
import router from './router'
import store from './store'

import '@/icons'    // icon

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(ElementUI, {locale})
Vue.use(ImageViewer)
Vue.use(elTableInfiniteScroll)

Vue.config.keyCodes = {
  v: 86,
  f5: 116,
  // camelCase 不可用
  mediaPlayPause: 179,
  // 取而代之的是 kebab-case 且用双引号括起来
  'media-play-pause': 179,
  up: [38, 87]
}
Vue.config.productionTip = false

new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')
