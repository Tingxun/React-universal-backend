import React, { useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Statistic, Avatar, Tag, Button, Modal, Form, Input, message } from 'antd';
// import * as Icon from '@ant-design/icons';
import { getUserProfile, updateUserProfile } from '../../api/index';  
import './personal.css';

const { Content } = Layout;

// 动态获取icon，处理菜单数据
// const iconToElement = (name) => React.createElement(Icon[name]);

function PersonalCenter() {
    const [userInfo, setUserInfo] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    const userImg = require('../../assets/images/shadow4.jpg');

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

    // 获取角色显示文本
    const getRoleText = (role) => {
        switch (role) {
            case 'admin': return '管理员';
            case 'merchant': return '商户';
            case 'sales': return '销售';
            default: return '用户';
        }
    };

    // 获取角色颜色
    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'red';
            case 'merchant': return 'blue';
            case 'sales': return 'green';
            default: return 'default';
        }
    };

    // 打开编辑模态框
    const handleEdit = () => {
        console.log('userInfo:', userInfo);
        if (userInfo) {
            form.setFieldsValue({
                name: userInfo.name,
                email: userInfo.email,
                phone: userInfo.phone,
                department: userInfo.department
            });
            setEditModalVisible(true);
        }
    };

    // 提交编辑信息
    const handleEditSubmit = async (values) => {
        try {
            if (userInfo?.id) {
                const { data } = await updateUserProfile(userInfo.id, values);
                if (data.code === 20000) {
                    message.success('个人信息更新成功');
                    setUserInfo(data.data);
                    setEditModalVisible(false);
                    
                    // 更新本地存储的用户信息
                    const localUserInfo = getUserFromLocalStorage();
                    if (localUserInfo) {
                        const updatedUserInfo = { ...localUserInfo, ...data.data };
                        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                    }
                } else {
                    message.error(data.message || '更新失败');
                }
            }
        } catch (error) {
            console.error('更新个人信息失败:', error);
            message.error('更新失败，请重试');
        }
    };

    useEffect(() => {
        // 从本地存储获取用户信息
        const localUserInfo = getUserFromLocalStorage();
        if (localUserInfo) {
            setUserInfo(localUserInfo);
            setLoading(false);
            
            // 如果用户有ID，尝试从API获取更详细的信息
            if (localUserInfo.userId) {
                getUserProfile(localUserInfo.userId).then((res) => {
                    console.log('获取用户详情成功:', res);
                    if (res.data.code === 20000) {
                        setUserInfo(res.data.data.user);
                    }
                }).catch(error => {
                    console.error('获取用户详情失败:', error);
                }).finally(() => {
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    // 加载状态
    if (loading) {
        return (
            <div className="loading-container">
                <div>加载中...</div>
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ 
                padding: '0 16px', 
                marginTop: '64px',
                background: '#f5f5f5',
                minHeight: 'calc(100vh - 64px)' 
            }}>
                <div className='flex-container'>
                    <div className='leftcolumn'>
                        <div className='card'>
                            <div className='user'>
                                <Avatar 
                                    size={120}
                                    src={userImg}
                                    style={{ flexShrink: 0 }}
                                />
                                <div className='user-info'>
                                    <p>{userInfo?.name || userInfo?.username || '用户'}</p>
                                    <Tag color={getRoleColor(userInfo?.role)}>
                                        {getRoleText(userInfo?.role)}
                                    </Tag>
                                </div>
                            </div>
                            <div className='login-info'>
                                <p>邮箱: <span>{userInfo?.email || '未设置'}</span></p>
                                <p>电话: <span>{userInfo?.phone || '未设置'}</span></p>
                                <p>上次登录时间: <span>{userInfo?.lastLoginAt ? new Date(userInfo.lastLoginAt).toLocaleString() : '未知'}</span></p>
                                <p>注册时间: <span>{userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : '未知'}</span></p>
                                <div style={{marginTop: '24px', textAlign: 'center'}}>
                                    <Button type="primary" onClick={handleEdit} size="large">
                                        编辑个人信息
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='rightcolumn'>
                        {/* 用户统计信息卡片 */}
                        <div className='card personal-stats'>
                            <h3 style={{marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#262626'}}>个人统计</h3>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Card size="small">
                                        <Statistic 
                                            title="销售目标" 
                                            value={userInfo?.salesTarget || 0} 
                                            precision={2}
                                            prefix="¥"
                                        />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card size="small">
                                        <Statistic 
                                            title="当前业绩" 
                                            value={userInfo?.performance || 0} 
                                            precision={2}
                                            prefix="¥"
                                        />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card size="small">
                                        <Statistic 
                                            title="完成率" 
                                            value={userInfo?.salesTarget ? ((userInfo.performance || 0) / userInfo.salesTarget * 100).toFixed(1) : 0} 
                                            suffix="%"
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <Modal
                    title="编辑个人信息"
                    open={editModalVisible}
                    onCancel={() => setEditModalVisible(false)}
                    footer={null}
                    width={600}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleEditSubmit}
                    >
                        <Form.Item
                            label="姓名"
                            name="name"
                            rules={[{ required: true, message: '请输入姓名' }]}
                        >
                            <Input placeholder="请输入姓名" />
                        </Form.Item>
                        <Form.Item
                            label="邮箱"
                            name="email"
                            rules={[
                                { required: true, message: '请输入邮箱' },
                                { type: 'email', message: '请输入有效的邮箱地址' }
                            ]}
                        >
                            <Input placeholder="请输入邮箱" />
                        </Form.Item>
                        <Form.Item
                            label="电话"
                            name="phone"
                            rules={[
                                { required: true, message: '请输入电话' },
                                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                            ]}
                        >
                            <Input placeholder="请输入电话" />
                        </Form.Item>
                        <Form.Item
                            label="部门"
                            name="department"
                        >
                            <Input placeholder="请输入部门" />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'right', marginTop: '24px' }}>
                            <Button onClick={() => setEditModalVisible(false)} style={{ marginRight: '8px' }}>
                                取消
                            </Button>
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                </div>
            </Content>
        </Layout>
    );
}

export default PersonalCenter;
