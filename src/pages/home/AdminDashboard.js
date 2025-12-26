import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Alert, Spin, Progress } from 'antd';
import { 
    ShopOutlined, 
    DollarCircleOutlined, 
    BarChartOutlined, 
    PieChartOutlined,
    RiseOutlined,
    FallOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import Echarts from '../../components/echarts';
import { 
    getAdminTotalStatistics,
    getAdminDailyReport,
    getAdminGrowthStatistics,
    getAdminCategoryDistribution,
    getAdminMerchantRanking
} from '../../api/index';
import './dashboard.css';

const AdminDashboard = () => {
    const [totalData, setTotalData] = useState(null);
    const [dailyData, setDailyData] = useState(null);
    const [growthData, setGrowthData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [merchantRankingData, setMerchantRankingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // 获取所有统计数据 - 2024年1月1日到2024年12月31日
                const timeRange = {
                    startDate: '2024-01-01',
                    endDate: '2024-12-31'
                };
                
                const [totalRes, dailyRes, growthRes, categoryRes, rankingRes] = await Promise.all([
                    getAdminTotalStatistics(timeRange),
                    getAdminDailyReport({ date: '2024-12-24' }),
                    getAdminGrowthStatistics({ ...timeRange, groupBy: 'month' }),
                    getAdminCategoryDistribution(timeRange),
                    getAdminMerchantRanking({ ...timeRange, limit: 5 })
                ]);

                // 检查API响应状态
                if (totalRes.data.code === 20000) setTotalData(totalRes.data.data);
                if (dailyRes.data.code === 20000) setDailyData(dailyRes.data.data);
                if (growthRes.data.code === 20000) setGrowthData(growthRes.data.data);
                if (categoryRes.data.code === 20000) setCategoryData(categoryRes.data.data);
                if (rankingRes.data.code === 20000) setMerchantRankingData(rankingRes.data.data);
                
                // 检查是否有API调用失败
                const failedAPIs = [
                    { name: '平台概览统计', success: totalRes.data.code === 20000 },
                    { name: '平台日报', success: dailyRes.data.code === 20000 },
                    { name: '商户增长趋势', success: growthRes.data.code === 20000 },
                    { name: '商品分类统计', success: categoryRes.data.code === 20000 },
                    { name: '商户销售排行', success: rankingRes.data.code === 20000 }
                ].filter(api => !api.success);

                if (failedAPIs.length > 0) {
                    setError(`部分数据加载失败: ${failedAPIs.map(api => api.name).join(', ')}`);
                }
                
            } catch (error) {
                console.error('获取管理员仪表盘数据失败:', error);
                setError('数据加载失败，请检查网络连接或稍后重试');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminDashboardData();
    }, []);

    // 平台概览统计卡片
    const renderTotalCards = () => {
        if (!totalData) return null;

        const cards = [
            {
                title: '商户总数',
                value: totalData.totalMerchants?.toLocaleString() || 0,
                icon: <ShopOutlined />,
                color: '#1890ff',
                suffix: <span style={{ color: '#52c41a', fontSize: '12px' }}>
                    活跃: {totalData.activeMerchants}
                </span>
            },
            {
                title: '商品总数',
                value: totalData.totalProducts?.toLocaleString() || 0,
                icon: <ShoppingCartOutlined />,
                color: '#52c41a',
                suffix: <span style={{ color: '#faad14', fontSize: '12px' }}>
                    在售: {totalData.onSaleProducts}
                </span>
            },
            {
                title: '总销售额',
                value: `¥${totalData.totalSalesAmount?.toLocaleString() || 0}`,
                icon: <DollarCircleOutlined />,
                color: '#faad14',
                suffix: totalData.monthlyGrowthRate > 0 ? 
                    <span style={{ color: '#52c41a', fontSize: '12px' }}>
                        <RiseOutlined /> {totalData.monthlyGrowthRate}%
                    </span> : 
                    <span style={{ color: '#ff4d4f', fontSize: '12px' }}>
                        <FallOutlined /> {Math.abs(totalData.monthlyGrowthRate)}%
                    </span>
            },
            {
                title: '商户留存率',
                value: `${totalData.merchantRetentionRate || 0}%`,
                icon: <UserOutlined />,
                color: '#722ed1'
            }
        ];

        return cards.map((card, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="dashboard-card" loading={loading}>
                    <Statistic
                        title={card.title}
                        value={card.value}
                        prefix={card.icon}
                        suffix={card.suffix}
                        valueStyle={{ color: card.color }}
                    />
                </Card>
            </Col>
        ));
    };

    // 平台日报统计
    const renderDailyReport = () => {
        if (!dailyData) return null;

        return (
            <Col xs={24} lg={12}>
                <Card title={`平台日报 - ${dailyData.date}`} className="dashboard-card" loading={loading}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic
                                title="新增商户"
                                value={dailyData.newMerchants}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Col>
                        <Col span={12}>
                            <Statistic
                                title="新增商品"
                                value={dailyData.newProducts}
                                prefix={<ShoppingCartOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col span={12}>
                            <Statistic
                                title="活跃商户"
                                value={dailyData.activeMerchants}
                                prefix={<ShopOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Col>
                        <Col span={12}>
                            <Statistic
                                title="交易笔数"
                                value={dailyData.totalTransactions}
                                prefix={<BarChartOutlined />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Col>
                    </Row>
                    {dailyData.issues && (
                        <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#f6f6f6', borderRadius: 4 }}>
                            <h4>问题统计</h4>
                            <div>低库存商品: <Tag color="orange">{dailyData.issues.lowStockProducts}</Tag></div>
                            <div>非活跃商户: <Tag color="red">{dailyData.issues.inactiveMerchants}</Tag></div>
                        </div>
                    )}
                </Card>
            </Col>
        );
    };

    // 商户增长趋势图表
    const renderGrowthChart = () => {
        if (!growthData) return null;

        const chartData = {
            xAxis: {
                type: 'category',
                data: growthData.trendData?.map(item => item.date) || []
            },
            yAxis: [
                {
                    type: 'value',
                    name: '商户数量',
                    axisLabel: {
                        formatter: '{value} 家'
                    }
                },
                {
                    type: 'value',
                    name: '增长率',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '新增商户',
                    type: 'bar',
                    data: growthData.trendData?.map(item => item.newMerchants) || [],
                    yAxisIndex: 0
                },
                {
                    name: '总商户数',
                    type: 'line',
                    data: growthData.trendData?.map(item => item.totalMerchants) || [],
                    smooth: true,
                    yAxisIndex: 0
                },
                {
                    name: '增长率',
                    type: 'line',
                    data: growthData.trendData?.map(item => 
                        item.totalMerchants > 0 ? 
                        ((item.newMerchants / item.totalMerchants) * 100).toFixed(1) : 0
                    ) || [],
                    smooth: true,
                    yAxisIndex: 1
                }
            ]
        };

        return (
            <Col xs={24} lg={12}>
                <Card title="商户增长趋势" className="dashboard-card" loading={loading}>
                    <Echarts 
                        chartData={chartData} 
                        isAxisChart={true}
                        style={{ height: '300px', width: '100%' }}
                    />
                </Card>
            </Col>
        );
    };

    // 商品分类统计
    const renderCategoryDistribution = () => {
        if (!categoryData) return null;

        const columns = [
            {
                title: '分类',
                dataIndex: 'category',
                key: 'category',
                width: 120
            },
            {
                title: '商品数量',
                dataIndex: 'productCount',
                key: 'productCount',
                width: 100,
                sorter: (a, b) => a.productCount - b.productCount
            },
            {
                title: '占比',
                dataIndex: 'percentage',
                key: 'percentage',
                width: 100,
                render: (percentage) => `${percentage}%`
            },
            {
                title: '销售额',
                dataIndex: 'salesAmount',
                key: 'salesAmount',
                render: (amount) => `¥${amount?.toLocaleString()}`,
                sorter: (a, b) => a.salesAmount - b.salesAmount
            },
            {
                title: '平均价格',
                dataIndex: 'avgPrice',
                key: 'avgPrice',
                render: (price) => `¥${price?.toLocaleString()}`
            }
        ];

        return (
            <Col xs={24} lg={12}>
                <Card title="商品分类统计" className="dashboard-card" loading={loading}>
                    <Table
                        columns={columns}
                        dataSource={categoryData.categoryStats || []}
                        pagination={false}
                        size="small"
                        rowKey="category"
                        scroll={{ y: 200 }}
                    />
                </Card>
            </Col>
        );
    };

    // 商户销售排行
    const renderMerchantRanking = () => {
        if (!merchantRankingData) return null;

        const columns = [
            {
                title: '排名',
                dataIndex: 'ranking',
                key: 'ranking',
                width: 60,
                render: (ranking) => (
                    <Tag color={ranking <= 3 ? '#f50' : ranking <= 5 ? '#2db7f5' : '#87d068'}>
                        {ranking}
                    </Tag>
                )
            },
            {
                title: '商户名称',
                dataIndex: 'merchantName',
                key: 'merchantName',
                ellipsis: true
            },
            {
                title: '销售额',
                dataIndex: 'salesAmount',
                key: 'salesAmount',
                render: (amount) => `¥${amount?.toLocaleString()}`,
                sorter: (a, b) => a.salesAmount - b.salesAmount
            },
            {
                title: '订单数',
                dataIndex: 'orderCount',
                key: 'orderCount',
                sorter: (a, b) => a.orderCount - b.orderCount
            },
            {
                title: '商品数',
                dataIndex: 'productCount',
                key: 'productCount',
                sorter: (a, b) => a.productCount - b.productCount
            }
        ];

        return (
            <Col xs={24} lg={12}>
                <Card title="商户销售排行" className="dashboard-card" loading={loading}>
                    <div style={{ marginBottom: 8, fontSize: '12px', color: '#666' }}>
                        总销售额: ¥{merchantRankingData.totalSalesAmount?.toLocaleString()} | 
                        总订单数: {merchantRankingData.totalOrderCount}
                    </div>
                    <Table
                        columns={columns}
                        dataSource={merchantRankingData.rankingList || []}
                        pagination={false}
                        size="small"
                        rowKey="merchantId"
                        scroll={{ y: 200 }}
                    />
                </Card>
            </Col>
        );
    };

    // 渲染错误信息
    const renderErrorAlert = () => {
        if (!error) return null;
        
        return (
            <Alert
                message="数据加载异常"
                description={error}
                type="warning"
                showIcon
                icon={<ExclamationCircleOutlined />}
                style={{ marginBottom: 16 }}
            />
        );
    };

    // 渲染加载状态
    if (loading) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Spin size="large" tip="数据加载中..." />
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>平台管理中心</h1>
                <p>实时监控平台运营数据和关键指标</p>
            </div>
            
            {/* 错误提示 */}
            {renderErrorAlert()}
            
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                {renderTotalCards()}
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                {renderDailyReport()}
                {renderGrowthChart()}
            </Row>
            
            <Row gutter={[16, 16]}>
                {renderCategoryDistribution()}
                {renderMerchantRanking()}
            </Row>
        </div>
    );
};

export default AdminDashboard;