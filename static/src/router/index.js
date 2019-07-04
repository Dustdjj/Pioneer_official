import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/table0',
                    component: resolve => require(['../components/page/User.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/table1',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '产品表单' }
                },
                {
                    path: '/table2',
                    component: resolve => require(['../components/page/News.vue'], resolve),
                    meta: { title: '新闻中心' }
                },
                {
                    path: '/table3',
                    component: resolve => require(['../components/page/Tec.vue'], resolve),
                    meta: { title: '技术支持' }
                },
                {
                    path: '/upload0',
                    component: resolve => require(['../components/page/Upload0.vue'], resolve),
                    meta: { title: '产品上传' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '新闻上传' }   
                },
                {
                    // 图片上传组件
                    path: '/upload1',
                    component: resolve => require(['../components/page/Upload1.vue'], resolve),
                    meta: { title: '技术文章上传' }   
                },
          
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
