<template>
  <div class="home_div">
    <el-container class="home_div">
      <!-- 头部区域 -->
      <el-header>
        <div class="img_div">
          <img src="../assets/head.png" alt style="height:58px" />
          <router-link to="/welcome" style="text-decoration: none;color: #ffffff;">后台管理系统</router-link>
        </div>
        <div>
          <el-button type="info" @click="logout">退出</el-button>
        </div>
      </el-header>

      <el-container class="main_container">
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse?'64px':'200px'">
          <div class="toggle_button" @click="toggleCollapse">
            <i :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"></i>
          </div>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            :collapse="isCollapse"
            router
            :default-active="activePath"
          >
            <el-submenu :index="item.id" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i class="el-icon-folder-opened"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item
                :index="subitem.id"
                v-for="subitem in item.children"
                :key="subitem.id"
                @click="saveNavState(subitem.id)"
              >
                <template slot="title">
                  <i class="el-icon-tickets"></i>
                  <span>{{subitem.name}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 右侧主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>




<script>
export default {
  name: "",
  data() {
    return {
      menuList: [],
      isCollapse: false,
      //激活的菜单
      activePath: ""
    };
  },

  methods: {
    //退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(mActivePath) {
      window.sessionStorage.setItem("activePath", mActivePath);
      this.activePath = mActivePath;
    },
    getFakeMenu() {
      var child = {};
      var child01 = {};
      var menu = {};
      var childrenMenu = [];

      child.name = "通用查询";
      child.id = "/search";
      childrenMenu.push(child);

      child01.name = "通用修改";
      child01.id = "/error";
      childrenMenu.push(child01);

      menu.id = "1";
      menu.name = "通用管理";
      menu.children = childrenMenu;

      var menu02 = {};
      var child02 = {};
      var childrenMenu02 = [];

      child02.name = "OEE按班组";
      child02.id = "/oeeTeam";
      childrenMenu02.push(child02);

      menu02.id = "2";
      menu02.name = "OEE管理";
      menu02.children = childrenMenu02;

      var menu03 = {};
      var child03 = {};
      var childrenMenu03 = [];

      child03.name = "角色管理";
      child03.id = "/roles";
      childrenMenu03.push(child03);

      var child03_2 = {};
      child03_2.name = "角色菜单";
      child03_2.id = "/roleMenu";
      childrenMenu03.push(child03_2);

      menu03.id = "3";
      menu03.name = "用户角色";
      menu03.children = childrenMenu03;

      this.menuList.push(menu);
      this.menuList.push(menu02);
      this.menuList.push(menu03);
    }
  },
  created: function() {
    this.getFakeMenu();
    this.activePath = window.sessionStorage.getItem("activePath");
  }
};
</script>

<style scoped>
.home_div {
  height: 100%;
}
.main_container {
  height: 80%;
}

.el-header {
  background-color: #2d3b50;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
}

.img_div {
  display: flex;
  align-items: center;
  cursor: pointer;
}

span {
  margin-left: 10px;
}
.el-aside {
  background-color: #333744;
}
.el-menu {
  border: 0;
}
.el-main {
  background-color: #eaedf1;
  padding-left: 10px;
  padding-right: 10px;
}
.toggle_button {
  background-color: #4a5064;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
}
</style>

