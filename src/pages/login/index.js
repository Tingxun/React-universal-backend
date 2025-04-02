import './login.css';
import { Button, Checkbox, Form, Input } from 'antd';
import { getMenu } from '../../api/index';
/**
 * 特性	    useNavigate	            Navigate
 * 类型	        Hook	              组件
 * 使用场景	编程式导航（逻辑控制）	声明式导航（条件渲染）
 * 触发方式	调用返回的函数	        渲染组件时自动触发
 * 灵活性	更灵活，支持动态参数	适合静态或简单条件跳转
 */
import { useNavigate, Navigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    if (localStorage.getItem('token')) {
        return <Navigate to='/login' replace />
    }
    function handleSubmit(values) {
        getMenu(values).then(res => {
            console.log('res', res);
            // 判断登录验证情况
            if (res.data.code === -20000) {
                alert(res.data.data.message);
                return;
            }
            // 缓存登录凭证token，并进入系统
            localStorage.setItem('token', res.data.data.token);
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
        
            <Form.Item name="remember" valuePropName="checked" label={null}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>
        
            <Form.Item className='login-button' label={null}>
                <Button type="primary" htmlType="submit" style={{marginLeft: '10px', width: '120px'}}>
                    登录
                </Button>
                <button>注册</button> 
            </Form.Item>
        </Form>
    );
}

export default Login;