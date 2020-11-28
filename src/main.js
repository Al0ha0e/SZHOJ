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

const routes = [
  { path: '/list', component: QuestList },
  { path: '/queue', component: TestQueue },
  { path: '/qinfo/:id', component: QuestInfo },
  { path: '/user/:id', component: UserInfo },
  { path: '/createq', component: CreateQuestion }
]

const router = new VueRouter({ mode: 'history', routes: routes })

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
