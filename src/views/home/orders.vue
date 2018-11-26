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
                    <el-option :value="1" label="未支付"></el-option>
                    <el-option :value="2" label="已完成"></el-option>
                    <el-option :value="3" label="已退款"></el-option>
                </el-select>
                <el-button type="primary" class="fl" @click="search">搜索</el-button>
            </div>
        </el-col>
        <el-col :span="24">
            <el-table :data="list" highlight-current-row v-loading="loading" border style="width: 100%;height: 90%;">
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="merchantName" label="商家名称" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="groupId" label="拼团ID" width="90"></el-table-column>
                <el-table-column prop="groupBuyingName" label="拼团名称" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="payPrice" label="购买价格" width="120"></el-table-column>
                <el-table-column label="支付用户" width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.payUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单类型"width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.payType == 1">拼团购买</span>
                        <span v-else-if="scope.row.payType == 2">直接购买</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付时间" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.payTime ? scope.row.payTime : '' | fmt}}</span>
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
                param.merchantId = this.keywords;
            }else if(this.userType == 2) {
                param.userId = this.keywords;
            }
            this.loading = true;
            this.$http.post(`${baseUrl}/manage/order-list-v2`, param)
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
    },
    filters: {
        fmt(t) {
            if(!t) return '';
            return moment(new Date(t)).format('YYYY-MM-DD HH:mm:ss');
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
