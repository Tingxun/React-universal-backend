import React from 'react';
import { useState } from 'react';
// 父组件中需添加Outlet渲染子路由
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import AsideComponent from '../components/aside';
import HeaderComponent from '../components/header';
import TagComponent from '../components/tag';
import RouteGuard from '../router/RouteGuard';

const { Content } = Layout;

function Main (){
    const [collapsed, setCollapsed] = useState(false);
    const [navItem, setNavItem] = useState({});

    return (
        <RouteGuard>
            <Layout className='main-container'>
            <AsideComponent collapsed={collapsed} setNavItem={setNavItem} />
            <Layout>
                <HeaderComponent collapsed={collapsed} setCollapsed={setCollapsed} />
                <TagComponent navItem={navItem} />
                <Content
                style={{
                    margin: '20px 16px',
                    padding: 24,
                    minHeight: 280,
                    background: 'LightGray',
                    borderRadius: '10px',
                }}
                >
                <Outlet />
                </Content>
            </Layout>
        </Layout>
        </RouteGuard>
    );
}

export default Main;
