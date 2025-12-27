import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    BellOutlined,
    UserOutlined,
    SecurityScanOutlined,
    GlobalOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { Button, Layout, Dropdown, Modal, Tabs, Switch, Select, Form, Input, Divider, Typography } from 'antd';
import { Avatar } from "antd";
import { useNavigate } from 'react-router-dom';
import './header.css';

const { Header } = Layout;

function HeaderComponent({collapsed, setCollapsed}) {
  const navigate = useNavigate();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [form] = Form.useForm();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  }

  const showSettings = () => {
    setSettingsModalVisible(true);
  };

  const handleSettingsOk = () => {
    setSettingsModalVisible(false);
  };

  const handleSettingsCancel = () => {
    setSettingsModalVisible(false);
  };

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
          label: '设置',
          icon: <SettingOutlined />,
          extra: '⌘S',
          onClick: showSettings,
        },
        {
          type: 'divider',
        },
        {
          key: '3',
          label: '登出',
          icon: <UserOutlined />,
          extra: '⌘L',
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
        
        {/* 设置弹窗 */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SettingOutlined style={{ color: '#1890ff' }} />
              <span>系统设置</span>
            </div>
          }
          open={settingsModalVisible}
          onOk={handleSettingsOk}
          onCancel={handleSettingsCancel}
          width={800}
          footer={[
            <Button key="cancel" onClick={handleSettingsCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={handleSettingsOk}>
              保存设置
            </Button>
          ]}
        >
          <Tabs 
            defaultActiveKey="1" 
            items={[
              {
                key: '1',
                label: (
                  <span>
                    <BellOutlined />
                    通知设置
                  </span>
                ),
                children: (
                  <div style={{ padding: '16px 0' }}>
                    <Form form={form} layout="vertical">
                      <Form.Item label="邮件通知" name="emailNotification">
                        <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
                      </Form.Item>
                      <Form.Item label="系统消息" name="systemNotification">
                        <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
                      </Form.Item>
                      <Form.Item label="销售提醒" name="salesNotification">
                        <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                      </Form.Item>
                      <Divider />
                      <Form.Item label="通知频率" name="notificationFrequency">
                        <Select defaultValue="realtime" style={{ width: '100%' }}>
                          <Select.Option value="realtime">实时通知</Select.Option>
                          <Select.Option value="daily">每日汇总</Select.Option>
                          <Select.Option value="weekly">每周汇总</Select.Option>
                        </Select>
                      </Form.Item>
                    </Form>
                  </div>
                ),
              },
              {
                key: '2',
                label: (
                  <span>
                    <SecurityScanOutlined />
                    安全设置
                  </span>
                ),
                children: (
                  <div style={{ padding: '16px 0' }}>
                    <Form form={form} layout="vertical">
                      <Form.Item label="双重验证" name="twoFactorAuth">
                        <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                      </Form.Item>
                      <Form.Item label="登录超时时间" name="sessionTimeout">
                        <Select defaultValue="30" style={{ width: '100%' }}>
                          <Select.Option value="15">15分钟</Select.Option>
                          <Select.Option value="30">30分钟</Select.Option>
                          <Select.Option value="60">1小时</Select.Option>
                          <Select.Option value="120">2小时</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="密码强度要求" name="passwordStrength">
                        <Select defaultValue="medium" style={{ width: '100%' }}>
                          <Select.Option value="low">低强度</Select.Option>
                          <Select.Option value="medium">中强度</Select.Option>
                          <Select.Option value="high">高强度</Select.Option>
                        </Select>
                      </Form.Item>
                    </Form>
                  </div>
                ),
              },
              {
                key: '3',
                label: (
                  <span>
                    <GlobalOutlined />
                    界面设置
                  </span>
                ),
                children: (
                  <div style={{ padding: '16px 0' }}>
                    <Form form={form} layout="vertical">
                      <Form.Item label="主题模式" name="themeMode">
                        <Select defaultValue="light" style={{ width: '100%' }}>
                          <Select.Option value="light">浅色模式</Select.Option>
                          <Select.Option value="dark">深色模式</Select.Option>
                          <Select.Option value="auto">跟随系统</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="语言设置" name="language">
                        <Select defaultValue="zh-CN" style={{ width: '100%' }}>
                          <Select.Option value="zh-CN">简体中文</Select.Option>
                          <Select.Option value="en-US">English</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="页面布局" name="layout">
                        <Select defaultValue="fluid" style={{ width: '100%' }}>
                          <Select.Option value="fluid">流式布局</Select.Option>
                          <Select.Option value="fixed">固定布局</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="动画效果" name="animation">
                        <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
                      </Form.Item>
                    </Form>
                  </div>
                ),
              },
              {
                key: '4',
                label: (
                  <span>
                    <InfoCircleOutlined />
                    系统信息
                  </span>
                ),
                children: (
                  <div style={{ padding: '16px 0' }}>
                    <Typography>
                      <Typography.Paragraph>
                        <strong>系统版本：</strong> v1.0.0
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        <strong>最后更新：</strong> 2024-12-27
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        <strong>技术支持：</strong> tech@company.com
                      </Typography.Paragraph>
                      <Divider />
                      <Typography.Paragraph type="secondary">
                        当前用户：{userInfo?.name || userInfo?.username || '未知用户'}
                      </Typography.Paragraph>
                      <Typography.Paragraph type="secondary">
                        用户角色：{userInfo?.role || '未知角色'}
                      </Typography.Paragraph>
                      <Typography.Paragraph type="secondary">
                        登录时间：{userInfo?.lastLoginAt ? new Date(userInfo.lastLoginAt).toLocaleString() : '未知'}
                      </Typography.Paragraph>
                    </Typography>
                  </div>
                ),
              },
            ]}
          />
        </Modal>
        </Header>
    )
}

export default HeaderComponent;