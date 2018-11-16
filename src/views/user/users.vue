<template>
    <el-row>
        <el-col :span="24" class="tool-bar">
            <p class="title fl">用户列表</p>
            <div class="fr flex">
                <el-input v-model="userName" placeholder="搜索用户名"></el-input>
                <el-button type="primary" @click="search" style="margin-left: 20px;">搜索</el-button>
            </div>
        </el-col>
        <el-col :span="24">
            <el-table :data="list" highlight-current-row v-loading="loading" border style="width: 100%;height: 80%;">
                <el-table-column type="index" label="#" width="60"></el-table-column>
                <el-table-column prop="userId" label="用户ID" width="80"></el-table-column>
                <el-table-column prop="userName" label="昵称" min-width="150"></el-table-column>
                <el-table-column prop="avatar" label="头像" min-width="250" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-pagination @current-change="curChange" :current-page="curPage" 
                :page-size="pageSize" :total="total" layout="total, prev, pager, next" class="page fr">
            </el-pagination>
        </el-col>
    </el-row>
</template>

<script>
var moment = require('moment');
import { baseUrl } from './../../api/baseUrl'

export default {
  data() {
    return {
      list: [],
      curPage: 1,
      pageSize: 20,
      total: 0,
      loading: false,
      userName: '',
    };
  },
  methods: {
    getUserList() {
        this.loading = true;
        let data = {
            pageIndex: this.curPage,
            pageSize: this.pageSize,
            keywords: this.userName,
        };
        this.$http.post(`${baseUrl}/manage/user-list`, data)
        .then(res => {
            this.loading = false;
            if(res.data.resultCode == 200 && res.data.resultData){
                let r = res.data.resultData;
                this.list = r.list;
                this.total = r.total;
            }else{
                this.list = [];
                this.total = 0;
                this.$message.error(res.data.resultMsg);
            }
        })
        .catch(e => {
            this.loading = false;
            this.$message.error('未知错误！');
            console.log(e);
        })
    },
    curChange(idx) {
        this.curPage = idx;
        this.getUserList();
    },
    search() {
        this.curPage = 1;
        this.getUserList();
    },
    formatTime(row, column){
        return moment(new Date(row.regisTime)).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  mounted() {
      this.getUserList();
      let _this = this;
      window.addEventListener('keypress', function(e){
        if(e.keyCode == 13){
            _this.curPage = 1;
            _this.getUserList();
        }
      }, false);
  },
  beforeDestroy() {
      let _this = this;
      window.removeEventListener('keypress', function(e){}, false);
  }
};
</script>

<style scoped>
.el-table th>.cell{
    white-space: nowrap;
}
.tool-bar {
  line-height: 36px;
  margin-bottom: 15px;
}
.icon{
    display: inline-block;
    margin-right: 10px;
    width: 18px;
    height: 18px;
    background: url(./../../assets/img/logo.png) no-repeat 0 0 / 100% 100%;
}
</style>
