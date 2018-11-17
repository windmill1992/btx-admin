<template>
    <el-row>
        <el-col :span="24" class="tool-bar">
            <p class="title fl">拼团订单</p>
            <div class="fr">
                <el-select v-model="userType" placeholder="选择商家或用户" class="fl">
                    <el-option :value="1" label="商家"></el-option>
                    <el-option :value="2" label="用户"></el-option>
                </el-select>
                <el-input v-model="keywords" v-if="userType == 1" placeholder="输入商家id查询" class="fl" style="width: 200px;"></el-input>
                <el-input v-model="keywords" v-else-if="userType == 2" placeholder="输入用户id查询" class="fl" style="width: 200px;"></el-input>
                <el-select v-model="orderStatus" placeholder="订单状态" class="fl">
                    <el-option value="" label="全部"></el-option>
                    <el-option :value="1" label="进行中"></el-option>
                    <el-option :value="2" label="已完成"></el-option>
                    <el-option :value="3" label="已失效"></el-option>
                </el-select>
                <el-button type="primary" class="fl" @click="search">搜索</el-button>
            </div>
        </el-col>
        <el-col :span="24">
            <el-table :data="list" highlight-current-row v-loading="loading" border style="width: 100%;height: 90%;">
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="merchantName" label="商家名称" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="proName" label="商品名称" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column label="发起人" width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.originator.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单类型"width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.payType == 1">拼团购买</span>
                        <span v-else-if="scope.row.payType == 2">直接购买</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.groupBuyingStatus == 1">进行中</span>
                        <span v-else-if="scope.row.groupBuyingStatus == 2">已完成</span>
                        <span v-else-if="scope.row.groupBuyingStatus == 3">已失败</span>
                    </template>
                </el-table-column>
                <el-table-column label="成交时间" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.bussinessShowTime}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="操作" min-width="120">
                    <template slot-scope="scope">
                        <div class="flex fcen">
                            <el-button type="info" class="btn" @click="showDetail(scope.row)">详情</el-button>
                        </div>
                    </template>
                </el-table-column> -->
            </el-table>
            <el-pagination @current-change="curChange" :current-page="curPage" 
                :page-size="pageSize" :total="total" layout="total, prev, pager, next" class="page fr">
            </el-pagination>
        </el-col>
        <el-dialog :visible.sync="showModal" :title="title" custom-class="edit-dialog" center style="top: 30%;">
            <div class="edit-d">
                <p class="txt">商家名称：{{detailInfo.merchantName}}</p>
                <p class="txt">商品名称：{{detailInfo.proName}}</p>
                <p class="txt">发起人：{{detailInfo.originator ? detailInfo.originator.userName : ''}}</p>
                <p class="txt">订单类型：{{detailInfo.payType == 1 ? '拼团购买' : '直接购买'}}</p>
                <p class="txt" v-if="detailInfo.groupBuyingStatus == 1">订单状态： 进行中</p>
                <p class="txt" v-else-if="detailInfo.groupBuyingStatus == 2">订单状态： 已完成</p>
                <p class="txt" v-else-if="detailInfo.groupBuyingStatus == 3">订单状态： 已失败</p>
                <p class="txt">发起时间：{{detailInfo.bussinessShowTime}}</p>
                <p class="txt">截止时间：{{detailInfo.groupBuyingEndTimeShow}}</p>
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
            orderStatus: '',
            userType: '',
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
            if(!this.userType){
                this.$message.error('请选择商家或用户');
                return;
            }
            if(!this.keywords){
                this.$message.error('请输入id');
                return;
            }
            let param = {
                pageIndex: this.curPage, 
                pageSize: this.pageSize,
                orderStatus: this.orderStatus,
            };
            if(this.userType == 1){
                param.merchantUserId = this.keywords;
            }else if(this.userType == 2) {
                param.userId = this.keywords;
            }
            this.loading = true;
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
            row.groupBuyingEndTimeShow = moment(new Date(row.groupBuyingEndTimeShow)).format('YYYY-MM-DD HH:mm:ss');
            this.detailInfo = Object.assign({}, row);
            this.showModal = true;
        },
    },
    mounted() {
        
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
