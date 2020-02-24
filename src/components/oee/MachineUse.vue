

<template>
  <div class="reportDiv">
    <!-- 面包屑导航 -->

    <el-alert title="工作中心查询条件仅对单个工作中心设备利用率报表有效" type="warning"></el-alert>

    <el-card>
      <el-form ref="form" :model="queryform" :inline="true">
        <el-form-item label="工作中心">
          <el-select v-model="queryform.workshop" @change="changeWorkshop" clearable>
            <el-option
              v-for="item in workshopOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询时间">
          <el-date-picker type="date" placeholder="选择日期" v-model="queryform.dateFrom"></el-date-picker>
        </el-form-item>
        <el-form-item label="-">
          <el-date-picker type="date" placeholder="选择日期" v-model="queryform.dateTo"></el-date-picker>
        </el-form-item>

        <el-button type="primary" round @click="query">查询</el-button>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="12" class="echarts-item">
          <div class="content-title">工作中心设备利用率</div>
          <ve-bar :data="workshopData" :settings="workshopSettings" :extend="extendright"></ve-bar>
        </el-col>
        <el-col :span="12" class="echarts-item">
          <div class="content-title">车间设备利用率跟踪图</div>
          <ve-line
            :data="factoryData"
            :settings="factorySettings"
            :toolbox="toolbox"
            :colors="factorycolors"
            :legend="legend"
          ></ve-line>
        </el-col>
      </el-row>
      <el-row :style="showUse">
        <el-col :span="5">
          <div class="content-title">{{workshopName}}利用率(年)</div>
          <ve-histogram
            :data="workshopByYear"
            :legend-visible="false"
            :settings="chartSettingSingle"
            :extend="extendtop"
          ></ve-histogram>
        </el-col>
        <el-col :span="8">
          <div class="content-title">{{workshopName}}利用率跟踪图(月)</div>
          <ve-histogram
            :data="workshopByMonth"
            :legend-visible="false"
            :settings="chartSettingSingle"
            :extend="extendtop"
          ></ve-histogram>
        </el-col>
        <el-col :span="11">
          <div class="content-title">{{workshopName}}利用率跟踪图(天)</div>
          <ve-histogram
            :data="workshopByDay"
            :legend-visible="false"
            :settings="chartSettingSingle"
            :extend="extendtop"
          ></ve-histogram>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <div class="content-title">
            机台利用率跟踪表
            <el-button
              size="mini"
              type="primary"
              style="background-color: #0086b3"
              @click="exportExcel"
            >导出</el-button>
          </div>
          <el-table
            class="machineUseTable"
            :data="tableData"
            height="350"
            border
            style="width: 100%;"
          >
            <el-table-column prop="MACHING_CENTER_NAME" label="机台" width="180"></el-table-column>
            <el-table-column prop="RQ" label="日期" width="180"></el-table-column>
            <el-table-column prop="REMARK1" label="利用率"></el-table-column>
            <el-table-column prop="JH" label="计划停机时间(分钟)"></el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageIndex"
            :page-sizes="[5, 10, 50, 80]"
            :page-size="pageSize"
            :total="total"
          ></el-pagination>
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="display:none">
          <el-table class="allmachineUse" height="0.1" ref="multipleTable" :data="alltableData">
            <el-table-column type="index" label="序号" width="55"></el-table-column>
            <el-table-column prop="MACHING_CENTER_NAME" label="机台" width="180"></el-table-column>
            <el-table-column prop="RQ" label="日期" width="180"></el-table-column>
            <el-table-column prop="REMARK1" label="利用率"></el-table-column>
            <el-table-column prop="JH" label="计划停机时间(分钟)"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  name: "MachineUse",
  data() {
    var self = this;
    this.workshopSettings = {
      labelMap: {
        WorkshopUse: "设备利用率"
      },
      legendName: {
        WorkshopUse: "设备利用率"
      },
      itemStyle: {
        color: "#d48265"
      }
    };
    this.factorySettings = {
      labelMap: {
        Factory1: "制造一车间",
        Factory2: "制造二车间",
        Factory3: "制造三车间"
      }
    };
    this.legend = {
      // left: "right", //位置
      icon: "rect", //形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none
      // itemWidth: 10, // 设置宽度
      // itemHeight: 4, // 设置高度
      // itemGap: 20, // 设置间距
      //data: ["制造一车间", "制造二车间", "制造三车间"],
      textStyle: {
        //文字样式
        // color: "#B4CEFF",
        fontSize: "12"
      }
    };
    this.extendright = {
      series: {
        label: { show: true, position: "inside" },
        type: "bar"
      }
    };
    this.extendtop = {
      series: {
        label: { show: true, position: "top" },
        type: "bar" //增加type字段
      }
    };
    this.toolbox = {
      feature: {
        magicType: { type: ["line", "bar"] },
        saveAsImage: {}
      }
    };
    this.factorycolors = ["#c23531", "#2f4554", "#61a0a8"];
    this.chartSettingSingle = {
      labelMap: {
        WORKSHOPUSE: "设备利用率"
      }
    };
    return {
      //查询输入框
      queryform: {
        workshop: "",
        dateFrom: "",
        dateTo: new Date()
      },
      //所有工作中心利用率
      workshopData: {
        columns: [],
        rows: []
      },
      //所有工作中心数据
      workshopOptions: [
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
      //车间利用率
      factoryData: {
        columns: [],
        rows: []
      },
      workshopName: "",
      workshopByYear: {
        columns: [],
        rows: []
      },
      workshopByMonth: {
        columns: [],
        rows: []
      },
      workshopByDay: {
        columns: [],
        rows: []
      },
      tableData: [],
      alltableData: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      loading: "",
      showUse: "display:block",
      alltableIndex: 0
    };
  },
  created() {},
  methods: {
    //点击查询
    query() {
      if (
        !this.queryform.dateFrom ||
        this.queryform.dateFrom == "" ||
        !this.queryform.dateTo ||
        this.queryform.dateTo == ""
      ) {
        this.$message.error("必须输入起止时间");
        return;
      }

      this.loading = this.$loading({
        lock: true,
        text: "正在加载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        target: document.querySelector(".reportDiv")
      });

      this.pageIndex = 1;
      this.getWorkshopUse();
      this.getFactoryUse();
      this.getWorkshopUseByYear("y");
      this.getWorkshopUseByYear("m");
      this.getWorkshopUseByYear("d");
      this.getMachineUse();
    },
    //所有工作中心利用率
    async getWorkshopUse() {
      var res = await this.$http.get("/Report/GetWorkshopUse", {
        params: {
          dateFrom: this.dateToString(this.queryform.dateFrom),
          dateTo: this.dateToString(this.queryform.dateTo),
          workshop: this.queryform.workshop
        }
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      this.workshopData.columns = ["WorkshopName", "WorkshopUse"];
      this.workshopData.rows = JSON.parse(res.data);
    },

    //车间利用率
    async getFactoryUse() {
      var res = await this.$http.get("/Report/GetFactoryUse", {
        params: {
          dateFrom: this.dateToString(this.queryform.dateFrom),
          dateTo: this.dateToString(this.queryform.dateTo)
        }
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      this.factoryData.columns = ["Date", "Factory1", "Factory2", "Factory3"];
      this.factoryData.rows = JSON.parse(res.data);
    },

    //日期转字符
    dateToString(date) {
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      var dateTime = year + "-" + month + "-" + day;
      return dateTime;
    },
    //休眠
    sleep(n) {
      var start = new Date().getTime();

      while (true) {
        if (new Date().getTime() - start > n) {
          break;
        }
      }
    },
    //获取名称
    changeWorkshop() {
      var self = this;
      var workshopcode = this.queryform.workshop;
      if (!workshopcode || workshopcode == "") {
        return;
      }
      self.workshopOptions.forEach(element => {
        if (element.value === workshopcode) {
          self.workshopName = element.label;
          return;
        }
      });
    },
    //单个工作中心利用率 (没有工作中心不查询)
    async getWorkshopUseByYear(type) {
      if (!this.queryform.workshop || this.queryform.workshop == "") {
        //this.$message.error("必须输入工作中心");
        this.showUse = "display:none";
        return;
      }
      this.showUse = "display:block";

      var res = await this.$http
        .get("/Report/GetSingleWorkshopUse", {
          params: {
            dateFrom: this.dateToString(this.queryform.dateFrom),
            dateTo: this.dateToString(this.queryform.dateTo),
            workshop: this.queryform.workshop,
            type: type
          }
        })
        .catch(function(e) {});

      if (res == undefined || res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      if (type === "y") {
        this.workshopByYear.columns = ["DATEX", "WORKSHOPUSE"];
        this.workshopByYear.rows = JSON.parse(res.data);
      } else if (type === "m") {
        this.workshopByMonth.columns = ["DATEX", "WORKSHOPUSE"];
        this.workshopByMonth.rows = JSON.parse(res.data);
      } else if (type === "d") {
        this.workshopByDay.columns = ["DATEX", "WORKSHOPUSE"];
        this.workshopByDay.rows = JSON.parse(res.data);
      }
    },
    //所有机台利用率
    async getMachineUse() {
      var res = await this.$http
        .get("/Report/GetMachineUse", {
          params: {
            dateFrom: this.dateToString(this.queryform.dateFrom),
            dateTo: this.dateToString(this.queryform.dateTo),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        })
        .catch(function(e) {});

      setTimeout(() => {
        this.loading.close();
      }, 200);

      if (res == undefined || res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      this.tableData = JSON.parse(res.data);
      this.total = this.tableData[0].FJH;
    },
    //翻页事件
    handleCurrentChange() {
      this.getMachineUse();
    },
    //翻页
    handleSizeChange() {},
    cellStyle() {
      //return 'background-color:#99adf5'
    },

    //导出
    async exportExcel() {
      var res = await this.$http
        .get("/Report/GetAllMachineUse", {
          params: {
            dateFrom: this.dateToString(this.queryform.dateFrom),
            dateTo: this.dateToString(this.queryform.dateTo),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        })
        .catch(function(e) {});

      if (res == undefined || res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }

      this.alltableData = JSON.parse(res.data);
      var self = this;
      var start = new Date().getTime();

      if (this.alltableData.length > 10000) {
        this.$confirm("导出数据量大,可能需要较长时间, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            var interval = setInterval(() => {
              if (
                self.$refs.multipleTable != undefined &&
                self.$refs.multipleTable.tableData != undefined &&
                self.$refs.multipleTable.tableData.length ==
                  self.alltableData.length
              ) {
                clearInterval(interval);
                self.alltableData = [];

                var wb = XLSX.utils.table_to_book(
                  document.querySelector(".allmachineUse")
                );

                /* get binary string as output */
                var wbout = XLSX.write(wb, {
                  bookType: "xlsx",
                  bookSST: true,
                  type: "array"
                });
                try {
                  FileSaver.saveAs(
                    new Blob([wbout], { type: "application/octet-stream" }),
                    "机台利用率跟踪表.xlsx"
                  );
                } catch (e) {
                  if (typeof console !== "undefined") console.log(e, wbout);
                }
                return wbout;
              }
            }, 300);
            F;
          })
          .catch(() => {
            const h = self.$createElement;
            self.$notify({
              title: "取消操作",
              message: h(
                "i",
                { style: "color: teal" },
                "您取消了导出"
              )
            });
          });
      } else {
        var interval = setInterval(() => {
          if (
            self.$refs.multipleTable != undefined &&
            self.$refs.multipleTable.tableData != undefined &&
            self.$refs.multipleTable.tableData.length ==
              self.alltableData.length
          ) {
            clearInterval(interval);
            self.alltableData = [];

            var wb = XLSX.utils.table_to_book(
              document.querySelector(".allmachineUse")
            );

            /* get binary string as output */
            var wbout = XLSX.write(wb, {
              bookType: "xlsx",
              bookSST: true,
              type: "array"
            });
            try {
              FileSaver.saveAs(
                new Blob([wbout], { type: "application/octet-stream" }),
                "机台利用率跟踪表.xlsx"
              );
            } catch (e) {
              if (typeof console !== "undefined") console.log(e, wbout);
            }
            return wbout;
          }
        }, 300);
      }
    }
  }
};
</script>

<style scoped>
.content-title {
  clear: both;
  font-weight: 400;
  line-height: 40px;
  padding: 10px 10px;
  font-size: 20px;
  color: #1f2f3d;
  text-align: center;
}
.el-form {
  margin-top: 10px;
  margin-left: 10px;
}
.el-table {
  margin: 5px 0px;
  background-color: #e5e9f8;
}
.el-card {
  background-color: #e5e9f8;
}

.el-loading-spinner {
  top: 500px;
}
</style>