<template>
  <el-row>
    <el-col :span="24" class="tool-bar">
      <p class="title fl">自动审核配置：</p>
    </el-col>
    <el-col :span="24">
      <div class="txt flex fcen">
        <p>自动审核：{{info.auto ? '是' : '否'}}</p>
        <p class="ver">版本号： {{info.controlVersion}}</p>
        <el-button class="btn" type="primary" @click="edit">{{info.auto ? '取消自动审核' : '设置自动审核'}}</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { baseUrl } from './../../api/baseUrl';
export default {
  data() {
    return {
      info: {},
    }
  },
  methods: {
    getData() {
      this.$http.get(`${baseUrl}/merchant-is-auto-audit`, {})
      .then(res => {
        if(res.data.resultCode == 200){
          this.info = Object.assign({}, JSON.parse(res.data.resultData));
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
      if(this.info.auto){
        this.$confirm('确定取消自动审核吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$http.post(`${baseUrl}/set-auto-audit?controlVersion=${this.info.controlVersion}&auto=false`, {})
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
      }else{
        this.$prompt('请输入版本号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.$http.post(`${baseUrl}/set-auto-audit?controlVersion=${value}&auto=true`, {})
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
      }
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
.ver{
  margin-left: 20px;
}
</style>
