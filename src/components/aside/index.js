import React from 'react';
import menuList from '../../config';
import * as Icon from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/jwt';
const { Sider } = Layout;

//动态获取icon，处理菜单数据
const iconToElement = (name) => React.createElement(Icon[name]);

// 根据用户角色过滤菜单项
const filterMenuByRole = (menuItems, userRole) => {
    return menuItems.filter(item => {
        // 检查菜单项是否有权限要求
        if (item.roles && !item.roles.includes(userRole)) {
            return false;
        }
        
        // 如果有子菜单，递归过滤
        if (item.children) {
            const filteredChildren = filterMenuByRole(item.children, userRole);
            // 如果子菜单全部被过滤掉，则隐藏父菜单
            if (filteredChildren.length === 0) {
                return false;
            }
            item.children = filteredChildren;
        }
        
        return true;
    });
};

function AsideComponent({collapsed, setNavItem}) {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();
    const userRole = currentUser?.role || 'sales';
    
    // 根据用户角色过滤菜单
    const filteredMenuList = filterMenuByRole(menuList, userRole);
    
    // 转换菜单数据格式
    const items = filteredMenuList.map(m => {
        const item = {
            key: m.path,
            icon: iconToElement(m.icon),
            label: m.label,
        }
        if (m.children) {
            item.children = m.children.map(c => ({
                key: c.path,
                label: c.label,
            }))
        }
        return item;
    });
    
    // 菜单导航
    function menuNavigate(e) { 
        navigate(e.key);
        let data;
        menuList.forEach( item => {
            if (item.path === e.key) {
                data = item;
            } else if (item.children) {
                item.children.forEach(childItem => {
                    if (childItem.path === e.key) {
                        data = childItem;
                    }
                })
            }
        })
        setNavItem(data);
    }

    return (
        <Sider trigger={null} collapsible='ture' collapsed={collapsed}>
            <h3 className="app-name" style={{ fontSize: collapsed ? 0 : 20 }}>通用后台管理系统</h3>
            <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={items}
            style={{height: '100%'}}
            onClick={(e) => {menuNavigate(e)}}
            />
        </Sider>
    );
}

export default AsideComponent;