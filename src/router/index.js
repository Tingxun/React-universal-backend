import {createBrowserRouter, Navigate} from 'react-router-dom';
import Main from '../pages/main';
import Home from '../pages/home';   
import Sales from '../pages/sales';
import Merchandise from '../pages/merchandise';
import Login from '../pages/login';
import Register from '../pages/register';
import PageTwo from '../pages/other/pageTwo';
import PageOne from '../pages/other/pageOne';
import PersonalCenter from '../pages/personal';
import RouteGuard from './RouteGuard';

/**
 * router对象的属性及作用：
 * children：子路由。
 * basename：设置应用的基路径。
 * path：定义路由的路径。
 * element：指定到达路径时渲染的React组件(JSX)。
 * element：React.lazy()，通过动态导入实现组件的懒加载，提升应用性能。
 * errorElement：指定在路由匹配失败时渲染的组件。
 * loader：定义一个用于在渲染组件之前加载数据的函数，
 * 数据可以通过useLoaderData钩子在组件中访问。
 * action：定义一个用于处理表单提交或其他路由级别的操作的函数。
 */

// 1、配置路由
// 此时为静态路由，可考虑添加动态路由增加路由的可维护性和灵活性
//
const routes = [
    {
        path: '/',
        element: <Main />,
        children: [
            {
                // 默认重定向
                path: '/',
                element: <Navigate to='/home' />
            },
            {
                path: 'home',
                element: <Home />,
            },
            {
                path: 'personal',
                element: (
                    <RouteGuard requiredRoles={['admin', 'merchant', 'sales']} redirectTo="/login">
                        <PersonalCenter />
                    </RouteGuard>
                ),
            },
            {
                path: 'sales',
                element: (
                    <RouteGuard requiredRoles={['admin']} redirectTo="/home">
                        <Sales />
                    </RouteGuard>
                ),
            },
            {
                path: 'merchandise',
                element: (
                    <RouteGuard requiredRoles={['admin', 'merchant', 'sales']} redirectTo="/login">
                        <Merchandise />
                    </RouteGuard>
                ),
            },
            {
                path: 'other',
                children: [
                    {
                        path: 'pageOne',
                        element: <PageOne />,
                    },
                    {
                        path: 'pageTwo',
                        element: <PageTwo />,
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    }
];

/**
 * 路由器的选择：
 * createBrowserRouter：
 * 提供干净的URL结构，可用于服务器端配置
 * 适用于需要良好SEO支持的应用
 * 需要服务器端渲染（SSR）
 * createHashRouter：
 * 带有Hash的URL，难以控制服务器端配置
 * 适用于不需要SEO的应用
 * 适合快速部署简单路由配置
 */
export default createBrowserRouter(routes);