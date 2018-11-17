<template>
    <el-row>
        <el-col :span="24" class="tool-bar">
            <p class="title fl">商家列表</p>
            <div class="fr">
                <el-input v-model="keywords" placeholder="搜索商家名称" class="fl" style="width: 200px;"></el-input>
                <el-select v-model="auditStatus" placeholder="状态" class="fl">
                    <el-option value="" label="全部"></el-option>
                    <el-option :value="1" label="待审核"></el-option>
                    <el-option :value="2" label="审核通过"></el-option>
                    <el-option :value="3" label="审核不通过"></el-option>
                </el-select>
                <el-button type="primary" class="fl" @click="search">搜索</el-button>
            </div>
        </el-col>
        <el-col :span="24">
            <el-table :data="list" highlight-current-row v-loading="loading" border style="width: 100%;height: 90%;">
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="userId" label="商户ID" width="80"></el-table-column>
                <el-table-column prop="merchantName" label="商家名称" min-width="220" show-overflow-tooltip></el-table-column>
                <el-table-column prop="city" label="所在城市" width="150"></el-table-column>
                <el-table-column prop="merchantIndustry" label="所处行业" width="180"></el-table-column>
                <el-table-column prop="linkMobile" label="联系电话" width="130"></el-table-column>
                <el-table-column label="操作" min-width="150">
                    <template slot-scope="scope">
                        <div class="flex fcen">
                            <el-button type="info" class="btn" @click="showDetail(scope.row)">详情</el-button>
                            <el-button type="success" class="btn" v-if="scope.row.auditStatus == 1" size="small" @click="pass(scope.row.userId, 1)">通过</el-button>
                            <el-button type="danger" class="btn" v-if="scope.row.auditStatus == 1" size="small" @click="pass(scope.row.userId, 0)">不通过</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="curChange" :current-page="curPage" 
                :page-size="pageSize" :total="total" layout="total, prev, pager, next" class="page fr">
            </el-pagination>
        </el-col>
        <el-dialog :visible.sync="showModal" :title="title" custom-class="edit-dialog" center style="top: 30%;">
            <div class="edit-d flex fcen">
                <div class="logo">
                    <img :src="detailInfo.logo" alt="logo">
                    <p>{{detailInfo.merchantName}}</p>
                </div>
                <div class="box flex">
                    <div class="con">
                        <div class="flex fcen">
                            <p class="label">行业</p>
                            <p class="txt">{{detailInfo.merchantIndustry}}</p>
                        </div>
                        <div class="flex fcen">
                            <p class="label">城市</p>
                            <p class="txt">{{detailInfo.city}}</p>
                        </div>
                        <div class="flex fcen">
                            <p class="label">地址</p>
                            <p class="txt">{{detailInfo.address}}</p>
                        </div>
                    </div>
                    <div class="con">
                        <div class="flex fcen">
                            <p class="label">联系人</p>
                            <p class="txt">{{detailInfo.linkMan}}</p>
                        </div>
                        <div class="flex fcen">
                            <p class="label">手机号</p>
                            <p class="txt">{{detailInfo.linkMobile}}</p>
                        </div>
                        <div class="flex fcen">
                            <p class="label">微信号</p>
                            <p class="txt">{{detailInfo.linkWechat}}</p>
                        </div>
                    </div>
                </div>
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
            auditStatus: '',
            keywords: '',
            title: '商家详情',
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
            this.loading = true;
            let param = {
                pageIndex: this.curPage, 
                pageSize: this.pageSize,
                auditStatus: this.auditStatus,
                keywords: this.keywords,
            };
            this.$http.post(`${baseUrl}/manage/merchant-list`, param)
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
        pass(uid, b) {
            let p = b == 1 ? true : false;
            this.$confirm(`确定${p ? '' : '不'}通过该商家审核吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$http.post(`${baseUrl}/manage/audit-merchant-extend-info?isPass=${p}&authstr=${uid}`,{})
                .then(res => {
                    if(res.data.resultCode == 200 && res.data.resultData){
                        this.getData();
                    }
                })
            }).catch(() => {});
        },
    },
    mounted() {
        this.getData();
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
.edit-d .logo{
    color: #000;
    text-align: center;
    display: inline-block;
}
.edit-d .logo img{
    width: 60px;
    height: 60px;
    border-radius: 6px;
}
.edit-d .box{
    margin-left: 50px;
}
.edit-d .box .con{
    margin-right: 20px;
    color: #000;
    line-height: 2.5;
}
.edit-d .box .label{
    margin-right: 30px;
    color: #999;
    margin-bottom: 0;
}
.edit-d .box .txt{
    max-width: 200px;
    word-break: break-all;
}
</style>
