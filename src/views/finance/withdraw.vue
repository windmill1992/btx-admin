<template>
    <el-row>
        <el-col :span="24" class="tool-bar">
            <p class="title fl">提现列表</p>
            <div class="fr">
                <el-input v-model="keywords" placeholder="搜索用户手机号／用户名" class="fl" style="width: 200px;"></el-input>
                <el-select v-model="orderStatus" placeholder="提现状态" class="fl">
                    <el-option value="" label="全部"></el-option>
                    <el-option :value="1" label="进行中"></el-option>
                    <el-option :value="2" label="已完成"></el-option>
                </el-select>
                <el-button type="primary" class="fl" @click="search">搜索</el-button>
            </div>
        </el-col>
        <el-col :span="24">
            <el-table :data="list" highlight-current-row v-loading="loading" border style="width: 100%;height: 90%;">
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="withdrawRecordId" label="订单编号" width="100"></el-table-column>
                <el-table-column prop="userId" label="商家ID" width="100"></el-table-column>
                <el-table-column prop="capital" label="提现金额" width="150"></el-table-column>
                <el-table-column prop="applyTime" label="申请时间" width="250"></el-table-column>
                <el-table-column label="状态" width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1">申请中</span>
                        <span v-else>已打款</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="150">
                    <template slot-scope="scope">
                        <div class="flex fcen">
                            <el-button type="info" class="btn" @click="showDetail(scope.row)">详情</el-button>
                            <el-button type="primary" class="btn" @click="sure(scope.row.withdrawRecordId)">已打款</el-button>
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
                <p class="txt">订单编号：{{detailInfo.orderNo}}</p>
                <p class="txt">商家名称：{{detailInfo.merchantName}}</p>
                <p class="txt">提现金额{{detailInfo.payPrice}}</p>
                <p class="txt">提现时间{{detailInfo.payUserName}}</p>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
import { baseUrl } from './../../api/baseUrl'

export default {
    data() {
        return {
            list: [],
            curPage: 1,
            pageSize: 20,
            total: 0,
            loading: false,
            orderStatus: '',
            keywords: '',
            title: '提现详情',
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
            // this.getData();
        },
        getData() {
            this.loading = true;
            let param = {
                pageIndex: this.curPage, 
                pageSize: this.pageSize,
                orderStatus: this.orderStatus,
                keywords: this.keywords,
            };
            this.$http.post(`${baseUrl}/manage/order-list`, param)
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
                    this.$message({
                        message: res.data.resultMsg,
                        type: 'error',
                        duration: 0,
                        showClose: true
                    })
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
        sure(id) {
            
        }
    },
    mounted() {
        // this.getData();
    }
}
</script>

<style scoped>
@import url(./../../assets/css/home/table.css);
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
