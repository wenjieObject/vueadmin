<template>
  <div>
    <!-- 查询条件和新增 -->

    <el-card shadow="always">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="盘点单号">
          <el-input v-model="queryInfo.proofNo" placeholder="盘点单号"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="btnqueryFunc">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="warning" @click="showAddDialog">新建盘点单</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->

    <el-card shadow="always">
      <el-table :data="checkproofData" height="560" style="width: 100%" stripe border>
        <el-table-column prop="CHECKPROOFNO" label="盘点单号" width="160"></el-table-column>
        <el-table-column prop="CHECKPROOFSTATE" label="状态" width="100"></el-table-column>
        <el-table-column prop="STOREROOMNAME" label="库房" width="250"></el-table-column>
        <el-table-column prop="CHECKTYPE" label="盘库类型	" width="100"></el-table-column>
        <el-table-column prop="EXTENDFIELD" label="物料类型	" width="350"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleCheck(scope.row)">查看</el-button>
            <el-button
              type="danger"
              v-if="scope.row.CHECKPROOFSTATE=='新建'"
              size="mini"
              @click="handleDeleteCheck(scope.row)"
            >删除</el-button>
            <el-button
              type="info"
              v-if="scope.row.CHECKPROOFSTATE=='新建'"
              size="mini"
              @click="handleBeginCheck(scope.row)"
            >开始盘点</el-button>
            <el-button
              type="warning"
              v-if="scope.row.CHECKPROOFSTATE=='下达任务'"
              size="mini"
              @click="handleEndCheck(scope.row)"
            >结束盘点</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="queryInfo.pageSize"
        :total="total"
        :current-page.sync="queryInfo.pageIndex"
      ></el-pagination>
    </el-card>

    <!-- 弹出框 -->
    <el-dialog title="新增盘点单" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="editForm" ref="editFormRef" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="盘库单号">
              <el-input v-model="editForm.proofNo" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="日期">
              <el-date-picker disabled v-model="datetimeval" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="库房类型">
              <el-select
                v-model="editForm.stocktype"
                @change="changestocktype"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in stocktypes"
                  :key="item.VALUEX"
                  :label="item.DESCX"
                  :value="item.VALUEX"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="库房">
              <el-select v-model="editForm.stockId" filterable placeholder="请选择">
                <el-option
                  v-for="item in storeChecks"
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
            <el-form-item label="备 注">
              <el-input v-model="editForm.checkProofDesc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="盘点类型">
              <el-select v-model="editForm.checkType" @change="changeCheckType" placeholder="请选择">
                <el-option
                  v-for="item in checkTypeoptions"
                  :key="item.valuex"
                  :label="item.descx"
                  :value="item.valuex"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="editForm.checkType=='2'">
          <el-col :span="22">
            <el-checkbox-group v-model="editForm.materialCheckList">
              <el-checkbox
                v-for="item in materialTypeChecks"
                :key="item.VALUEX"
                :label="item.VALUEX"
              >{{item.DESCX}}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFunc">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template> 

<script>
export default {
  data() {
    return {
      checkproofData: [],
      queryInfo: {
        proofNo: "",
        pageIndex: 1,
        pageSize: 20
      },
      total: 0,
      dialogFormVisible: false,
      editForm: {
        proofNo: "",
        stockId: "",
        checkProofDesc: "",
        checkType: "1",
        materialCheckList: [],
        userId: "",
        stocktype: "1"
      },
      storeChecks: [],
      materialTypeChecks: [],
      checkTypeoptions: [
        { valuex: "1", descx: "全部盘点" },
        { valuex: "2", descx: "局部盘点" }
      ],
      stocktypes: [
        { VALUEX: "1", DESCX: "仓库" },
        { VALUEX: "2", DESCX: "线边库" }
      ],
      datetimeval: new Date()
    };
  },
  created() {
    this.editForm.userId = this.commonFunc.getUserByCookie('userId');
    this.getSimpleDic();
  },
  mounted() {},
  methods: {
    //开始盘点
    async handleBeginCheck(row) {
     
      var res = await this.$http.post("/CheckStock/BeginCheckProof", {
         id:row.ID
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      var result = JSON.parse(res.data);
      console.log(result);
      if (result.ResCode === "200") {
        this.$message.success(result.ResMsg);
        this.btnqueryFunc();
      } else {
        this.$message.error(result.ResMsg);
      }
    },
    //页面查询
    btnqueryFunc() {
      this.queryInfo.pageIndex = 1;
      this.queryFunc();
    },
    async queryFunc() {
      var res = await this.$http.get("/CheckStock/GetCheckProofs", {
        params: this.queryInfo
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      var result = JSON.parse(res.data);
      this.checkproofData = result.data;
      this.total = result.total;
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageIndex = newPage;
      this.queryFunc();
    },
    //跳转查看明细页面
    handleCheck(row) {
      //   直接调用$router.push 实现携带参数的跳转
      this.$router.push({
        path: "/LinesideInventoryItem", //跳转路径
        name: "LinesideInventoryItem", //跳转路径的name值，不写跳转后页面取不到参数 // 参数
        query: {
          row: row
        }
      });
    },
    //新增盘点单
    changestocktype() {
      this.editForm.stockId = "";
      this.storeChecks = [];
      this.getSimpleDic();
    },
    async showAddDialog() {
      var res = await this.$http.get("/CheckStock/GetSequenceBatchNo");
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      this.editForm.proofNo = res.data;

      this.dialogFormVisible = true;
    },
    changeCheckType() {
      this.editForm.materialCheckList = [];
    },
    async editFunc() {
      //check
      if (this.editForm.proofNo == "" || this.editForm.stockId == "") {
        this.$message.error("请输入必输项");
        return;
      }
      if (
        this.editForm.checkType == "2" &&
        this.editForm.materialCheckList.length == 0
      ) {
        this.$message.error("局部盘点必须选择物料类型！");
        return;
      }

      var res = await this.$http.post(
        "/CheckStock/CreateCheckProof",
        this.editForm
      );
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      var result = JSON.parse(res.data);
      if (result.ResCode === "200") {
        this.$message.success(result.ResMsg);
        this.dialogFormVisible = false;
        this.btnqueryFunc();
      } else {
        this.$message.error(result.ResMsg);
      }
    },
 
  
    async getSimpleDic() {
      var res = await this.$http.get("/CheckStock/GetSimpleDic", {
        params: {
          userId: this.editForm.userId,
          stocktype: this.editForm.stocktype
        }
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      var result = JSON.parse(res.data);

      this.storeChecks = result.stores;
      this.materialTypeChecks = result.materialTypes;
    },
    handleEndCheck(row){
      this.$message.error("请点击查看后执行完成盘点");
    }
  }
};
</script>

<style  scoped>
.el-select {
  width: 100%;
}
.el-date-picker {
  width: 100%;
}
</style>