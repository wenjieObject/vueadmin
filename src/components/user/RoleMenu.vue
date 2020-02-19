<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户角色</el-breadcrumb-item>
      <el-breadcrumb-item>角色菜单</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="请先选择角色！" type="warning" show-icon></el-alert>
      <el-select
        v-model="value"
        filterable
        remote
        reserve-keyword
        clearable
        placeholder="请输入角色名称"
        :remote-method="remoteMethod"
        :loading="loading"
        @change="changeSelect"
      >
        <el-option
          v-for="item in options"
          :key="item.SYS_ROLEINFOID"
          :label="item.CNAME"
          :value="item.SYS_ROLEINFOID"
        ></el-option>
      </el-select>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="user">
          <el-table :data="userTableData" style="width: 100%" stripe border>
            <el-table-column prop="USERCODE" label="用户编码" width="240"></el-table-column>
            <el-table-column prop="CNAME" label="姓名" width="240"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="菜单管理" name="menu">
          <el-table :data="menuTableData" style="width: 100%" stripe border>
            <el-table-column prop="SYS_PROGRAMID" label="角色Id" width="400"></el-table-column>
            <el-table-column prop="PROGRAMNAME" label="角色名称" width="240"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete( scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template> 

<script>
export default {
  data() {
    return {
      options: [],
      value: "",
      loading: false,
      activeName: "user",
      userTableData: [],
      menuTableData: []
    };
  },
  created() {},
  methods: {
    //远程获取下拉数据
    remoteMethod(query) {
      this.loading = true;
      setTimeout(async () => {
        this.loading = false;
        var res = await this.$http.get("/values/GetRoles", {
          params: { cname: query }
        });
        if (res.status != "200") {
          this.$message.error("服务器异常，请稍后重试");
          return;
        }
        this.options = JSON.parse(res.data);
      }, 100);
    },
    //选择角色，获取数据
    changeSelect() {
      if (!this.value || this.value.trim() === "") {
        this.userTableData = [];
        this.menuTableData = [];
        return;
      }
      this.getUserByRole(this.value);
      this.GetMenuByRole(this.value);
    },
    async getUserByRole(role) {
      var res = await this.$http.get("/values/GetUserByRole", {
        params: { roleId: role }
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      this.userTableData = JSON.parse(res.data);
    },
    async GetMenuByRole(role) {
      var res = await this.$http.get("/values/GetMenuByRole", {
        params: { roleId: role }
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      this.menuTableData = JSON.parse(res.data);
    },

    //选择tab页面
    handleClick(tab, event) {}
  }
};
</script>

<style  scoped>
.el-alert {
  margin: 10px 0px;
}
.el-select {
  width: 30%;
}
</style>