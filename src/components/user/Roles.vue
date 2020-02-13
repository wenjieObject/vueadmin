<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户角色</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="25">
        <el-col :span="4">
          <el-input placeholder="请输入角色名称" v-model="queryInfo.roleName" clearable></el-input>
        </el-col>

        <el-col :span="2">
          <el-button type="primary" @click="GetRoles">查询</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="ID" prop="SYS_ROLEINFOID" width="350px"></el-table-column>
        <el-table-column label="角色" prop="CNAME" ></el-table-column>

        <el-table-column label="操作" >
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[8, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template> 

<script>
import axios from "axios";

export default {
  data() {
    return {
      queryInfo: {
        roleName: "",
        pagenum: 1,
        pagesize: 8
      },
      total: 0,
      rolelist: []
    };
  },
  methods: {
    //查询
    async GetRoles() {
      var self = this;
      // 仅仅用于测试
      await axios
        .get("http://localhost:4620/api/values/GetRoles", {
          params: self.queryInfo
        })
        .then(function(res) {
          if (res.status != "200") {
            self.$message.error("服务器异常，请稍后重试");
            return;
          }
          var mres = JSON.parse(res.data);
          self.total = mres.total;
          self.rolelist = mres.roleInfos;
          self.$message("查询成功！");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //每页数量修改
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.GetRoles();
    },
    //分页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.GetRoles();
    }
  }
};
</script>

<style  scoped>
</style>