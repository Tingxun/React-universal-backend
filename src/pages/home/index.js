import React from 'react';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import { getCurrentUser } from '../../utils/jwt';

// 新的home页面根据用户角色显示不同的仪表盘组件
function Home() {
    const currentUser = getCurrentUser();
    
    // 根据用户角色显示不同的仪表盘
    if (currentUser && currentUser.role === 'admin') {
        return <AdminDashboard />;
    }
    
    // 默认显示商户仪表盘
    return <Dashboard />;
}

export default Home;