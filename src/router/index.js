import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Search from '../components/Search.vue'
import Welcome from '../components/Welcome.vue'
import Error from '../components/Error.vue'
import OeeTeam from '../components/oee/OeeTeam.vue'
import Roles from '../components/user/Roles.vue'
import RoleMenu from '../components/user/RoleMenu.vue'
import MachineUse from '../components/oee/MachineUse.vue'
import LinesideInv from '../components/stock/LinesideInv.vue'
import OeeCalc from '../components/oee/OeeCalc.vue'

Vue.use(Router)


var router =
  new Router({
    routes: [
      { path: '/', redirect: '/login' },
      { path: '/login', component: Login },
      { path: '/machineUse', component: MachineUse },
      { path: '/linesideInv', component: LinesideInv },
      {
        path: '/Home', component: Home, redirect: '/welcome',
        children: [
          { path: '/search', component: Search },
          { path: '/welcome', component: Welcome },
          { path: '/error', component: Error },
          { path: '/oeeTeam', component: OeeTeam },
          { path: '/roles', component: Roles },
          { path: '/roleMenu', component: RoleMenu },
          { path: '/oeeCalc', component: OeeCalc },
        ]
      },
    ]

  });

//路由跳转，校验权限
router.beforeEach((to, from, next) => {

  //next() 放行，next('/login')强行跳转
  if (to.path == "/login" || to.path == "/machineUse") return next();

  var token = window.sessionStorage.getItem('token');
  if (token == "12306") {
    return next();
  }
  next('/login');

});

export default router
