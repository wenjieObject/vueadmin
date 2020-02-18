<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户角色</el-breadcrumb-item>
      <el-breadcrumb-item>角色菜单</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="请先选择角色！" type="warning" show-icon></el-alert>
    </el-card>
  </div>
</template> 

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style  scoped>
</style>