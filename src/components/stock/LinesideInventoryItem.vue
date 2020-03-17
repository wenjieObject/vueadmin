<template>
  <div>
    <el-card shadow="always">
      <el-form ref="editFormRef" label-width="80px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="盘库单号">
              <el-input v-model="proofNo" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="库房">
              <el-input v-model="stockName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="盘点类型">
              <el-input v-model="CHECKTYPE" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="盘点物料">
              <el-input v-model="EXTENDFIELD" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="9">
            <el-steps :space="150" :active="activeState" finish-status="success">
              <el-step title="新建"></el-step>
              <el-step title="开始盘点"></el-step>
              <el-step title="下达任务"></el-step>
              <el-step title="结束盘点"></el-step>
            </el-steps>
          </el-col>

          <el-col :span="15" v-if="activeName=='stockAct'">
            <el-alert title="请注意,必须PDA操作完成后才能计算盈亏数据，计算后确认表格净重，才能执行完成盘点" type="warning" show-icon></el-alert>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="tabCard" shadow="always">
      <el-tabs v-model="activeName">
        <el-tab-pane label="库存明细" name="stockDetail">
          <el-table :data="stockDetail" style="width: 100%" stripe border>
            <el-table-column prop="storesitename" label="库位名称"></el-table-column>
            <el-table-column prop="material_code" label="物料编号"></el-table-column>
            <el-table-column prop="material_name" label="物料名称" width="380px"></el-table-column>
            <el-table-column prop="bantchno" label="批次"></el-table-column>
            <el-table-column prop="repqty" label="数量"></el-table-column>
          </el-table>

          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="stockDetailPageChange"
            :page-size="stockDetailQuery.stockDetailPageSize"
            :total="stockDetailTotal"
            :current-page.sync="stockDetailQuery.stockDetailPageIndex"
          ></el-pagination>
        </el-tab-pane>

        <el-tab-pane label="库存汇总" name="stockSum">
          <el-table :data="stockSum" height="475" style="width: 100%" stripe border>
            <el-table-column prop="material_code" label="物料编号"></el-table-column>
            <el-table-column prop="material_name" label="物料描述" width="380px"></el-table-column>
            <el-table-column prop="salesorder" label="销售订单号"></el-table-column>
            <el-table-column prop="salesorderitem" label="行项目号"></el-table-column>
            <el-table-column prop="repqty" label="MES库存数量"></el-table-column>
          </el-table>

          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="stockSumPageChange"
            :page-size="stockSumQuery.stockSumPageSize"
            :total="stockSumTotal"
            :current-page.sync="stockSumQuery.stockSumPageIndex"
          ></el-pagination>
        </el-tab-pane>

        <el-tab-pane label="实盘库存" name="stockAct">
          <el-row :gutter="25">
            <el-col :span="4">
              <el-input placeholder="请输入物料号" v-model="stockActQuery.actMaterialNo" clearable></el-input>
            </el-col>
            <el-col :span="4">
              <el-input placeholder="请输入批次号" v-model="stockActQuery.actBatchNo" clearable></el-input>
            </el-col>

            <el-col :span="2.5" style="padding-top:8px">
              <el-switch v-model="stockActQuery.isMuilty" active-text="重复批次"></el-switch>
            </el-col>

            <el-col :span="2" style="padding-top:8px">
              <el-switch v-model="stockActQuery.isprofit" active-text="仅盘盈"></el-switch>
            </el-col>

            <el-col :span="2" style="padding-top:8px">
              <el-switch v-model="stockActQuery.isloss" active-text="仅盘亏"></el-switch>
            </el-col>

            <el-col :span="2">
              <el-button type="primary" @click="btnGetStockAct">查询</el-button>
            </el-col>
            <el-col v-if="activeState==2" :span="2">
              <el-button type="info" @click="profitAndLoss">计算盈亏</el-button>
            </el-col>
            <el-col v-if="activeState==2" :span="2">
              <el-button type="warning" @click="btnCompelte">完成盘点</el-button>
            </el-col>
          </el-row>

          <el-table :data="stockAct" height="475" style="width: 100%" stripe border>
            <el-table-column prop="material_code" label="物料编号"></el-table-column>
            <el-table-column prop="material_name" label="物料描述"></el-table-column>
            <el-table-column prop="storesiteno" width="90px" label="库位号"></el-table-column>
            <!-- <el-table-column prop="storesitename" label="库位名"></el-table-column> -->
            <el-table-column prop="bantchno" label="批次"></el-table-column>
            <el-table-column prop="salesorder" label="销售订单" width="90px"></el-table-column>
            <el-table-column prop="salesorderitem" label="行项目号" width="80px"></el-table-column>
            <el-table-column prop="repqty" label="MES库存" width="80px"></el-table-column>
            <el-table-column prop="checkqty" label="净重" width="80px"></el-table-column>
            <el-table-column prop="finalqty" label="最终数量" width="80px"></el-table-column>
            <el-table-column prop="ordernumber" label="序号" width="80px"></el-table-column>
            <el-table-column v-if="activeState==2" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="stockActPageChange"
            :page-size="stockActQuery.stockActPageSize"
            :total="stockActTotal"
            :current-page.sync="stockActQuery.stockActPageIndex"
          ></el-pagination>
        </el-tab-pane>

        <!-- <el-tab-pane label="盘亏/盘盈" name="stockLost">
          <el-row>
            <el-col :span="3">
              <el-button type="primary" @click="profitAndLoss">计划盈亏</el-button>
            </el-col>
            <el-col :span="12">
              <el-alert title="请注意,必须盘库完成后才能计算盈亏数据，计算后会将盈亏结果在实盘库存展示出来" type="warning" show-icon></el-alert>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12" class="profitcol">
          <el-table :data="profitTable" height="475" style="width: 100%" stripe border>
            <el-table-column prop="MATERIALCODE" label="物料编号"></el-table-column>
            <el-table-column prop="STORESITENO" label="库位号"></el-table-column>
            <el-table-column prop="BANTCHNO" label="批次"></el-table-column>
            <el-table-column prop="SALESORDER" label="销售订单号" width="95px"></el-table-column>
            <el-table-column prop="SALESORDER_ITEM" label="行项目号"></el-table-column>
            <el-table-column prop="REPQTY" label="MES库存" width="80px"></el-table-column>
            <el-table-column prop="CHECKQTY" label="实盘库存" width="80px"></el-table-column> 
          </el-table>
            </el-col>
 

            <el-col :span="12">
          <el-table :data="lossTable" style="width: 100%" height="475" stripe border>
            <el-table-column prop="MATERIALCODE" label="物料编号"></el-table-column>
            <el-table-column prop="STORESITENO" label="库位号"></el-table-column>
            <el-table-column prop="BANTCHNO" label="批次"></el-table-column>
            <el-table-column prop="SALESORDER" label="销售订单号" width="95px"></el-table-column>
            <el-table-column prop="SALESORDER_ITEM" label="行项目号"></el-table-column>
            <el-table-column prop="REPQTY" label="MES库存" width="80px"></el-table-column>
            <el-table-column prop="CHECKQTY" label="实盘库存" width="80px"></el-table-column> 
          </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>-->
      </el-tabs>

      <!-- 弹出框 -->
      <el-dialog title="编辑实盘库存" :visible.sync="dialogFormVisible" width="50%">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="物料">
                <el-input v-model="editForm.material_code" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="批次">
                <el-input v-model="editForm.bantchno" style="width: 100%;" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="库位">
                <el-input v-model="editForm.storesitename" style="width: 100%;" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="实际库存" prop="checkqty">
                <el-input type="number" v-model.number="editForm.checkqty" style="width: 100%;"></el-input>
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
      Id: "",
      proofNo: "",
      stockName: "",
      CHECKTYPE: "",
      EXTENDFIELD: "",
      CHECKPROOFSTATE: "",
      activeName: "stockDetail",
      activeState: 0,
      //表格1
      stockDetail: [],
      stockDetailQuery: {
        stockDetailPageSize: 10,
        stockDetailPageIndex: 1
      },
      stockDetailTotal: 0,
      //表格2
      stockSum: [],
      stockSumQuery: {
        stockSumPageSize: 10,
        stockSumPageIndex: 1
      },
      stockSumTotal: 0,
      //表格3
      stockAct: [],
      stockActQuery: {
        stockActPageSize: 10,
        stockActPageIndex: 1,
        actMaterialNo: "",
        actBatchNo: "",
        proofNo: "",
        isMuilty: false,
        isprofit: false,
        isloss: false
      },
      stockActTotal: 0,
      //盘盈
      //profitTable:[],
      //lossTable:[],
      dialogFormVisible: false,
      editForm: {
        checkorderdoneid: "",
        checkqty: 0,
        storesitename: "",
        bantchno: "",
        material_code: ""
      },
      editFormRules: {
        checkqty: [
          { required: true, message: "必输", trigger: "blur" },
          { type: "number", message: "必须为数字", trigger: "blur" }
        ]
      },
      userId:'',
    };
  },
  created() {},
  methods: {
    //翻页
    stockDetailPageChange(newPage) {
      this.comChangePage(newPage, "D");
    },
    stockSumPageChange(newPage) {
      this.comChangePage(newPage, "S");
    },
    stockActPageChange(newPage) {
      this.comChangePage(newPage, "A");
    },
    comChangePage(newPage, type) {
      if (type === "D") {
        this.stockDetailQuery.stockDetailPageIndex = newPage;
        this.getstockDetails();
      } else if (type === "S") {
        this.stockSumQuery.stockSumPageIndex = newPage;
        this.getstockSum();
      } else if (type === "A") {
        this.stockActQuery.stockActPageIndex = newPage;
        this.getActstock();
      }
    },

    async getstockDetails() {
      var res = await this.$http.get("/CheckStock/GetstockDetails", {
        params: {
          id: this.Id,
          pageIndex: this.stockDetailQuery.stockDetailPageIndex,
          pageSize: this.stockDetailQuery.stockDetailPageSize
        }
      });
      if (res.status === 200) {
        var result = JSON.parse(res.data);
        this.stockDetail = result.data;
        this.stockDetailTotal = result.total;
      }
    },
    async getstockSum() {
      var res = await this.$http.get("/CheckStock/GetstockSum", {
        params: {
          id: this.Id,
          pageIndex: this.stockSumQuery.stockSumPageIndex,
          pageSize: this.stockSumQuery.stockSumPageSize
        }
      });
      if (res.status === 200) {
        var result = JSON.parse(res.data);
        this.stockSum = result.data;
        this.stockSumTotal = result.total;
      }
    },
    async getActstock() {
      this.stockActQuery.proofNo = this.proofNo;
      var res = await this.$http
        .get("/CheckStock/GetActstock", {
          params: this.stockActQuery
        })
        .catch(response => {
          this.$message.error("查询失败，请检查条件");
          this.stockAct = [];
          this.stockActTotal = 0;
          return;
        });

      if (res.status != undefined && res.status === 200) {
        var result = JSON.parse(res.data);
        this.stockAct = result.data;
        this.stockActTotal = result.total;
        this.$message.success("查询成功");
      }
    },

    btnGetStockAct() {
      this.stockActQuery.stockActPageIndex = 1;
      this.getActstock();
    },

    //删除实盘
    handleDelete(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          var res = await this.$http.post("/CheckStock/RemoveCheckDone", {
            id: row.checkorderdoneid
          });
          if (res.status != "200") {
            this.$message.error("服务器异常，请稍后重试");
            return;
          }
          var res = JSON.parse(res.data);
          if (res.ResCode === "200") {
            this.getActstock();
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

    //完成盘点
    btnCompelte() {
      this.$confirm(
        "此操作将会修改系统库存数量为盘库数量(净重)，同时关闭盘库单,请务必确认下表中的净重是实际库存, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          var res = await this.$http.post(
            "/CheckStock/CompelteCheck",
            {
              "proofNo": this.proofNo ,
              'userid':this.userId
            }
          );
          if (res.status != "200") {
            this.$message.error("服务器异常，请稍后重试");
            return;
          }
          var res = JSON.parse(res.data);
          if (res.ResCode === "200") {
            this.btnGetStockAct();
           this.activeState=4;
            return;
          } else {
            this.$message.error(res.ResMsg);
            return;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //计划盈亏
    async profitAndLoss() {
      var res = await this.$http.get("/CheckStock/GetProfitAndLoss", {
        params: { id: this.Id }
      });
      if (res.status != "200") {
        this.$message.error("服务器异常，请稍后重试");
        return;
      }
      var res = JSON.parse(res.data);
      if (res.ResCode === "200") {
        //this.profitTable=res.profits;
        //this.lossTable=res.losses;
        this.$message.success(res.ResMsg);
        return;
      } else {
        this.$message.error(res.ResMsg);
        return;
      }
    },
    //编辑实盘库存
    handleEdit(row) {
      this.editForm = row;

      this.dialogFormVisible = true;
    },
    editFunc() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          var res = await this.$http.post(
            "/CheckStock/EditCheckDone",
            this.editForm
          );
          if (res.status != "200") {
            this.$message.error("服务器异常，请稍后重试");
            return;
          }
          var res = JSON.parse(res.data);
          if (res.ResCode === "200") {
            this.$message.success(res.ResMsg);
            this.dialogFormVisible = false;
            this.getActstock();
            return;
          } else {
            this.$message.error(res.ResMsg);
            return;
          }
        } else {
          this.$message.error("请录入正确的数值！！");
          return false;
        }
      });
    }
  },

  mounted() {
    // 路由参数
    let query = this.$route.query; //query包含传递的所有参数
    var row = query.row;
    this.Id = row.ID;
    this.proofNo = row.CHECKPROOFNO;
    this.stockName = row.STOREROOMNAME;
    this.CHECKTYPE = row.CHECKTYPE;
    this.EXTENDFIELD = row.EXTENDFIELD;
    this.CHECKPROOFSTATE = row.CHECKPROOFSTATE;
    this.activeState = row.STATE - 0;

    this.getstockDetails();
    this.getstockSum();
    this.getActstock();

    this.userId=this.commonFunc.getUserByCookie('userId');
    
  }
};
</script>

<style  scoped>
.tabCard {
  padding: 2px;
}
.el-card__body {
  padding: 2px;
}
</style>