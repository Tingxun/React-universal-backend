import React from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  } from '@ant-design/icons';
import { Button, Layout, Dropdown } from 'antd';
import { Avatar } from "antd";
import { useNavigate } from 'react-router-dom';
import './header.css';

const { Header } = Layout;

function HeaderComponent({collapsed, setCollapsed}) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  }

  function goToPersonalCenter() {
    navigate('/personal');
  }

  // 从本地存储获取用户信息
  const getUserFromLocalStorage = () => {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        return JSON.parse(userInfoStr);
      }
    } catch (error) {
      console.error('解析用户信息失败:', error);
    }
    return null;
  };

  const userInfo = getUserFromLocalStorage();

    const items = [
        {
          key: '1',
          label: userInfo?.name || userInfo?.username || '我的账号',
          disabled: true,
        },
        {
          type: 'divider',
        },
        {
          key: '2',
          label: '个人中心',
          extra: '⌘P',
          onClick: goToPersonalCenter,
        },
        {
          type: 'divider',
        },
        {
          key: '3',
          label: '登出',
          extra: '⌘Q',
          onClick: logout,
        },
      ];

    return (
        <Header className='header-container'> 
        <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
            backgroundColor: 'white',
            fontSize: '18px',
            width: 34,
            height: 34,
            }}
        />
        <Dropdown menu={{ items }}>
            <Avatar
                style={{
                backgroundColor: '#1890ff',
                verticalAlign: 'middle',
                cursor: 'pointer',
                }}
                size="large"
                gap= '4'
            >
                {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
        </Dropdown>
        </Header>
    )
}

export default HeaderComponent;