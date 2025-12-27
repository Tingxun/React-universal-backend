import React from 'react';  
import { useState, useEffect } from 'react';
import './sales.css';
import { getMerchantList, createMerchant, updateMerchant, deleteMerchant } from '../../api/index';
import { Table, Popconfirm, Modal, Button, Tooltip, Form, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';


function User() {
    const [formData, setFormData] = useState({
        merchantId: '',
        merchantName: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        businessLicense: '',
        username: '',
        password: '',
        status: 'PENDING'
    });
    const [tableData, setTableData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editType, setEditType] = useState('');

    // 表格组件栏目及其渲染对象
    const tableColumns = [
        {
            title: '商户名称',
            dataIndex: 'merchantName'
        },
        {
            title: '联系人',
            dataIndex: 'contactPerson'
        },
        {
            title: '联系电话',
            dataIndex: 'phone'
        },
        {
            title: '邮箱',
            dataIndex: 'email'
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (status) => {
                const statusMap = {
                    'ACTIVE': { text: '活跃', color: 'green' },
                    'INACTIVE': { text: '停用', color: 'red' },
                    'PENDING': { text: '待审核', color: 'orange' }
                };
                const statusInfo = statusMap[status] || { text: status, color: 'default' };
                return <span style={{ color: statusInfo.color, fontWeight: 'bold' }}>{statusInfo.text}</span>;
            }
        },
        {
            title: '注册时间',
            dataIndex: 'registrationTime',
            render: (time) => time ? new Date(time).toLocaleString() : '-'
        },
        {
            title: '商品数量',
            dataIndex: 'productCount'
        },
        {
            title: '操作',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                    <Tooltip title="编辑商户">
                        <Button 
                            type="link" 
                            icon={<EditOutlined />} 
                            size="small" 
                            onClick={() => {
                            setFormData({
                                merchantId: record.id,
                                merchantName: record.merchantName,
                                contactPerson: record.contactPerson,
                                phone: record.phone,
                                email: record.email,
                                address: record.address,
                                businessLicense: record.businessLicense,
                                status: record.status,
                            });
                            handleEdit('edit');
                        }}
                            style={{ width: '60px', padding: '0 4px', fontSize: '12px' }}
                        >
                            编辑
                        </Button>
                    </Tooltip>
                    <Popconfirm
                        title="提示"
                        description="此操作将删除商户，是否继续？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Tooltip title="删除商户">
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
    ]

    // 获取商户数据
    function getMerchantData() {
        getMerchantList().then((res) => {
            // console.log('获取商户列表成功:', res.data.data.list || []);
            const { list } = res.data.data || {};
            const tableData = (list || []).map((item) => {
                return {
                    id: item.id,
                    merchantName: item.merchantName,
                    contactPerson: item.contactPerson || '-',
                    phone: item.phone || '-',
                    email: item.email,
                    status: item.status ? item.status.toUpperCase() : 'PENDING',
                    registrationTime: item.registrationTime,
                    productCount: item.productCount || 0,
                    address: item.address || '-',
                    businessLicense: item.businessLicense || '-',
                }
            });
            // console.log('转换后的表格数据:', tableData || []);
            setTableData(tableData);
    });
    };

    useEffect(() => {
        getMerchantData();
    }, []);

    // 删除商户
    function handleDelete(id) { 
        deleteMerchant(id).then(() => {
            getMerchantData();
        })
    };
    // 控制弹窗动作和编辑类型
    function handleEdit(type) {
        setIsModalOpen(true);
        setEditType(type);
        if (type === 'add') {
            setFormData({
                merchantId: '',
                merchantName: '',
                contactPerson: '',
                phone: '',
                email: '',
                address: '',
                businessLicense: '',
                username: '',
                password: '',
                status: 'PENDING'
            });
        }
    };
    // 反馈输入变化
    function handleInputChange(e) {
        if (e.target.type === 'radio') {
            setFormData({
                ...formData,
                [e.target.name]: parseInt(e.target.value, 10)
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    // 处理Select组件变化
    function handleSelectChange(name, value) {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // 搜索商户
    function handleSearch() {
        // 保存搜索关键词，避免异步操作中丢失
        const searchKeyword = formData.merchantName;
        
        // 获取商户数据
        getMerchantList({
            searchKeyword: searchKeyword,
        }).then((res) => {
            const { list } = res.data.data || {};
            const tableData = (list || []).map((item) => ({
                id: item.id,
                merchantName: item.merchantName,
                contactPerson: item.contactPerson || '-',
                phone: item.phone || '-',
                email: item.email,
                status: item.status ? item.status.toUpperCase() : 'PENDING',
                registrationTime: item.registrationTime,
                productCount: item.productCount || 0,
                address: item.address || '-',
                businessLicense: item.businessLicense || '-',
            }));
            setTableData(tableData);
            
            // 搜索完成后不清空搜索框，让用户知道当前搜索条件
            // 如果需要清空搜索框，可以取消下面的注释
            // setFormData({
            //     ...formData,
            //     merchantName: '',
            // });
        }).catch(error => {
            console.error('搜索失败:', error);
        });
    };
    // 表单验证
    function formValidation(formData) {
        const errors = {};
    
        // 检查商户名称是否为空
        if (!formData.merchantName) {
            errors.merchantName = '商户名称不能为空';
        }
    
        // 检查联系人是否为空
        if (!formData.contactPerson) {
            errors.contactPerson = '联系人不能为空';
        }
    
        // 检查联系电话是否为空
        if (!formData.phone) {
            errors.phone = '联系电话不能为空';
        }
    
        // 检查邮箱格式
        if (!formData.email) {
            errors.email = '邮箱不能为空';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = '邮箱格式不正确';
        }

        // 新增商户时需要检查用户名和密码
        if (editType === 'add') {
            if (!formData.username) {
                errors.username = '用户名不能为空';
            }
            if (!formData.password) {
                errors.password = '密码不能为空';
            }
        }
    
        // 如果有错误，打印错误信息并返回 false
        if (Object.keys(errors).length > 0) {
            console.error('表单验证失败:', errors);
            return false;
        }
        // 如果没有错误，返回 true
        return true;
    }

    // 处理弹窗确定事件
    function handleOk () {
        if (formValidation(formData)) {
            if (editType === 'add') {
                createMerchant(formData).then(() => {
                    setIsModalOpen(false);
                    getMerchantData();
                });
            }else if (editType === 'edit') {
                console.log('edit', formData);
                updateMerchant(formData).then(() => {
                    setIsModalOpen(false);
                    getMerchantData();
                });
            }
        }

    }
    return (
        <div className='user-container'>
            <div className='search-bar'>
                <button onClick={() => handleEdit('add')} >+新增商户</button>
                <form onSubmit={(e) => {e.preventDefault();handleSearch()}}>
                    <input type="text" name='merchantName' placeholder="请输入商户名称" 
                    style={{marginRight: '10px'}}
                    onChange={(e) => handleInputChange(e)} />
                    <button type='submit'>搜索</button>
                </form>
            </div>
            <div className='card' sytle={{marginTop: '0'}}>
                <Table rowKey={'id'} columns={tableColumns} dataSource={tableData} pagination={false} />
            </div>
            <Modal
                title={editType === 'add' ? '新增商户' : '编辑商户'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    setFormData({
                        merchantName: '',
                        contactPerson: '',
                        phone: '',
                        email: '',
                        address: '',
                        businessLicense: '',
                        username: '',
                        password: '',
                        status: 'PENDING'
                    });
                }}
                okText="确定"
                cancelText="取消"
                width={600}
            >
                <Form layout="vertical" className="modal-form">
                    <Form.Item label="商户名称" required>
                        <Input 
                            name="merchantName"
                            placeholder="请输入商户名称" 
                            value={formData.merchantName}
                            onChange={handleInputChange}
                            style={{ margin:0 }}
                        />
                    </Form.Item>
                    
                    <Form.Item label="联系人" required>
                        <Input 
                            name="contactPerson"
                            placeholder="请输入联系人姓名" 
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            style={{ margin:0 }}
                        />
                    </Form.Item>
                    
                    <Form.Item label="联系电话" required>
                        <Input 
                            name="phone"
                            placeholder="请输入联系电话" 
                            value={formData.phone}
                            onChange={handleInputChange}
                            style={{ margin:0 }}
                        />
                    </Form.Item>
                    
                    <Form.Item label="邮箱" required>
                        <Input 
                            name="email"
                            placeholder="请输入邮箱地址" 
                            value={formData.email}
                            onChange={handleInputChange}
                            style={{ margin:0 }}
                        />
                    </Form.Item>
                    
                    <Form.Item label="地址">
                        <Input 
                            name="address"
                            placeholder="请输入商户地址" 
                            value={formData.address}
                            onChange={handleInputChange}
                            style={{ margin:0 }}
                        />
                    </Form.Item>
                    
                    <Form.Item label="营业执照号">
                        <Input 
                            name="businessLicense"
                            placeholder="请输入营业执照号" 
                            value={formData.businessLicense}
                            onChange={handleInputChange}
                            style={{ margin:0 }}
                        />
                    </Form.Item>
                    
                    {editType === 'add' && (
                        <>
                            <Form.Item label="用户名" required>
                                <Input 
                                    name="username"
                                    placeholder="请输入登录用户名" 
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    style={{ margin:0 }}
                                />
                            </Form.Item>
                            
                            <Form.Item label="密码" required>
                                <Input.Password 
                                    name="password"
                                    placeholder="请输入登录密码" 
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    style={{ margin:0 }}
                                />
                            </Form.Item>
                        </>
                    )}
                    
                    <Form.Item label="状态">
                        <Select 
                            name="status"
                            value={formData.status}
                            onChange={(value) => handleSelectChange('status', value)}
                        >
                            <Select.Option value="PENDING">待审核</Select.Option>
                            <Select.Option value="ACTIVE">活跃</Select.Option>
                            <Select.Option value="INACTIVE">停用</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default User;