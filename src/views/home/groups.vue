<template>
    <el-row>
        <el-col :span="24" class="tool-bar">
            <p class="title fl">拼团列表</p>
            <div class="fr">
                <el-input v-model="keywords" placeholder="输入商家id查询" class="fl" style="width: 200px;"></el-input>
                <el-select v-model="status" placeholder="拼团状态" class="fl">
                    <el-option value="0" label="全部"></el-option>
                    <el-option :value="1" label="进行中"></el-option>
                    <el-option :value="2" label="已结束"></el-option>
                </el-select>
                <el-button type="primary" class="fl" @click="search">搜索</el-button>
            </div>
        </el-col>
        <el-col :span="24">
            <el-table :data="list" highlight-current-row v-loading="loading" border style="width: 100%;height: 90%;">
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="groupBuyingId" label="ID" width="80"></el-table-column>
                <el-table-column prop="merchantName" label="商家名称" min-width="220" show-overflow-tooltip></el-table-column>
                <el-table-column prop="proName" label="拼团名称" min-width="220" show-overflow-tooltip></el-table-column>
                <el-table-column prop="soldQuantity" label="已售数量" width="120"></el-table-column>
                <el-table-column label="截止时间" width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.groupBuyingEndTimeShow | fmt}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="拼团状态" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.groupBuyingStatus == 1">进行中</span>
                        <span v-else>已结束</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="150">
                    <template slot-scope="scope">
                        <div class="flex fcen">
                            <el-button type="info" class="btn" @click="showDetail(scope.row)">详情</el-button>
                            <el-button type="danger" class="btn" v-if="scope.row.groupBuyingStatus == 1" @click="offline(scope.row.groupBuyingId)">下架</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="curChange" :current-page="curPage" 
                :page-size="pageSize" :total="total" layout="total, prev, pager, next" class="page fr">
            </el-pagination>
        </el-col>
        <el-dialog :visible.sync="showModal" :title="title" custom-class="edit-dialog" center style="top: 30%;">
            <div class="edit-d">
                <p class="txt">商家名称：{{detailInfo.merchantName}}</p>
                <p class="txt">拼团名称：{{detailInfo.proName}}</p>
                <p class="txt">已售件数：{{detailInfo.soldQuantity}}</p>
                <p class="txt">截止时间：{{detailInfo.groupBuyingEndTimeShow | fmt}}</p>
                <p class="txt">拼团状态：{{detailInfo.groupBuyingStatus == 1 ? '进行中' : '已结束'}}</p>
                <p class="txt">拼团人数：{{detailInfo.groupBuyingNumber}}</p>
                <p class="txt">拼团价格：{{detailInfo.groupBuyingPrice}}</p>
                <p class="txt">商品数量：{{detailInfo.proCount}}</p>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
import { baseUrl } from './../../api/baseUrl'
const moment = require('moment');
export default {
    data() {
        return {
            list: [],
            curPage: 1,
            pageSize: 20,
            total: 0,
            loading: false,
            status: '',
            keywords: '',
            title: '订单详情',
            showModal: false,
            detailInfo: {},
        }
    },
    methods: {
        curChange(idx) {
            this.curPage = idx;
            this.getData();
        },
        search() {
            this.curPage = 1;
            this.getData();
        },
        getData() {
            let param = {
                pageIndex: this.curPage, 
                pageSize: this.pageSize,
                groupBuyingStatus: this.status,
                merchantUserId: this.keywords,
            };
            this.loading = true;
            this.$http.post(`${baseUrl}/manage/group-buying-list`, param)
            .then(res => {
                this.loading = false;
                if(res.data.resultCode == 200 && res.data.resultData){
                    let r = res.data.resultData;
                    if(r.list && r.list.length > 0){
                        this.list = r.list;
                        this.total = r.total;
                    }else{
                        this.list = [];
                        this.total = 0;
                    }
                }else{
                  if(res.data.resultMsg){
                    this.$message({
                        message: res.data.resultMsg,
                        type: 'error',
                        duration: 0,
                        showClose: true
                    })
                  }else{
                      this.$message.error('服务器错误');
                  }
                }
            })
            .catch(e => {
                this.loading = false;
                this.$message.error('未知错误！' + e);
                console.log(e);
            })
        },
        showDetail(row) {
            this.detailInfo = Object.assign({}, row);
            this.showModal = true;
        },
        offline(id) {
            this.$confirm('确定下架该拼团吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.$http.post(`${baseUrl}/manage/offline-group-buying?groupBuyingId=${id}`, {})
                .then(res => {
                    if(res.data.resultCode == 200 && res.data.resultData){
                        this.$message.success('下架成功！');
                        this.getData();
                    }else{
                        if(res.data.resultMsg){
                            this.$message.error(res.data.resultMsg);
                        }else{
                            this.$message.error('服务器错误！');
                        }
                    }
                })
                .catch(err => {
                    this.$message.error('未知异常！');
                    console.log(err);
                })
            }).catch(() => {})
        }
    },
    filters: {
      fmt(t) {
        if(!t) return '';
        return moment(new Date(t)).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    mounted() {
        this.getData();
    }
}
</script>

<style scoped>
.btn{
    margin-right: 5px;
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
}
.el-input, .el-select{
    margin-right: 10px;
}
.edit-d .txt{
    color: #000;
    padding: 10px;
}
</style>
