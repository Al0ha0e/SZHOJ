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

import QuestList from './components/questList';
import TestQueue from './components/testQueue';
import QuestInfo from './components/questionInfo';
import UserInfo from './components/userInfo';
import CreateQuestion from './components/createQuestion';
import LogIn from './components/login'
import Register from './components/register'

const routes = [
  { path: '/list', component: QuestList },
  { path: '/queue', component: TestQueue },
  { path: '/qinfo/:id', component: QuestInfo },
  { path: '/user/:id', component: UserInfo },
  { path: '/createq', component: CreateQuestion },
  { path: '/login', component: LogIn },
  { path: '/register', component: Register }
]

const router = new VueRouter({ mode: 'history', routes: routes })

router.beforeEach((to, from, next) => {
  let userId = localStorage.getItem("userId")
  if (userId === null) {
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
