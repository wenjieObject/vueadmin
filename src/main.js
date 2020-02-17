// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import axios from 'axios'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import VCharts from 'v-charts'

Vue.use(VCharts)
Vue.use(ElementUI);

Vue.config.productionTip = false;

//正式环境
//axios.defaults.baseURL='http://10.60.4.103:8090/api'

//调试环境
axios.defaults.baseURL='http://localhost:4620/api'

//在发起请求之前，给请求头添加token
axios.interceptors.request.use(config=>{

  config.headers.Authorization=window.sessionStorage.getItem("token");
   
  //最后必须return config
  return config;
});

Vue.prototype.$http = axios


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
