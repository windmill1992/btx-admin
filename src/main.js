import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
// import 'font-awesome/css/font-awesome.min.css'

import axios from './http/http'

axios.defaults.headers = {
  'content-type': 'application/json',
  'userId': 0,
  "applicationId": 3,
}
Vue.prototype.$http = axios;

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
  // mode: 'history',
  routes: routes
})

router.beforeEach((to, from, next) => {
  let uid = sessionStorage.userId;
  if(uid){
    axios.defaults.headers.userId = uid;
  }
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }

  next()
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

