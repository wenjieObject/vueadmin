

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12" class="echarts-item">
        <div class="content-title">柱状图</div>
        <!-- :mark-line="histogramChartMarkLine" -->
        <ve-histogram
          :data="histogramChartData"
          :settings="histogramChartSettings"
          :mark-line="histogramChartMarkLine"
        ></ve-histogram>
      </el-col>
      <el-col :span="12" class="echarts-item">
        <div class="content-title">折线图</div>
        <ve-line
          :data="lineChartData"
          :settings="lineChartSettings"
          :mark-point="lineChartMarkPoint"
        ></ve-line>
      </el-col>
      <el-col :span="12" class="echarts-item">
        <div class="content-title">雷达</div>
        <ve-radar :data="radarchartData"></ve-radar>
      </el-col>

      <el-col :span="12" class="echarts-item">
        <div class="content-title">环形图</div>
        <ve-ring :data="ringChartData" :settings="ringChartSettings"></ve-ring>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="echarts-item">
        <div class="content-title">饼图</div>
        <ve-pie :data="pieChartData" :settings="pieChartSettings"></ve-pie>
      </el-col>

      <el-col :span="12" class="echarts-item">
        <el-button @click="changeType" type="info">点啊</el-button>
        <ve-chart :data="veChartData" :settings="chartSettings" :events="chartEvents"></ve-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    this.typeArr = ["line", "histogram", "pie","radar"];
    this.index = 0;
    var self = this
    this.chartEvents = {
        click: function (e) {
         self.$message("您点击了："+e.name + e.value);
        }
      }
    return {
      histogramChartData: {
        columns: [
          "日期",
          "直接访问",
          "邮件营销",
          "联盟广告",
          "视频广告",
          "搜索引擎",
          "百度",
          "谷歌",
          "必应",
          "其他"
        ],
        rows: [
          {
            日期: "周一",
            直接访问: 320,
            邮件营销: 120,
            联盟广告: 220,
            视频广告: 150,
            搜索引擎: 862,
            百度: 620,
            谷歌: 120,
            必应: 60,
            其他: 62
          },
          {
            日期: "周二",
            直接访问: 332,
            邮件营销: 132,
            联盟广告: 182,
            视频广告: 232,
            搜索引擎: 1018,
            百度: 732,
            谷歌: 132,
            必应: 72,
            其他: 82
          },
          {
            日期: "周三",
            直接访问: 301,
            邮件营销: 101,
            联盟广告: 191,
            视频广告: 201,
            搜索引擎: 964,
            百度: 701,
            谷歌: 101,
            必应: 71,
            其他: 91
          },
          {
            日期: "周四",
            直接访问: 334,
            邮件营销: 134,
            联盟广告: 234,
            视频广告: 154,
            搜索引擎: 1026,
            百度: 734,
            谷歌: 134,
            必应: 74,
            其他: 84
          },
          {
            日期: "周五",
            直接访问: 390,
            邮件营销: 90,
            联盟广告: 290,
            视频广告: 190,
            搜索引擎: 1679,
            百度: 1090,
            谷歌: 290,
            必应: 190,
            其他: 109
          },
          {
            日期: "周六",
            直接访问: 330,
            邮件营销: 230,
            联盟广告: 330,
            视频广告: 330,
            搜索引擎: 1600,
            百度: 1130,
            谷歌: 230,
            必应: 130,
            其他: 110
          },
          {
            日期: "周日",
            直接访问: 320,
            邮件营销: 210,
            联盟广告: 310,
            视频广告: 410,
            搜索引擎: 1570,
            百度: 1120,
            谷歌: 220,
            必应: 110,
            其他: 120
          }
        ]
      },
      histogramChartSettings: {
        metrics: [
          "直接访问",
          "邮件营销",
          "联盟广告",
          "视频广告",
          "搜索引擎",
          "百度",
          "谷歌",
          "必应",
          "其他"
        ],
        dimension: ["日期"],
        stack: {
          广告: ["邮件营销", "联盟广告", "视频广告"],
          搜索引擎: ["百度", "谷歌", "必应", "其他"]
        }
      },
      histogramChartMarkLine: {
        data: [[{ type: "min" }, { type: "max" }]]
      },
      lineChartData: {
        columns: ["日期", "锌", "铜", "占比", "其他"],
        rows: [
          {
            锌: 1523,
            日期: "1月1日",
            铜: 1523,
            占比: 0.12,
            其他: 100
          },
          {
            锌: 1223,
            日期: "1月2日",
            铜: 1523,
            占比: 0.345,
            其他: 100
          },
          {
            锌: 2123,
            日期: "1月3日",
            铜: 1523,
            占比: 0.7,
            其他: 100
          },
          {
            锌: 4123,
            日期: "1月4日",
            铜: 1523,
            占比: 0.31,
            其他: 100
          },
          {
            锌: 3123,
            日期: "1月5日",
            铜: 1523,
            占比: 0.12,
            其他: 100
          },
          {
            锌: 7123,
            日期: "1月6日",
            铜: 1523,
            占比: 0.65,
            其他: 100
          }
        ]
      },
      lineChartSettings: {
        metrics: ["铜", "锌"],
        dimension: ["日期"]
      },
      lineChartMarkPoint: {
        data: [
          {
            name: "最大值",
            type: "max"
          }
        ]
      },
      pieChartData: {
        columns: ["日期", "铜", "锌"],
        rows: [
          {
            日期: "1月1号",
            铜: 123,
            锌: 3
          },
          {
            日期: "1月2号",
            铜: 1223,
            锌: 6
          },
          {
            日期: "1月3号",
            铜: 2123,
            锌: 90
          },
          {
            日期: "1月4号",
            铜: 4123,
            锌: 12
          },
          {
            日期: "1月5号",
            铜: 3123,
            锌: 15
          },
          {
            日期: "1月6号",
            铜: 7123,
            锌: 20
          }
        ]
      },
      pieChartSettings: {
        dimension: "日期",
        metrics: "锌"
      },
      ringChartData: {
        columns: ["日期", "铜", "锌"],
        rows: [
          {
            日期: "1月1号",
            铜: 123,
            锌: 3
          },
          {
            日期: "1月2号",
            铜: 1223,
            锌: 6
          },
          {
            日期: "1月3号",
            铜: 2123,
            锌: 90
          },
          {
            日期: "1月4号",
            铜: 4123,
            锌: 12
          },
          {
            日期: "1月5号",
            铜: 3123,
            锌: 15
          },
          {
            日期: "1月6号",
            铜: 7123,
            锌: 20
          }
        ]
      },
      ringChartSettings: {
        dimension: "日期",
        metrics: "锌"
      },
      radarchartData: {
        columns: ["日期", "攻速", "攻击力", "暴击率"],
        rows: [
          { 日期: "射手", 攻速: 1393, 攻击力: 1093, 暴击率: 0.32 },
          { 日期: "辅助", 攻速: 3530, 攻击力: 3230, 暴击率: 0.26 },
          { 日期: "中单", 攻速: 2923, 攻击力: 2623, 暴击率: 0.76 }
        ]
      },
      veChartData: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "1月1日", 访问用户: 1523 },
          { 日期: "1月2日", 访问用户: 1223 },
          { 日期: "1月3日", 访问用户: 2123 },
          { 日期: "1月4日", 访问用户: 4123 },
          { 日期: "1月5日", 访问用户: 3123 },
          { 日期: "1月6日", 访问用户: 7123 }
        ]
      },
      chartSettings: { type: this.typeArr[this.index] }
    };
  },
  created: function() {},
  methods: {
    changeType: function() {
      this.index++;
      if (this.index >= this.typeArr.length) {
        this.index = 0;
      }
      this.chartSettings = { type: this.typeArr[this.index] };
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
  font-size: 22px;
  color: #1f2f3d;
}
</style>