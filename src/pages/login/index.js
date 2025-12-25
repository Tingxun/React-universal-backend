import './login.css';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { login } from '../../api/index';
import { getUserInfoFromToken } from '../../utils/jwt';
/**
 * 特性	    useNavigate	            Navigate
 * 类型	        Hook	              组件
 * 使用场景	编程式导航（逻辑控制）	声明式导航（条件渲染）
 * 触发方式	调用返回的函数	        渲染组件时自动触发
 * 灵活性	更灵活，支持动态参数	适合静态或简单条件跳转
 */
import { useNavigate, Navigate } from 'react-router-dom';

const { Option } = Select;

function Login() {
    const navigate = useNavigate();
    if (localStorage.getItem('token')) {
        return <Navigate to='/login' replace />
    }
    function handleSubmit(values) {
        
        console.log('values', values);
        login(values).then(res => {
            console.log('res', res);
            // 判断登录验证情况
            if (res.data.code === -20000) {
                alert(res.data.data.message);
                return;
            }
            
            const token = res.data.data.token;
            // 缓存登录凭证token
            localStorage.setItem('token', token);
            
            // 从JWT token中解析用户信息
            const userInfo = getUserInfoFromToken(token);
            if (userInfo) {
                console.log('登录用户信息:', userInfo);
                // 可以根据需要存储用户信息到localStorage或context中
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
            }
            
            navigate('/home');
        })
    };

    return (
        <Form
        className='login-container'
        name="basic"
        initialValues={{
            remember: true,
        }}
        onFinish={(e) => {handleSubmit(e)}}
        autoComplete="off"
        >
            <div className='login-title'>系统登录</div>
            <Form.Item
            label="账号名"
            name="username"
            rules={[{
                required: true,
                message: '请输入您的账号名!',
            }]}>
                <Input placeholder='请输入账号名' />
            </Form.Item>
        
            <Form.Item
            label="密码"
            name="password"
            rules={[
                {
                required: true,
                message: '请输入您的密码!',
                },
            ]}>
                <Input.Password style={{width: '200px', marginLeft: '12px'}} placeholder='请输入密码' />
            </Form.Item>

            <Form.Item
            label="角色"
            name="role"
            initialValue="sales"
            rules={[
                {
                required: true,
                message: '请选择您的角色!',
                },
            ]}>
                <Select placeholder="请选择角色" style={{width: '200px', marginLeft: '12px'}}>
                    <Option value="sales">商户</Option>
                    <Option value="admin">管理员</Option>
                </Select>
            </Form.Item>
        
            <Form.Item name="remember" valuePropName="checked" label={null}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>
        
            <Form.Item className='login-button' label={null}>
                <Button type="primary" htmlType="submit" style={{marginLeft: '10px', width: '120px'}}>
                    登录
                </Button>
                <Button type="default" style={{marginLeft: '10px', width: '120px'}} onClick={() => navigate('/register')}>
                    注册
                </Button> 
            </Form.Item>
        </Form>
    );
}

export default Login;