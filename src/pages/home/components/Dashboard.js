import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag, Alert, Spin } from 'antd';
import { 
    ShoppingCartOutlined, 
    DollarCircleOutlined, 
    BarChartOutlined, 
    PieChartOutlined,
    RiseOutlined,
    FallOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import Echarts from '../../../components/echarts';
import { 
    getMerchantOverviewStatistics,
    getMerchantInventoryStatistics,
    getMerchantSalesTrendStatistics,
    getMerchantProductRankingStatistics,
    getMerchantFinanceStatistics
} from '../../../api/index';
import './dashboard.css';

const Dashboard = () => {
    const [overviewData, setOverviewData] = useState(null);
    const [inventoryData, setInventoryData] = useState(null);
    const [salesTrendData, setSalesTrendData] = useState(null);
    const [productRankingData, setProductRankingData] = useState(null);
    const [financeData, setFinanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // 获取所有统计数据 - 2024年1月1日到2024年12月31日
                const timeRange = {
                    startDate: '2024-01-01',
                    endDate: '2024-12-31'
                };
                
                const [overviewRes, inventoryRes, salesTrendRes, productRankingRes, financeRes] = await Promise.all([
                    getMerchantOverviewStatistics(timeRange),
                    getMerchantInventoryStatistics(timeRange),
                    getMerchantSalesTrendStatistics({ ...timeRange, groupBy: 'month' }),
                    getMerchantProductRankingStatistics({ ...timeRange, limit: 5 }),
                    getMerchantFinanceStatistics(timeRange)
                ]);

                // 检查API响应状态
                if (overviewRes.data.code === 20000) setOverviewData(overviewRes.data.data);
                if (inventoryRes.data.code === 20000) setInventoryData(inventoryRes.data.data);
                if (salesTrendRes.data.code === 20000) setSalesTrendData(salesTrendRes.data.data);
                if (productRankingRes.data.code === 20000) setProductRankingData(productRankingRes.data.data);
                if (financeRes.data.code === 20000) setFinanceData(financeRes.data.data);
                
                // 检查是否有API调用失败
                const failedAPIs = [
                    { name: '概览统计', success: overviewRes.data.code === 20000 },
                    { name: '库存统计', success: inventoryRes.data.code === 20000 },
                    { name: '销售趋势', success: salesTrendRes.data.code === 20000 },
                    { name: '商品排行', success: productRankingRes.data.code === 20000 },
                    { name: '财务统计', success: financeRes.data.code === 20000 }
                ].filter(api => !api.success);

                if (failedAPIs.length > 0) {
                    setError(`部分数据加载失败: ${failedAPIs.map(api => api.name).join(', ')}`);
                }
                
            } catch (error) {
                console.error('获取仪表盘数据失败:', error);
                setError('数据加载失败，请检查网络连接或稍后重试');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // 概览统计卡片
    const renderOverviewCards = () => {
        if (!overviewData) return null;

        const cards = [
            {
                title: '总销售额',
                value: `¥${overviewData.totalSalesAmount?.toLocaleString() || 0}`,
                icon: <DollarCircleOutlined />,
                color: '#1890ff',
                suffix: overviewData.monthlyGrowthRate > 0 ? 
                    <span style={{ color: '#52c41a', fontSize: '12px' }}>
                        <RiseOutlined /> {overviewData.monthlyGrowthRate}%
                    </span> : 
                    <span style={{ color: '#ff4d4f', fontSize: '12px' }}>
                        <FallOutlined /> {Math.abs(overviewData.monthlyGrowthRate)}%
                    </span>
            },
            {
                title: '订单总数',
                value: overviewData.totalOrderCount?.toLocaleString() || 0,
                icon: <ShoppingCartOutlined />,
                color: '#52c41a'
            },
            {
                title: '商品总数',
                value: overviewData.totalProducts?.toLocaleString() || 0,
                icon: <BarChartOutlined />,
                color: '#faad14'
            },
            {
                title: '转化率',
                value: `${overviewData.conversionRate || 0}%`,
                icon: <PieChartOutlined />,
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

    // 库存状态统计
    const renderInventoryStats = () => {
        if (!inventoryData) return null;

        const { inventoryStatus, alerts } = inventoryData;
        
        return (
            <Col xs={24} lg={12}>
                <Card title="库存状态" className="dashboard-card" loading={loading}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Progress 
                                type="dashboard" 
                                percent={Math.round((inventoryStatus.inStock / inventoryStatus.totalProducts) * 100)} 
                                format={percent => `${inventoryStatus.inStock} / ${inventoryStatus.totalProducts}`}
                            />
                            <div style={{ textAlign: 'center', marginTop: 8 }}>正常库存</div>
                        </Col>
                        <Col span={12}>
                            <div style={{ marginBottom: 16 }}>
                                <div>低库存: <Tag color="orange">{inventoryStatus.lowStock}</Tag></div>
                                <div>缺货: <Tag color="red">{inventoryStatus.outOfStock}</Tag></div>
                                <div>积压: <Tag color="purple">{inventoryStatus.overstock}</Tag></div>
                            </div>
                        </Col>
                    </Row>
                    {alerts && alerts.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                            <h4>库存预警</h4>
                            {alerts.slice(0, 3).map((alert, index) => (
                                <div key={index} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginBottom: 8,
                                    padding: '4px 8px',
                                    backgroundColor: alert.alertType === 'LOW_STOCK' ? '#fff7e6' : '#fff1f0',
                                    borderRadius: 4
                                }}>
                                    <span>{alert.productName}</span>
                                    <Tag color={alert.alertType === 'LOW_STOCK' ? 'orange' : 'red'}>
                                        {alert.currentStock} / {alert.minStock}
                                    </Tag>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </Col>
        );
    };

    // 销售趋势图表
    const renderSalesTrendChart = () => {
        if (!salesTrendData) return null;

        const chartData = {
            xAxis: {
                type: 'category',
                data: salesTrendData.trendData?.map(item => item.date) || []
            },
            yAxis: [
                {
                    type: 'value',
                    name: '销售额',
                    axisLabel: {
                        formatter: '¥{value}'
                    }
                },
                {
                    type: 'value',
                    name: '订单数',
                    axisLabel: {
                        formatter: '{value} 单'
                    }
                }
            ],
            series: [
                {
                    name: '销售额',
                    type: 'line',
                    data: salesTrendData.trendData?.map(item => item.salesAmount) || [],
                    smooth: true,
                    yAxisIndex: 0
                },
                {
                    name: '订单数',
                    type: 'bar',
                    data: salesTrendData.trendData?.map(item => item.orderCount) || [],
                    yAxisIndex: 1
                }
            ]
        };

        return (
            <Col xs={24} lg={12}>
                <Card title="销售趋势" className="dashboard-card" loading={loading}>
                    <Echarts 
                        chartData={chartData} 
                        isAxisChart={true}
                        style={{ height: '300px', width: '100%' }}
                    />
                </Card>
            </Col>
        );
    };

    // 商品销售排行
    const renderProductRanking = () => {
        if (!productRankingData) return null;

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
                title: '商品名称',
                dataIndex: 'productName',
                key: 'productName',
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
                title: '销量',
                dataIndex: 'salesCount',
                key: 'salesCount',
                sorter: (a, b) => a.salesCount - b.salesCount
            }
        ];

        return (
            <Col xs={24} lg={12}>
                <Card title="热销商品排行" className="dashboard-card" loading={loading}>
                    <Table
                        columns={columns}
                        dataSource={productRankingData.salesRanking || []}
                        pagination={false}
                        size="small"
                        rowKey="productId"
                    />
                </Card>
            </Col>
        );
    };

    // 财务统计
    const renderFinanceStats = () => {
        if (!financeData) return null;

        return (
            <Col xs={24} lg={12}>
                <Card title="财务概览" className="dashboard-card" loading={loading}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic
                                title="总收入"
                                value={financeData.revenue?.total}
                                prefix="¥"
                                valueStyle={{ color: '#52c41a' }}
                            />
                            <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                                月均: ¥{financeData.revenue?.monthlyAvg?.toFixed(2)}
                            </div>
                        </Col>
                        <Col span={12}>
                            <Statistic
                                title="净利润"
                                value={financeData.profit?.netProfit}
                                prefix="¥"
                                valueStyle={{ color: '#1890ff' }}
                            />
                            <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                                利润率: {financeData.profit?.profitMargin}%
                            </div>
                        </Col>
                    </Row>
                    <div style={{ marginTop: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span>商品成本</span>
                            <span>¥{financeData.costs?.productCost?.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span>运营成本</span>
                            <span>¥{financeData.costs?.operatingCost?.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span>总成本</span>
                            <span>¥{financeData.costs?.total?.toLocaleString()}</span>
                        </div>
                    </div>
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
                <h1>数据中心仪表盘</h1>
                <p>实时监控业务数据和关键指标</p>
            </div>
            
            {/* 错误提示 */}
            {renderErrorAlert()}
            
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                {renderOverviewCards()}
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                {renderInventoryStats()}
                {renderSalesTrendChart()}
            </Row>
            
            <Row gutter={[16, 16]}>
                {renderProductRanking()}
                {renderFinanceStats()}
            </Row>
        </div>
    );
};

export default Dashboard;