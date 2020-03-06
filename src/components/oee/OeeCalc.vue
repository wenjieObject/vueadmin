<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>OEE管理</el-breadcrumb-item>
      <el-breadcrumb-item>OEE修正</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert v-if="activeName=='shutdown'" title="补录停机时间不会自动重新计算oee！如需重计算请在下方第二个页面操作" type="warning" show-icon></el-alert>
      <el-alert v-else title="日期必须输入，工作中心与加工中心可选，如两个都不选，那么将重新计算当天的OEE，如果选中工作中心那么将重计算当天工作中心的OEE" type="info" show-icon></el-alert>

      <el-tabs v-model="activeName"  @tab-click="handleTabClick">
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
              <el-button type="primary" @click="getMachinedownBtn">查询</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="warning" @click="addMachinedown">补录</el-button>
            </el-col>
          </el-row>

          <!-- 表格区域 -->
          <el-table :data="machinedownData" height="400" style="width: 100%" stripe border>
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

        <el-tab-pane label="OEE重计算" name="oee">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form ref="form" label-width="80px">
                <el-form-item label="工作中心">
                  <el-select v-model="reworkshop" clearable @change="changeWorkshop" placeholder="请选择">
                    <el-option
                      v-for="item in reworkshops"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="加工中心">
                  <el-select v-model="remachine" clearable filterable placeholder="请选择">
                    <el-option
                      v-for="item in remachines"
                      :key="item.VALUEX"
                      :label="item.DESCX"
                      :value="item.VALUEX"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="日期">
                  <el-date-picker v-model="redatepick" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="requeryOee">查询</el-button>

                  <el-button type="danger" @click="reCalculateOeeData">重计算</el-button>
                </el-form-item>
              </el-form>
            </el-col>

            <el-col :span="18">
              <!-- 表格区域 -->
              <el-table class="oeetable" :data="oeeDatas" height="480" style="width: 100%" stripe border>
                <el-table-column prop="WORKSHOP_NAME" label="工序" width="120"></el-table-column>
                <el-table-column prop="MACHING_CENTER_NAME" label="机台" width="240"></el-table-column>
                <el-table-column prop="RQ" label="日期" width="120"></el-table-column>
                <el-table-column prop="JH" label="计划" width="80"></el-table-column>
                <el-table-column prop="FJH" label="非计划" width="80"></el-table-column>
                <el-table-column prop="ACTQTY" label="实际产量" width="100"></el-table-column>
                <el-table-column prop="TASKQTY" label="理论产量" width="100"></el-table-column>
                <el-table-column prop="FSQTY" label="废丝" width="100"></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
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
      },
      redatepick: "",
      reworkshops: [
        {
          value: "WORKSHOP003",
          label: "倒拉工作中心"
        },
        {
          value: "WORKSHOP004",
          label: "大拉工作中心"
        },
        {
          value: "WORKSHOP005",
          label: "中拉工作中心"
        },
        {
          value: "WORKSHOP007",
          label: "电镀工作中心"
        },
        {
          value: "WORKSHOP009",
          label: "小拉工作中心"
        },
        {
          value: "WORKSHOP010",
          label: "半自动小拉工作中心"
        }
      ],
      reworkshop: "",
      remachines: [],
      remachine: "",
      oeeDatas: []
    };
  },
  created() {
    this.getShutdownCodes();
    this.getMachings();
    this.getMachingcenters();
  },
  methods: {
    getMachinedownBtn() {
      this.queryInfo.pageIndex = 1;
      this.getMachinedown();
    },

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
            this.getMachinedownBtn();
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

    changeWorkshop() {
      this.remachine = "";
      this.getMachingcenters();
    },
    //获取加工中心
    async getMachingcenters() {
      var res = await this.$http.get("/OeeFix/GetMachingcenters", {
        params: { workshop_no: this.reworkshop }
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      var data = JSON.parse(res.data);
      this.remachines = data;
    },
    //
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getMachinedown();
    },
    handleCurrentChange() {
      this.getMachinedown();
    },

    handleDelete(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          var res = await this.$http.post("/OeeFix/DeleteShutDownTime", {
            data: row.id
          });
          if (res.status != "200") {
            this.$message.error("服务器异常，请稍后重试");
            return;
          }
          var res = JSON.parse(res.data);
          if (res.ResCode === "200") {
            this.getMachinedownBtn();
            this.$message.success(res.ResMsg);
            return;
          } else {
            this.$message.error(res.ResMsg);
            return;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async reCalculateOeeData() {
      if (this.redatepick === "" || !this.redatepick) {
        this.$message.error("日期必须输入！");
        return;
      }
      var rq = this.format(this.redatepick);
      rq = rq.substring(0, 10);
      var res = await this.$http.post("/OeeFix/ReCalculateOeeData", {
        data: {
          rq: rq,
          workshop: this.reworkshop,
          machine: this.remachine
        }
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      var res = JSON.parse(res.data);
      if (res.ResCode === "200") {
        this.requeryOee();
        this.$message.success(res.ResMsg);
        return;
      } else {
        this.$message.error(res.ResMsg);
        return;
      }
    },
    async requeryOee() {
      if (this.redatepick === "" || !this.redatepick) {
        this.$message.error("日期必须输入！");
        return;
      }
      var rq = this.format(this.redatepick);
      rq = rq.substring(0, 10);
      var res = await this.$http.get("/OeeFix/GetOeedatas", {
        params: { rq: rq, workshop: this.reworkshop, machine: this.remachine }
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      var data = JSON.parse(res.data);
      this.oeeDatas = data;
    },
    handleTabClick(tab){
      
    }
  }
};
</script>

<style  scoped>
.el-alert {
  margin: 0px 0px;
}
.oeetable{
  margin-top:3px 
}
</style>