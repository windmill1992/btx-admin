import Login from '@/views/Login'
import NotFound from '@/views/404'
import Home from '@/views/Home'

import Index0 from '@/views/home/index'
import Merchant from '@/views/home/merchant'

import Users from '@/views/user/users'

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
        path: '/',
        component: Home,
        name: '拼团管理',
        iconCls: 'el-icon-goods',
        children: [
            { path: '/index', component: Index0, name: '首页' },
            { path: '/merchant', component: Merchant, name: '商家管理' },
        ]
    },
    {
        path: '/system',
        component: Home,
        name: '资金管理',
        iconCls: 'el-icon-setting',
        children: [
            
        ]
    },
    {
        path: '/user',
        component: Home,
        name: '用户管理',
        iconCls: 'el-icon-user',
        children: [
            { path: '/users', component: Users, name: '用户' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;