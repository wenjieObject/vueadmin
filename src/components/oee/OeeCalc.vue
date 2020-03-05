<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>OEE管理</el-breadcrumb-item>
      <el-breadcrumb-item>OEE修正</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="补录停机时间不会自动重新计算oee！如需重计算请在下方第二个页面操作" type="warning" show-icon></el-alert>
      <el-tabs v-model="activeName">
        <el-tab-pane label="停机时长补录" name="shutdown">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-select v-model="queryInfo.EQUIPMENTID" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in machines"
                  :key="item.VALUEX"
                  :label="item.DESCX"
                  :value="item.VALUEX"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-date-picker
                v-model="datepick"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-col>

            <el-col :span="2">
              <el-button type="primary" @click="getMachinedown">查询</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="warning" @click="addMachinedown">补录</el-button>
            </el-col>
          </el-row>

          <!-- 表格区域 -->
          <el-table :data="machinedownData" style="width: 100%" stripe border>
            <el-table-column prop="em_name" label="设备名称" width="240"></el-table-column>
            <el-table-column prop="begintime" label="开始时间" width="240"></el-table-column>
            <el-table-column prop="endtime" label="结束时间" width="240"></el-table-column>
            <el-table-column prop="keeptime" label="持续时间" width="120"></el-table-column>
            <el-table-column prop="errcdesc" label="停机代码" width="240"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="queryInfo.pageIndex"
            :page-sizes="[5, 8, 50, 80]"
            :page-size="queryInfo.pageSize"
            layout="sizes, prev, pager, next"
            :total="total"
          ></el-pagination>

          <!-- 表格区域 -->

          <!-- 弹出框 -->
          <el-dialog title="停机信息" :visible.sync="dialogFormVisible" width="50%">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="设备" prop="EQUIPMENTID">
                    <el-select
                      v-model="editForm.EQUIPMENTID"
                      clearable
                      filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in machines"
                        :key="item.VALUEX"
                        :label="item.DESCX"
                        :value="item.VALUEX"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="停机代码" prop="ERRORCODE">
                    <el-select v-model="editForm.ERRORCODE" clearable filterable placeholder="请选择">
                      <el-option
                        v-for="item in errorCodes"
                        :key="item.VALUEX"
                        :label="item.DESCX"
                        :value="item.VALUEX"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="停机开始" prop="BEGINTIME">
                    <el-date-picker
                      v-model="editForm.BEGINTIME"
                      type="datetime"
                      placeholder="选择日期时间"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="停机结束" prop="ENDTIME">
                    <el-date-picker v-model="editForm.ENDTIME" type="datetime" placeholder="选择日期时间"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-alert title="以上信息必输，不要输入跨天的数据，谢谢" type="success" show-icon></el-alert>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="editFunc">确 定</el-button>
            </div>
          </el-dialog>
          <!-- 弹出框 -->
        </el-tab-pane>

        <el-tab-pane label="OEE重计算" name="oee"></el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template> 

<script>
export default {
  data() {
    return {
      datepick: [],
      loading: false,
      activeName: "shutdown",
      machinedownData: [],
      machingName: "",
      dialogFormVisible: false,
      editForm: {
        EQUIPMENTID: "",
        BEGINTIME: "",
        ENDTIME: "",
        ERRORCODE: "",
        REMARK: ""
      },
      editFormRules: {
        EQUIPMENTID: [{ required: true, message: "必须输入", trigger: "blur" }],
        ERRORCODE: [{ required: true, message: "必须输入", trigger: "blur" }],
        BEGINTIME: [{ required: true, message: "必须输入", trigger: "blur" }],
        ENDTIME: [{ required: true, message: "必须输入", trigger: "blur" }]
      },
      errorCodes: [],
      machines: [],
      total: 0,
      queryInfo: {
        BEGINTIME: "",
        ENDTIME: "",
        EQUIPMENTID: "",
        pageIndex: 1,
        pageSize: 5
      }
    };
  },
  created() {
    this.getShutdownCodes();
    this.getMachings();
    this.getMachinedown();
  },
  methods: {
    async getMachinedown() {
      if (this.datepick.length > 1) {
        this.queryInfo.BEGINTIME = this.format(this.datepick[0]);
        this.queryInfo.ENDTIME = this.format(this.datepick[1]);
      }

      var res = await this.$http.get("/OeeFix/GetMachinedownByPager", {
        params: {
          EQUIPMENTID: this.queryInfo.EQUIPMENTID,
          BEGINTIME: this.queryInfo.BEGINTIME,
          ENDTIME: this.queryInfo.ENDTIME,
          pageIndex: this.queryInfo.pageIndex,
          pageSize: this.queryInfo.pageSize
        }
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      var result = JSON.parse(res.data);
      this.total = result.total;

      this.machinedownData = result.data;
    },

    addMachinedown() {
      this.dialogFormVisible = true;
    },
    //补录确定
    async editFunc() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          this.editForm.REMARK = "a";
          this.editForm.BEGINTIME = this.format(this.editForm.BEGINTIME);
          this.editForm.ENDTIME = this.format(this.editForm.ENDTIME);

          var res = await this.$http.post("/OeeFix/ModifyShutDownTime", {
            requestdata: JSON.stringify(this.editForm)
          });
          if (res.status != "200") {
            this.$message.error("服务器异常，请稍后重试");
            return;
          }
          var res = JSON.parse(res.data);
          if (res.ResCode === "200") {
            this.$message.success(res.ResMsg);
            this.dialogFormVisible = false;
            return;
          } else {
            this.$message.error(res.ResMsg);
            return;
          }
        } else {
          this.$message.error("请录入完整的停机信息！！");
          return false;
        }
      });
      return;
    },
    format(shijian) {
      let date = new Date(shijian);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },

    //获取停机代码
    async getShutdownCodes() {
      var res = await this.$http.get("/OeeFix/GetShutdownCodes", {
        params: {}
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      var data = JSON.parse(res.data);
      this.errorCodes = data;
    },
    //获取停机设备
    async getMachings() {
      var res = await this.$http.get("/OeeFix/GetMachingcenter", {
        params: {}
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      var data = JSON.parse(res.data);
      this.machines = data;
    },
    //
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getMachinedown();
    },
    handleCurrentChange() {
      this.getMachinedown();
    },

    handleDelete(row) {}
  }
};
</script>

<style  scoped>
.el-alert {
  margin: 0px 0px;
}
</style>