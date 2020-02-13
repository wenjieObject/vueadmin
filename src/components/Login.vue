<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>

      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginRules"
      >
        <el-form-item prop="userName">
          <el-input prefix-icon="iconfont icon-huiyuan" v-model="loginForm.userName"></el-input>
        </el-form-item>

        <el-form-item prop="passWord">
          <el-input prefix-icon="iconfont icon-tongji" v-model="loginForm.passWord" type="password"></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="login">提交</el-button>
          <el-button type="info" @click="restLoginForm">忘记密码</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
export default {
  name: "",
  data() {
    return {
      // 登录表单数据对象
      loginForm: {
        userName: "admin",
        passWord: "123456@"
      },

      loginRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码错误", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //忘记密码
    restLoginForm() {
      //this.$refs.loginFormRef.resetFields(); //重置
      this.$message('请咨询管理员_jiang');
    },

    //登录
    login() {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) {
          return;
        }

        if (this.loginForm.userName == "admin" && this.loginForm.passWord == "123456@") {
          this.$message('登录成功');
          //token保存下来，以后发起请求需要校验token
          window.sessionStorage.setItem('token','12306');
          
          //跳转到home
          this.$router.push('/home');

        } else {
          this.$message.error("登录失败，用户名或密码错误");
        }
      });
    }
  }
};
</script>

<style  scoped>
.login_container {
  background-color: #2d3b50;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  /* 位移自身的宽高量 */
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1 solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  padding: 10px;
  background-color: #fff;
  transform: translate(-50%, -50%);
}

img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>