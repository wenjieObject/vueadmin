<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>OEE管理</el-breadcrumb-item>
      <el-breadcrumb-item>OEE按班组</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式布局 -->
    <el-card>
      <el-row :gutter="25">
        <el-col :span="4">
          <el-input placeholder="请输入机台名称" v-model="queryInfo.machingName" clearable></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入日期" v-model="queryInfo.date" clearable></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入班次（早/晚）班" v-model="queryInfo.workTeam" clearable></el-input>
        </el-col>
        <el-col :span="2" style="padding-top:8px">
          <el-switch v-model="isErr" active-text="异常"></el-switch>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="GetOeeworkteam">查询</el-button>
        </el-col>
      </el-row>

      <el-table :data="oeeworkteams" stripe border>
        <!-- <el-table-column type="index"></el-table-column> -->
        <el-table-column prop="WORKSHOP_NAME" label="工作中心"></el-table-column>
        <el-table-column prop="MACHING_CENTER_NAME" label="机台"></el-table-column>
        <el-table-column prop="RQ" label="日期"></el-table-column>
        <el-table-column prop="WORKTEAM" label="班次"></el-table-column>
        <el-table-column prop="TOTAL" label="总时间" width="70px"></el-table-column>
        <el-table-column prop="JH" label="计划停机" width="80px"></el-table-column>
        <el-table-column prop="FJH" label="非计划停机" width="95px"></el-table-column>
        <el-table-column prop="ACTQTY" label="实际产量"></el-table-column>
        <el-table-column prop="TASKQTY" label="目标产量"></el-table-column>
        <el-table-column prop="FSQTY" label="废丝" width="70px"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查询异常原因" placement="top">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-search"
                @click="handleError(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pageIndex"
        :page-sizes="[5, 8, 50, 80]"
        :page-size="queryInfo.pageSize"
        layout="sizes, prev, pager, next"
        :total="total"
      ></el-pagination>

      <!-- 弹出框 -->
      <el-dialog title="异常明细" :visible.sync="dialogFormVisible" width="50%">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"  label-width="80px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="机台">
                <el-input v-model="editForm.MACHING_CENTER_NAME" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="日期">
                <el-input v-model="editForm.RQ" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="班次">
                <el-input v-model="editForm.WORKTEAM" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="计划停机" prop="JH">
                <el-input v-model="editForm.JH" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="非计划">
                <el-input v-model="editForm.FJH"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="实际产量">
                <el-input v-model="editForm.ACTQTY"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="计划产量">
                <el-input v-model="editForm.TASKQTY"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="废丝">
                <el-input v-model="editForm.FSQTY"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editFunc">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        pageIndex: 1,
        pageSize: 8,
        machingName: "",
        date: "",
        workTeam: "",
        hasErr: "0"
      },
      oeeworkteams: [],
      total: 0,
      totalPage: 0,
      isErr: false,
      dialogFormVisible: false,
      editForm: {
        MACHING_CENTER_NAME: "",
        RQ: "",
        WORKTEAM: "",
        JH: " ",
        FJH: "",
        ACTQTY: "",
        TASKQTY: "",
        FSQTY: ""
      },
      editFormRules: {
        JH: [{ required: true, message: "请输入计划停机", trigger: "blur" }]
      }
    };
  },
  created() {
    this.GetOeeworkteam();
  },
  methods: {
    //查询
    async GetOeeworkteam() {
      if (this.isErr) {
        this.queryInfo.hasErr = "1";
      } else {
        this.queryInfo.hasErr = "0";
      }
      var res = await this.$http.get("/values/GetOeeworkteam", {
        params: this.queryInfo
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      var mres = JSON.parse(res.data);
      this.total = mres.total;
      this.oeeworkteams = mres.oeeworkteamList;
      this.totalPage = this.total / this.queryInfo.pageSize + 1;
      this.$message("查询成功！");
    },
    //异常分析
    handleError(row) {
      //console.log(row);
      this.editForm = row;
      this.dialogFormVisible = true;
      //this.$message("即将上线");
    },
    //每页数量修改
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.GetOeeworkteam();
    },
    //分页
    handleCurrentChange(newPage) {
      this.queryInfo.pageIndex = newPage;
      this.GetOeeworkteam();
    },
    //修改
    editFunc(){
      var row =this.editForm;
      this.$refs.editFormRef.validate(
        valid=>{
          if(!valid)return;
          this.$message.success('修改成功！fake');
          this.dialogFormVisible=false;
        }
      );
      
    }
  }
};
</script>

<style  scoped>
</style>