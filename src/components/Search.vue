<template>
  <div class="deduction">
    <div ref="elememt">
      <el-input
        id="searchInput"
        ref="textareaRef"
        type="textarea"
        :rows="2"
        placeholder="请勿使用增删改语句"
        v-model="queryCon"
      ></el-input>
      <el-button type="info" @click="query">查询</el-button>
    </div>

    <header></header>
    <main>
      <el-table :data="tableData" border :height="tableHeight" style="width: 100%">
        <el-table-column
          v-for="(item,index) in tableDataHeader"
          :key="index"
          :prop="item.prop"
          :label="item.col"
        ></el-table-column>
      </el-table>
    </main>
  </div>
</template>


<script>
export default {
  data() {
    return {
      tableData: [],
      tableDataHeader: [],
      queryCon: "",
      tableHeight: "600"
    };
  },
  methods: {
    query() {
      this.$http
        .get("/values/GetTable", {
          params: {
            sqlStr: this.queryCon
          }
        })
        .then(response => {
          var res = JSON.parse(response.data);

          if (res.Code != "200") {
            this.$message.error(res.Message);
            return;
          } else {
            this.tableDataHeader = res.tableDataHeader;
            this.tableData = res.Data;
            this.$message(res.Message);
            this.calcHeightx();
            return;
          }
        })
        .catch(error => {
          console.log(error);
          alert("网络错误，不能访问");
        });
    },

    calcHeightx() {
      setTimeout(() => {
        //获取高度值
        let height = this.$refs.elememt.offsetHeight;
        var total = window.innerHeight;
        this.tableHeight = total - height - 100;
        let header = window.document.getElementsByClassName("el-table__header-wrapper");
        //通过原生方法，获取dom节点的高度------获取element-ui table表格body的元素
        let wapper = window.document.getElementsByClassName("el-table__body-wrapper");
        wapper[0].style.height = this.tableHeight - header[0].clientHeight + "px";
      }, 1000);
    }
  },
  mounted: function() {}
};
</script>



<style scoped>
.el-textarea {
  width: 90%;
}

.el-button {
  height: 50px;
}
</style>
 