<template>
  <el-row>
    <el-col :span="24" class="tool-bar">
      <p class="title fl">手续费配置：</p>
    </el-col>
    <el-col :span="24">
      <div class="txt flex fcen">
        <p>手续费：{{fee}}</p>
        <el-button class="btn" type="primary" @click="edit">修改</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { baseUrl } from './../../api/baseUrl';
export default {
  data() {
    return {
      fee: 0,
    }
  },
  methods: {
    getData() {
      this.$http.get(`${baseUrl}/fee`, {})
      .then(res => {
        if(res.data.resultCode == 200){
          this.fee = res.data.resultData;
        }else{
          if(res.data.resultMsg){
            this.$message.error(res.data.resultMsg);
          }else{
            this.$message.error('服务器错误！');
          }
        }
      })
      .catch(() => {
        this.loading = false;
        this.$message.error('未知错误！');
      })
    },
    edit() {
      this.$prompt('请输入手续费（如5% 请输入0.05）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.$http.post(`${baseUrl}/manage/save-fee?fee=${value}`, {})
        .then(res => {
          if(res.data.resultCode == 200 && res.data.resultData){
            this.$message.success('修改成功！');
            this.getData();
          }else{
            if(res.data.resultMsg){
              this.$message.error(res.data.resultMsg);
            }else{
              this.$message.error('服务器错误！');
            }
          }
        })
      }).catch(() => {})
    },
  },
  mounted() {
    this.getData();
  }
}
</script>
<style scoped>
.btn{
  margin-left: 50px;
}
</style>
