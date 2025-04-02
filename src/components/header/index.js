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
    navigate('/login');
  }

    const items = [
        {
          key: '1',
          label: '我的账号',
          disabled: true,
        },
        {
          type: 'divider',
        },
        {
          key: '2',
          label: '个人中心',
          extra: '⌘P',
        },
        {
          type: 'divider',
        },
        {
          key: '3',
          label: '登出',
          extra: '⌘Q',
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
        <Dropdown menu={{ 
          items,
          onClick: ({ key }) => {
            if (key === '3') {
              logout();
            }
          } 
        }}>
            <Avatar
                style={{
                backgroundColor: 'grey',
                verticalAlign: 'middle',
                }}
                size="large"
                gap= '4'
            >
                T
            </Avatar>
        </Dropdown>
        </Header>
    )
}

export default HeaderComponent;