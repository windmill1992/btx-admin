<template>
    <el-row>
        <el-col :span="24">
            <div class="header">
                <el-col :span="6" class="item">
                    <p class="num">{{countData.merchantCount}}</p>
                    <p class="name">商家总数</p>
                </el-col>
                <el-col :span="6" class="item">
                    <p class="num">{{countData.userCount}}</p>
                    <p class="name">用户总数</p>
                </el-col>
                <el-col :span="6" class="item">
                    <p class="num">{{countData.tradingFlow}}</p>
                    <p class="name">流水合计</p>
                </el-col>
            </div>
            <div class="header">
                <el-col :span="6" class="item">
                    <p class="num">{{countData.waitAuditMerchant}}</p>
                    <p class="name">待审核商家</p>
                </el-col>
                <el-col :span="6" class="item">
                    <p class="num">{{countData.todayPayCount}}</p>
                    <p class="name">今日付款总数</p>
                </el-col>
                <el-col :span="6" class="item">
                    <p class="num">{{countData.todayGruopBuyingCount}}</p>
                    <p class="name">今日发起拼单数量</p>
                </el-col>
            </div>
            <p class="tip">快捷入口</p>
            <div class="quick-enter">
                <router-link to="merchant" class="item">审核商家</router-link>
                <router-link to="withdraw" class="item">管理提现</router-link>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import { baseUrl } from "./../../api/baseUrl"
export default {
    data() {
        return {
            countData: {},
        }
    },
    methods: {
        getIndexData() {
            this.$http.get(`${baseUrl}/manage/index`, {})
            .then(res => {
                if(res.data.resultCode == 200 && res.data.resultData){
                    this.countData = Object.assign({}, res.data.resultData);
                }else{
                    this.$message.error(res.data.resultMsg);
                }
            })
            .catch(() => {
                this.$message.error('未知错误！');
            })
        }
    },
    mounted() {
        this.getIndexData();
    }
}
</script>

<style scoped>
    .header{
        padding: 10px 20px;
        background: #f2f2f2;
        overflow: hidden;
    }
    .header .item{
       text-align: center;
       font-size: 16px;
    }
    .header .item .num{
        font-size: 22px;
        font-weight: 600;
    }
    .tip{
        margin: 10px 0;
        font-size: 14px;
    }
    .quick-enter{
        padding: 0;
    }
    .quick-enter .item{
        display: inline-block;
        width: 150px;
        height: 50px;
        line-height: 50px;
        margin-right: 20px;
        text-align: center;
        background: #f2f2f2;
        color: #333;
        text-decoration: none;
    }
</style>
