import Login from '@/views/Login'
import NotFound from '@/views/404'
import Home from '@/views/Home'
import Index0 from '@/views/index'

import Orders from '@/views/home/orders'
import Groups from '@/views/home/groups'

import Withdraw from '@/views/finance/withdraw'

import MerchantUser from '@/views/user/merchantUser'
import Users from '@/views/user/users'

import Fee from '@/views/system/fee'
import Audit from '@/views/system/audit'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/home',
        component: Home,
        name: '趣抢课',
        iconCls: 'el-icon-logo',
        children: [
            { path: '/index', component: Index0, name: '首页' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '拼团管理',
        iconCls: 'el-icon-goods',
        children: [
            { path: '/orders', component: Orders, name: '订单' },
            { path: '/groups', component: Groups, name: '拼团' },
        ]
    },
    {
        path: '/fund',
        component: Home,
        name: '资金管理',
        iconCls: 'el-icon-fund',
        children: [
            { path: '/withdraw', component: Withdraw, name: '提现' },
        ]
    },
    {
        path: '/user',
        component: Home,
        name: '用户管理',
        iconCls: 'el-icon-user',
        children: [
            { path: '/merchantUser', component: MerchantUser, name: '商家' },
            { path: '/users', component: Users, name: '用户' },
        ]
    },
    {
        path: '/system',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-setting',
        children: [
            { path: '/fee', component: Fee, name: '手续费' },
            { path: '/audit', component: Audit, name: '自动审核' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;