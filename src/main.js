/*********
 * 孙梓涵编写
 * SZHOJ v1.0.0
 * 本页面用于全局导入模块
 * ************ */



import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

// import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
// import Vuetify from 'vuetify/lib'
// Vue.use(Vuetify)
// export default new Vuetify({
//   icons: {
//     iconfont: 'mdi', // default - only for display purposes
//   },
// })

import axios from 'axios'
Vue.prototype.axios = axios;
axios.defaults.withCredentials = true;


import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

import VueRouter from 'vue-router'
Vue.use(VueRouter)
Vue.config.productionTip = false


//路由部分
import QuestList from './components/questList';
import TestQueue from './components/testQueue';
import QuestInfo from './components/questionInfo';
import StatusDetail from './components/statusDetail';
import UserInfo from './components/userInfo';
import UserGroup from './components/userGroup';
import CreateQuestion from './components/createQuestion';
import LogIn from './components/login'
import Register from './components/register'
import Contest from './components/contest'
import ContestInfo from './components/contestInfo';
import CreateContest from './components/createContest';

const routes = [
  { path: '/list', component: QuestList },
  { path: '/queue', component: TestQueue },
  { path: '/qinfo/:id', component: QuestInfo },
  { path: '/cinfo/:id', component: ContestInfo },
  { path: '/sdetail/:id', component: StatusDetail },
  { path: '/user/:id', component: UserInfo },
  { path: '/usergroup', component: UserGroup },
  { path: '/createq', component: CreateQuestion },
  { path: '/login', component: LogIn },
  { path: '/register', component: Register },
  { path: '/contest', component: Contest },
  { path: '/createc', component: CreateContest }
]

const router = new VueRouter({ mode: 'history', routes: routes })


//校验登录信息
router.beforeEach((to, from, next) => {
  let userId = localStorage.getItem("userId")
  if (userId === null) {
    //没有用户信息存储，需要登录
    if (to.fullPath != '/login' && to.fullPath != '/register') {
      next('/login')
    } else {
      next()
    }
  } else {
    if (to.fullPath == '/login' || to.fullPath == '/register') {
      //next('/list')
      next()
    } else {
      next()
    }
  }
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
