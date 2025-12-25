import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Table, 
    Button, 
    Card, 
    Row, 
    Col, 
    Tag, 
    message,
    Popconfirm,
    Tooltip,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Spin
} from 'antd';
import ProductSearch from './components/ProductSearch';
import Echarts from '../../components/echarts';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined,
    FilterOutlined,
    BarChartOutlined,
    LineChartOutlined
} from '@ant-design/icons';
import { getProductList, deleteProduct, createProduct, updateProduct, getMerchantRanking, getCategorySalesStatistics } from '../../api/index';
import { getCurrentUser } from '../../utils/jwt';
import { useNavigate } from 'react-router-dom';
import './merchandise.css';

// 常量定义
const STATUS_MAP = {
    'ON_SALE': { text: '在售', color: 'green' },
    'OFF_SALE': { text: '下架', color: 'red' },
    'PENDING': { text: '审核中', color: 'orange' },
    'REJECTED': { text: '已拒绝', color: 'gray' }
};

const CATEGORY_FILTERS = [
    { text: '电子产品', value: '电子产品' },
    { text: '服装', value: '服装' },
    { text: '食品', value: '食品' },
    { text: '家居', value: '家居' },
];

const STATUS_FILTERS = [
    { text: '在售', value: 'ON_SALE' },
    { text: '下架', value: 'OFF_SALE' },
    { text: '审核中', value: 'PENDING' },
    { text: '已拒绝', value: 'REJECTED' },
];

const FIELD_MAPPING = {
    'price': 'price',
    'stock': 'stock',
    'updateTime': 'update_time',
};

function Merchandise() {
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chartLoading, setChartLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [searchParams, setSearchParams] = useState({
        searchKeyword: '',
        category: '',
        status: '',
        sortField: 'createTime',
        sortOrder: 'desc'
    });
    const [userRole, setUserRole] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editType, setEditType] = useState('');
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        price: 0,
        stock: 0,
        description: '',
        mainImage: '',
        status: 'PENDING'
    });
    
    // 图表数据状态
    const [merchantRankingData, setMerchantRankingData] = useState({});
    const [productSalesData, setProductSalesData] = useState({});

    // 获取用户角色
    useEffect(() => {
        const userInfo = getCurrentUser();
        if (userInfo) {
            // 从JWT token中解析用户角色
            setUserRole(userInfo.role || 'sales');
        } else {
            // 如果没有token或token过期，跳转到登录页
            message.warning('请先登录');
            navigate('/login');
        }
    }, [navigate]);

    // 获取商户销售排行数据（管理员视角）
    const fetchMerchantRanking = useCallback(async () => {
        if (userRole !== 'admin') return;
        
        setChartLoading(true);
        try {
            const res = await getMerchantRanking({
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                rankingType: 'sales',
                limit: 5
            });
            console.log('获取商户排行数据成功:', res || []);
            
            if (res.data.code === 20000) {
                const data = res.data.data;
                
                // 为每个商户生成不同的颜色
                const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', 
                               '#fa541c', '#13c2c2', '#eb2f96', '#f759ab', '#9254de'];
                
                const chartData = {
                    xAxis: data.rankingList.map(item => item.merchantName),
                    series: [{
                        name: '销售额',
                        type: 'bar',
                        data: data.rankingList.map((item, index) => ({
                            value: item.salesAmount,
                            itemStyle: {
                                color: colors[index % colors.length]
                            }
                        }))
                    }]
                };
                setMerchantRankingData(chartData);
            } else {
                message.error(res.data.message || '获取商户排行数据失败');
            }
        } catch (error) {
            console.error('获取商户排行数据失败:', error);
            message.error('获取商户排行数据失败');
        } finally {
            setChartLoading(false);
        }
    }, [userRole]);

    // 获取商品类别销售统计数据（商户视角）
    const fetchProductSalesStatistics = useCallback(async () => {
        if (userRole === 'admin') return;
        
        setChartLoading(true);
        try {
            const res = await getCategorySalesStatistics({
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                groupBy: 'month'
            });
            console.log('获取商品类别销售数据成功:', res || []);
            
            if (res.data.code === 20000) {
                const data = res.data.data;
                
                // 使用新接口返回的时间点数据
                const timePoints = data.timePoints || [];
                
                // 按分类处理数据
                const seriesData = data.series?.map(categoryData => {
                    return {
                        name: categoryData.category,
                        type: 'line',
                        smooth: true,
                        data: timePoints.map(timePoint => {
                            const pointData = categoryData.data?.find(item => item.date === timePoint);
                            return pointData ? pointData.salesAmount || 0 : 0;
                        })
                    };
                }) || [];
                
                const chartData = {
                    xAxis: timePoints,
                    series: seriesData
                };
                setProductSalesData(chartData);
            } else {
                message.error(res.data.message || '获取商品类别销售数据失败');
            }
        } catch (error) {
            console.error('获取商品类别销售数据失败:', error);
            message.error('获取商品类别销售数据失败');
        } finally {
            setChartLoading(false);
        }
    }, [userRole]);

    // 获取所有商品数据
    const fetchAllProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getProductList({});
            
            if (res.data.code === 20000) {
                console.log('获取商品列表成功:', res || []);
                setAllProducts(res.data.data.list || []);
            } else {
                message.error(res.data.message || '获取商品列表失败');
            }
        } catch (error) {
            console.error('获取商品列表失败:', error);
            message.error('网络错误，请稍后重试');
        } finally {
            setLoading(false);
        }
    }, []);

    // 计算筛选后的商品数据
    const filteredProducts = useMemo(() => {
        let result = (allProducts || []).filter(product => {
            const matchesKeyword = !searchParams.searchKeyword || 
                product.productName?.toLowerCase().includes(searchParams.searchKeyword.toLowerCase());
            const matchesCategory = !searchParams.category || product.category === searchParams.category;
            const matchesStatus = !searchParams.status || product.status === searchParams.status;
            
            return matchesKeyword && matchesCategory && matchesStatus;
        });

        // 排序
        if (searchParams.sortField && searchParams.sortOrder) {
            result.sort((a, b) => {
                const aValue = a[searchParams.sortField];
                const bValue = b[searchParams.sortField];
                return searchParams.sortOrder === 'asc' ? 
                    (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) :
                    (aValue > bValue ? -1 : aValue < bValue ? 1 : 0);
            });
        }
        
        return result;
    }, [allProducts, searchParams]);

    // 计算分页后的商品数据
    const paginatedProducts = useMemo(() => {
        const startIndex = (pagination.current - 1) * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        return filteredProducts.slice(startIndex, endIndex);
    }, [filteredProducts, pagination.current, pagination.pageSize]);

    // 初始化加载
    useEffect(() => {
        if (userRole) {
            fetchAllProducts();
            if (userRole === 'admin') {
                fetchMerchantRanking();
            } else {
                fetchProductSalesStatistics();
            }
        }
    }, [userRole, fetchAllProducts, fetchMerchantRanking, fetchProductSalesStatistics]);

    // 更新分页总数
    useEffect(() => {
        setPagination(prev => ({
            ...prev,
            total: filteredProducts.length
        }));
    }, [filteredProducts.length]);
    
    // 处理搜索
    const handleSearch = (value) => {
        setSearchParams(prev => ({...prev, searchKeyword: value}));
        setPagination(prev => ({...prev, current: 1}));
    };

    // 处理表单输入变化
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 处理数字输入变化
    const handleNumberChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 控制弹窗动作和编辑类型
    const handleEdit = (type, record = null) => {
        setIsModalOpen(true);
        setEditType(type);
        if (type === 'add') {
            setFormData({
                productName: '',
                category: '',
                price: 0,
                stock: 0,
                description: '',
                mainImage: '',
                status: 'PENDING'
            });
        } else if (type === 'edit' && record) {
            setFormData({
                id: record.id,
                productName: record.productName,
                category: record.category,
                price: record.price,
                stock: record.stock,
                description: record.description || '',
                mainImage: record.mainImage || '',
                status: record.status
            });
        }
    };

    // 表单验证
    const formValidation = (data) => {
        if (!data.productName.trim()) {
            message.error('商品名称不能为空');
            return false;
        }
        if (!data.category) {
            message.error('请选择商品分类');
            return false;
        }
        if (data.price <= 0) {
            message.error('价格必须大于0');
            return false;
        }
        if (data.stock < 0) {
            message.error('库存不能为负数');
            return false;
        }
        return true;
    };

    // 处理弹窗确定事件
    const handleOk = async () => {
        if (!formValidation(formData)) {
            return;
        }
        
        try {
            if (editType === 'add') {
                const res = await createProduct(formData);
                if (res.data.code === 200 || res.data.code === 20000) {
                    message.success('商品添加成功');
                    setIsModalOpen(false);
                    fetchAllProducts();
                } else {
                    message.error(res.data.message || '添加商品失败');
                }
            } else if (editType === 'edit') {
                const res = await updateProduct(formData.id, formData);
                if (res.data.code === 200 || res.data.code === 20000) {
                    message.success('商品更新成功');
                    setIsModalOpen(false);
                    fetchAllProducts();
                } else {
                    message.error(res.data.message || '更新商品失败');
                }
            }
        } catch (error) {
            console.error('操作失败:', error);
            message.error('操作失败，请稍后重试');
        }
    };

    // 处理表格变化
    const handleTableChange = (newPagination, filters, sorter) => {
        // 处理筛选
        if (filters) {
            setSearchParams(prev => ({
                ...prev,
                category: filters.category?.[0] || '',
                status: filters.status?.[0] || ''
            }));
        }
        
        // 处理排序
        if (sorter?.field) {
            setSearchParams(prev => ({
                ...prev,
                sortField: FIELD_MAPPING[sorter.field] || sorter.field,
                sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc'
            }));
        }
        
        // 处理分页
        setPagination(newPagination);
    };

    // 删除商品
    const handleDelete = async (productId) => {
        try {
            const res = await deleteProduct(productId);
            if (res.data.code === 200 || res.data.code === 20000) {
                message.success('删除成功');
                // 立即从本地状态中移除已删除的商品，避免等待API响应
                setAllProducts(prev => prev.filter(product => product.id !== productId));
                // 同时重新获取数据确保数据一致性
                fetchAllProducts();
            } else {
                message.error(res.data.message || '删除失败');
            }
        } catch (error) {
            console.error('删除商品失败:', error);
            message.error('删除失败');
        }
    };

    // 表格列配置
    const baseColumns = [
        {
            title: '商品ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            ellipsis: true
        },
        {
            title: '商品名称',
            dataIndex: 'productName',
            key: 'productName',
            width: 200,
            ellipsis: true
        },
        {
            title: '分类',
            dataIndex: 'category',
            key: 'category',
            width: 120,
            filters: CATEGORY_FILTERS,
            filteredValue: searchParams.category ? [searchParams.category] : null,
            onFilter: (value, record) => record.category === value,
        },
        {
            title: '主图',
            dataIndex: 'mainImage',
            key: 'mainImage',
            width: 100,
            render: (imageUrl) => imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt="商品主图" 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
            ) : '无图片'
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: 100,
            sorter: true,
            render: (price) => price ? `¥${price.toLocaleString()}` : '-' 
        },
        {
            title: '库存',
            dataIndex: 'stock',
            key: 'stock',
            width: 80,
            sorter: true
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            filters: STATUS_FILTERS,
            filteredValue: searchParams.status ? [searchParams.status] : null,
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                const statusInfo = STATUS_MAP[status] || { text: status, color: 'default' };
                return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
            }
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 150,
            sorter: true,
            render: (time) => time ? new Date(time).toLocaleString() : '-' 
        },
        {
            title: '操作',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                    <Tooltip title="编辑商品">
                        <Button 
                            type="link" 
                            icon={<EditOutlined />} 
                            size="small" 
                            onClick={() => handleEdit('edit', record)}
                            style={{ width: '60px', padding: '0 4px', fontSize: '12px' }}
                        >
                            编辑
                        </Button>
                    </Tooltip>
                    <Popconfirm
                        title="确定要删除这个商品吗？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Tooltip title="删除商品">
                            <Button 
                                type="link" 
                                danger 
                                icon={<DeleteOutlined />} 
                                size="small"
                                style={{ width: '60px', padding: '0 4px', fontSize: '12px' }}
                            >
                                删除
                            </Button>
                        </Tooltip>
                    </Popconfirm>
                </div>
            )
        }
    ];

    // 动态构建列配置
    const columns = useMemo(() => {
        const columnsCopy = [...baseColumns];
        if (userRole === 'admin') {
            columnsCopy.splice(2, 0, {
                title: '商户',
                dataIndex: 'merchantName',
                key: 'merchantId',
                width: 120,
                ellipsis: true
            });
        }
        return columnsCopy;
    }, [userRole]);

    return (
        <div className="mall-container">
            <Card 
                title={
                    <div className="mall-header">
                        <Tag color={userRole === 'admin' ? 'blue' : 'green'}>
                            {userRole === 'admin' ? '管理员模式' : '商户模式'}
                        </Tag>
                    </div>
                }
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => handleEdit('add')}>
                        新增商品
                    </Button>
                }
            >
                {/* 图表区域 */}
                <div className="chart-area">
                    <Spin spinning={chartLoading}>
                        {userRole === 'admin' ? (
                            <Card 
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <BarChartOutlined />
                                        <span>商户销售排行</span>
                                    </div>
                                }
                                style={{ marginBottom: '16px' }}
                            >
                                <Echarts 
                                    style={{ width: '100%', height: '400px' }}
                                    chartData={merchantRankingData}
                                    isAxisChart={true}
                                    chartType="bar"
                                />
                            </Card>
                        ) : (
                            <Card 
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <LineChartOutlined />
                                        <span>商品类别销售趋势</span>
                                    </div>
                                }
                                style={{ marginBottom: '16px' }}
                            >
                                <Echarts 
                                    style={{ width: '100%', height: '400px' }}
                                    chartData={productSalesData}
                                    isAxisChart={true}
                                    chartType="line"
                                />
                            </Card>
                        )}
                    </Spin>
                </div>

                {/* 搜索区域 */}
                <div className="search-area">
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <ProductSearch
                                placeholder="输入商品名称搜索"
                                onSearch={handleSearch}
                                allowClear={true}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Button 
                                icon={<FilterOutlined />}
                                onClick={() => {
                                    setSearchParams({
                                        searchKeyword: '',
                                        category: '',
                                        status: '',
                                        sortField: 'createTime',
                                        sortOrder: 'desc'
                                    });
                                    setPagination(prev => ({...prev, current: 1}));
                                }}
                            >
                                重置筛选
                            </Button>
                        </Col>
                    </Row>
                </div>

                {/* 商品列表表格 */}
                <Table
                    columns={columns}
                    dataSource={paginatedProducts}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1000 }}
                />
            </Card>

            {/* 商品信息弹窗 */}
            <Modal
                title={editType === 'add' ? '新增商品' : '编辑商品'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    setFormData({
                        productName: '',
                        category: '',
                        price: 0,
                        stock: 0,
                        description: '',
                        mainImage: '',
                        status: 'PENDING'
                    });
                }}
                okText="确定"
                cancelText="取消"
                width={600}
            >
                <Form layout="vertical" className="modal-form">
                    <Form.Item label="商品名称" required>
                        <Input 
                            name="productName"
                            placeholder="请输入商品名称" 
                            value={formData.productName}
                            onChange={handleInputChange}
                            style={{ margin:0 }}
                        />
                    </Form.Item>
                    
                    <Form.Item label="商品分类" required>
                        <Select 
                            name="category"
                            placeholder="请选择商品分类"
                            value={formData.category}
                            onChange={(value) => handleNumberChange('category', value)}
                        >
                            <Select.Option value="电子产品">电子产品</Select.Option>
                            <Select.Option value="服装">服装</Select.Option>
                            <Select.Option value="食品">食品</Select.Option>
                            <Select.Option value="家居">家居</Select.Option>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item label="价格" required>
                        <InputNumber 
                            name="price"
                            placeholder="请输入价格" 
                            value={formData.price}
                            onChange={(value) => handleNumberChange('price', value)}
                            min={0}
                            precision={2}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    
                    <Form.Item label="库存" required>
                        <InputNumber 
                            name="stock"
                            placeholder="请输入库存数量" 
                            value={formData.stock}
                            onChange={(value) => handleNumberChange('stock', value)}
                            min={0}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    
                    <Form.Item label="商品描述">
                        <Input.TextArea 
                            name="description"
                            placeholder="请输入商品描述" 
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                        />
                    </Form.Item>
                    
                    <Form.Item label="主图URL">
                        <Input 
                            name="mainImage"
                            placeholder="请输入商品主图URL" 
                            value={formData.mainImage}
                            onChange={handleInputChange}
                            style={{ margin:0 }}
                        />
                    </Form.Item>
                    
                    <Form.Item label="商品状态">
                        <Select 
                            name="status"
                            value={formData.status}
                            onChange={(value) => handleNumberChange('status', value)}
                        >
                            <Select.Option value="PENDING">审核中</Select.Option>
                            <Select.Option value="ON_SALE">在售</Select.Option>
                            <Select.Option value="OFF_SALE">下架</Select.Option>
                            <Select.Option value="REJECTED">已拒绝</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Merchandise;
