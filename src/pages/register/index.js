import React from 'react';
import { useState } from 'react';
import { Button, Form, Input, Select, message } from 'antd';
import { register } from '../../api/index';
import { useNavigate } from 'react-router-dom';
import './register.css';

const { Option } = Select;

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const res = await register(values);
            
            // 调试：打印完整的响应结构
            console.log('注册响应:', res);

            // 兼容不同的响应结构
            const responseData = res.data || res;
            const code = responseData.code || responseData.status;
            const messageText = responseData.message || responseData.data?.message;
            
            if (code === 20000 || code === 200) {
                message.success(messageText || '注册成功！');
                // 注册成功后跳转到登录页面
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                message.error(messageText || '注册失败');
            }
        } catch (error) {
            console.error('注册请求失败:', error);
            message.error('网络错误，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <Form
                name="register"
                className="register-form"
                onFinish={handleSubmit}
                autoComplete="off"
                layout="vertical"
            >
                <div className="register-title">用户注册</div>
                
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[
                        { required: true, message: '请输入用户名!' }
                    ]}
                >
                    <Input placeholder="请输入用户名" />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                        { required: true, message: '请输入密码!' }
                    ]}
                >
                    <Input.Password placeholder="请输入密码" />
                </Form.Item>

                <Form.Item
                    label="姓名"
                    name="name"
                    rules={[
                        { required: true, message: '请输入姓名!' }
                    ]}
                >
                    <Input placeholder="请输入真实姓名" />
                </Form.Item>

                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                        { required: true, message: '请输入邮箱!' },
                        { type: 'email', message: '请输入有效的邮箱地址!' }
                    ]}
                >
                    <Input placeholder="请输入邮箱地址" />
                </Form.Item>

                <Form.Item
                    label="手机号"
                    name="phone"
                    rules={[
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号!' }
                    ]}
                >
                    <Input placeholder="请输入手机号（可选）" />
                </Form.Item>

                <Form.Item
                    label="角色"
                    name="role"
                    initialValue="sales"
                >
                    <Select placeholder="请选择角色">
                        <Option value="sales">商户</Option>
                        <Option value="admin">管理员</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="部门"
                    name="department"
                >
                    <Input placeholder="请输入部门（可选）" />
                </Form.Item>

                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        className="register-button"
                        loading={loading}
                    >
                        注册
                    </Button>
                    <Button 
                        type="default" 
                        className="login-link-button"
                        onClick={() => navigate('/login')}
                    >
                        返回登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Register;