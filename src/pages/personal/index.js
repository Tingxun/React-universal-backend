import React, { useEffect, useState } from 'react';
import { 
    Layout, Card, Row, Col, Statistic, Avatar, Tag, Button, Modal, Form, Input, message,
    Progress, List, Timeline, Badge, Table
} from 'antd';
import { 
    UserOutlined, ShopOutlined, TeamOutlined, DollarOutlined, 
    BarChartOutlined, CalendarOutlined, CheckCircleOutlined,
    ClockCircleOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
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

    // 生成mock数据
    const generateMockData = (role) => {
        const baseData = {
            performance: Math.floor(Math.random() * 100000) + 50000,
            salesTarget: 150000,
            completionRate: 0,
            monthlyGrowth: Math.floor(Math.random() * 30) + 5,
            customerCount: Math.floor(Math.random() * 500) + 100,
            orderCount: Math.floor(Math.random() * 200) + 50,
            avgOrderValue: Math.floor(Math.random() * 500) + 200,
            recentActivities: [
                { id: 1, type: 'login', time: '2024-12-27 09:30', description: '用户登录系统' },
                { id: 2, type: 'order', time: '2024-12-26 14:20', description: '完成一笔订单' },
                { id: 3, type: 'update', time: '2024-12-25 11:15', description: '更新个人信息' },
                { id: 4, type: 'login', time: '2024-12-24 08:45', description: '用户登录系统' }
            ]
        };

        baseData.completionRate = ((baseData.performance / baseData.salesTarget) * 100).toFixed(1);

        if (role === 'admin') {
            return {
                ...baseData,
                systemStats: {
                    totalUsers: Math.floor(Math.random() * 1000) + 500,
                    activeUsers: Math.floor(Math.random() * 800) + 200,
                    totalOrders: Math.floor(Math.random() * 5000) + 2000,
                    systemRevenue: Math.floor(Math.random() * 1000000) + 500000,
                    systemUptime: '99.8%'
                },
                pendingTasks: [
                    { id: 1, title: '审核新商户申请', priority: 'high', deadline: '2024-12-28' },
                    { id: 2, title: '系统性能优化', priority: 'medium', deadline: '2024-12-30' },
                    { id: 3, title: '月度数据报表', priority: 'low', deadline: '2024-12-31' }
                ],
                userManagement: {
                    newRegistrations: Math.floor(Math.random() * 50) + 10,
                    pendingApprovals: Math.floor(Math.random() * 20) + 5
                }
            };
        } else if (role === 'merchant' || role === 'sales') {
            return {
                ...baseData,
                salesStats: {
                    monthlyTarget: 10000,
                    currentMonthSales: Math.floor(Math.random() * 8000) + 2000,
                    topProducts: [
                        { name: '产品A', sales: 25000, growth: 15 },
                        { name: '产品B', sales: 18000, growth: 8 },
                        { name: '产品C', sales: 12000, growth: -2 }
                    ],
                    customerRetention: Math.floor(Math.random() * 30) + 70
                },
                performanceRanking: Math.floor(Math.random() * 50) + 1,
                recentOrders: [
                    { id: 1, customer: '客户A', amount: 2500, status: 'completed', date: '2024-12-27' },
                    { id: 2, customer: '客户B', amount: 1800, status: 'pending', date: '2024-12-26' },
                    { id: 3, customer: '客户C', amount: 3200, status: 'completed', date: '2024-12-25' }
                ]
            };
        }

        return baseData;
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
            // 生成mock数据并合并到用户信息中
            const mockData = generateMockData(localUserInfo.role);
            const enrichedUserInfo = {
                ...localUserInfo,
                ...mockData
            };
            setUserInfo(enrichedUserInfo);
            setLoading(false);
            
            // 如果用户有ID，尝试从API获取更详细的信息
            if (localUserInfo.userId) {
                getUserProfile(localUserInfo.userId).then((res) => {
                    console.log('获取用户详情成功:', res);
                    if (res.data.code === 20000) {
                        const apiUserInfo = {
                            ...res.data.data.user,
                            ...mockData
                        };
                        setUserInfo(apiUserInfo);
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

    // 管理员特定的展示组件
    const AdminDashboard = () => (
        <>
            {/* 系统统计卡片 */}
            <div className='card' style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#262626' }}>
                    <BarChartOutlined style={{ marginRight: '8px' }} />
                    系统概览
                </h3>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card size="small">
                            <Statistic 
                                title="总商户数" 
                                value={userInfo?.systemStats?.totalUsers || 0} 
                                prefix={<TeamOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small">
                            <Statistic 
                                title="活跃商户数" 
                                value={userInfo?.systemStats?.activeUsers || 0} 
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small">
                            <Statistic 
                                title="系统收入" 
                                value={`1.2亿`} 
                                precision={2}
                                prefix={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* 待办任务 */}
            <div className='card' style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#262626' }}>
                    <CalendarOutlined style={{ marginRight: '8px' }} />
                    待办任务
                </h3>
                <List
                    dataSource={userInfo?.pendingTasks || []}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Badge 
                                        status={item.priority === 'high' ? 'error' : item.priority === 'medium' ? 'warning' : 'default'}
                                        text=""
                                    />
                                }
                                title={item.title}
                                description={`截止日期: ${item.deadline}`}
                            />
                        </List.Item>
                    )}
                />
            </div>
        </>
    );

    // 商户/销售特定的展示组件
    const MerchantDashboard = () => (
        <>
            {/* 销售统计卡片 */}
            <div className='card' style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#262626' }}>
                    <DollarOutlined style={{ marginRight: '8px' }} />
                    销售统计
                </h3>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card size="small">
                            <Statistic 
                                title="本月目标" 
                                value={userInfo?.salesStats?.monthlyTarget || 0} 
                                prefix="¥"
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small">
                            <Statistic 
                                title="本月销售额" 
                                value={userInfo?.salesStats?.currentMonthSales || 0} 
                                prefix="¥"
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small">
                            <Statistic 
                                title="客户留存率" 
                                value={userInfo?.salesStats?.customerRetention || 0} 
                                suffix="%"
                            />
                        </Card>
                    </Col>
                </Row>
                <div style={{ marginTop: '16px' }}>
                    <Progress 
                        percent={Math.min((userInfo?.salesStats?.currentMonthSales || 0) / (userInfo?.salesStats?.monthlyTarget || 1) * 100, 100)} 
                        status="active" 
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </div>
            </div>

            {/* 最近订单 */}
            <div className='card' style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#262626' }}>
                    <ShopOutlined style={{ marginRight: '8px' }} />
                    最近订单
                </h3>
                <Table
                    size="small"
                    dataSource={userInfo?.recentOrders || []}
                    pagination={false}
                    columns={[
                        {
                            title: '客户',
                            dataIndex: 'customer',
                            key: 'customer',
                        },
                        {
                            title: '金额',
                            dataIndex: 'amount',
                            key: 'amount',
                            render: (amount) => `¥${amount.toLocaleString()}`
                        },
                        {
                            title: '状态',
                            dataIndex: 'status',
                            key: 'status',
                            render: (status) => (
                                <Badge 
                                    status={status === 'completed' ? 'success' : 'processing'}
                                    text={status === 'completed' ? '已完成' : '处理中'}
                                />
                            )
                        },
                        {
                            title: '日期',
                            dataIndex: 'date',
                            key: 'date',
                        }
                    ]}
                />
            </div>
        </>
    );

    // 通用活动时间线组件
    const ActivityTimeline = () => (
        <div className='card'>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#262626' }}>
                <ClockCircleOutlined style={{ marginRight: '8px' }} />
                最近活动
            </h3>
            <Timeline
                items={(userInfo?.recentActivities || []).map(activity => ({
                    color: activity.type === 'login' ? 'blue' : activity.type === 'order' ? 'green' : 'orange',
                    dot: activity.type === 'login' ? <UserOutlined /> : activity.type === 'order' ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />,
                    children: (
                        <div>
                            <p style={{ margin: 0, fontWeight: 500 }}>{activity.description}</p>
                            <p style={{ margin: 0, color: '#8c8c8c', fontSize: '12px' }}>{activity.time}</p>
                        </div>
                    )
                }))}
            />
        </div>
    );

    // 加载状态
    if (loading) {
        return (
            <div className="loading-container">
                <div>加载中...</div>
            </div>
        );
    }

    return (
        <Layout className="layout">
            <Content className="content" style={{ padding: '16px 16px 0 16px' }}>
                <div className="flex-container">
                    {/* 左侧列 - 用户信息和角色特定内容 */}
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        {/* 用户信息卡片 */}
                        <Card 
                            title="个人资料" 
                            className="card user-info-card"
                            style={{ marginBottom: '24px' }}
                            extra={
                                <Button 
                                    type="link" 
                                    onClick={handleEdit}
                                >
                                    编辑
                                </Button>
                            }
                        >
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <Avatar size={120} src={userImg} />
                                <div style={{ marginLeft: '20px' }}>
                                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '600', color: '#262626' }}>
                                        {userInfo?.username || '用户'}
                                    </h3>
                                    <p style={{ margin: '6px 0 0 0', color: '#8c8c8c', fontSize: '16px' }}>
                                        {userInfo?.email || '未设置邮箱'}
                                    </p>
                                    <Tag color={userInfo?.role === 'admin' ? 'red' : 'blue'} style={{ marginTop: '6px', fontSize: '20px', padding: '4px 8px' }}>
                                        {userInfo?.role === 'admin' ? '管理员' : '商户'}
                                    </Tag>
                                </div>
                            </div>
                        </Card>

                        {/* 活动时间线 */}
                        <ActivityTimeline />
                    </div>

                    {/* 右侧列 - 角色特定的仪表板内容 */}
                    <div style={{ flex: '1', minWidth: '400px' }}>
                        {userInfo?.role === 'admin' ? (
                            <AdminDashboard />
                        ) : (
                            <MerchantDashboard />
                        )}
                    </div>
                </div>
            </Content>

            {/* 编辑模态框 */}
            <Modal
                title="编辑个人信息"
                open={editModalVisible}
                onOk={handleEditSubmit}
                onCancel={() => setEditModalVisible(false)}
                okText="保存"
                cancelText="取消"
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        username: userInfo?.username || '',
                        email: userInfo?.email || '',
                    }}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}

export default PersonalCenter;
