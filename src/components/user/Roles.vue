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

        <el-col :span="4">
          <el-button type="info" round @click="getMenus">测试级联选择</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="[item1.PROGRAMCODE==='1'?'bdbottom':'',i1===0?'bdtop':'']"
              v-for="(item1,i1) in scope.row.Menuinfos"
              :key="item1.SYS_PROGRAMID"
            >
              <!--一级权限-->
              <el-col :span="5" v-if="item1.PROGRAMCODE==='1'">
                <el-tag>{{item1.PROGRAMNAME}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二级和三级权限-->
              <el-col :span="19">
                <el-row v-for="(item2) in scope.row.Menuinfos" :key="item2.SYS_PROGRAMID">
                  <!--二级权限-->
                  <el-col
                    :span="6"
                    v-if="item2.PROGRAMCODE==='2' && item2.PROGRAMPARENT===item1.SYS_PROGRAMID"
                  >
                    <el-tag type="success">{{item2.PROGRAMNAME}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!--三级权限-->
                  <el-col :span="18"></el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="ID" prop="SYS_ROLEINFOID" width="350px"></el-table-column>
        <el-table-column label="角色" prop="CNAME"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.SYS_ROLEINFOID)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.SYS_ROLEINFOID)"
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

    <el-dialog title="级联选择" :visible.sync="dialogFormVisible" >
      <el-form>
        <el-form-item label="菜单名称" label-width="80px">
          <el-input autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单选择" label-width="80px">
          <el-cascader
            v-model="cascaderValue"
            :props="cascaderProps"
            :options="cascaderData"
            @change="cascaderChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
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
      rolelist: [],
      dialogFormVisible: false,
      //选中的数据
      cascaderValue: [],
      //下拉数据源
      cascaderData: [],
      cascaderProps: {
        value: "SYS_PROGRAMID",
        label: "PROGRAMNAME",
        children: "MenuChildren"
      }
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
          self.rolelist = mres.rolesAndMenus;
          self.$message("查询成功！");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //每页数量修改
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.GetRoles();
    },
    //分页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.GetRoles();
    },
    //修改弹框
    showEditDialog(id) {
      this.$message("您无权修改！");
    },
    //删除角色
    removeRoleById(id) {
      this.$confirm("是否确认删除？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$message({ type: "info", message: "您无权删除！" });
        })
        .catch(action => {
          this.$message({ type: "info", message: "放弃并离开页面" });
        });
    },
    //分配权限
    setRole(row) {},
    //获取级联选择数据
    async getMenus() {
      var self = this;
      await axios
        .get("http://localhost:4620/api/values/GetMenus")
        .then(function(res) {
          if (res.status != "200") {
            self.$message.error("服务器异常，请稍后重试");
            return;
          }
          var mres = JSON.parse(res.data);
          self.cascaderData = mres;
          self.dialogFormVisible = true;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //级联修改
    cascaderChange() {
      console.log(this.cascaderValue);
    }
  }
};
</script>

<style  scoped>
.el-tag {
  margin: 7px;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.bdtop {
  border-top: 1px solid #eee;
}

.el-cascader{
  width: 100%;
}
</style>