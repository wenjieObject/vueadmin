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

//test
axios.defaults.baseURL='http://10.60.4.103:8091/api'

//调试环境
//axios.defaults.baseURL = 'http://localhost:4620/api'

//在发起请求之前，给请求头添加token
axios.interceptors.request.use(config => {

  config.headers.Authorization = window.sessionStorage.getItem("token");

  //最后必须return config
  return config;
});

Vue.prototype.$http = axios;

var commonFunc = function () {
  return {
    getUserByCookie: function (cookie_userId) {
      //debugger
      var allcookies = document.cookie;
      var cookie_pos = allcookies.indexOf(cookie_userId); //索引的长度
      var value=''

      // 如果找到了索引，就代表cookie存在，
      // 反之，就说明不存在。
      if (cookie_pos != -1) {
        // 把cookie_pos放在值的开始，只要给值加1即可。
        cookie_pos += cookie_userId.length + 1; //这里容易出问题，所以请大家参考的时候自己好好研究一下
        var cookie_end = allcookies.indexOf(";", cookie_pos);

        if (cookie_end == -1) {
          cookie_end = allcookies.length;
        }

         value = unescape(allcookies.substring(cookie_pos, cookie_end)); //这里就可以得到你想要的cookie的值了。。。
      }
      return value;
    },

    // 小写转大写

  }
}();
if (typeof (Vue) == "function") Vue.prototype.commonFunc = commonFunc;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
