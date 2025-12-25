import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/jwt';

/**
 * 路由守卫组件
 * @param {Object} props
 * @param {React.ReactNode} props.children - 要渲染的子组件
 * @param {Array} props.requiredRoles - 允许访问的角色数组
 * @param {string} props.redirectTo - 无权限时重定向的路径
 * @returns {React.ReactNode}
 */
const RouteGuard = ({ children, requiredRoles = [], redirectTo = '/home' }) => {
    const currentUser = getCurrentUser();
    
    // 检查用户是否已登录
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    
    // 检查用户角色权限
    if (requiredRoles.length > 0 && !requiredRoles.includes(currentUser.role)) {
        return <Navigate to={redirectTo} replace />;
    }
    
    // 权限验证通过，渲染子组件
    return children;
};

export default RouteGuard;