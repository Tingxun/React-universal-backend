import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import * as Icon from '@ant-design/icons';
import Echarts from '../../components/echarts';
import { getHomeData } from '../../api/index';  
import './home.css';

const tableColumns = [
    {
        title: '品牌',
        dataIndex: 'name'
    },
    {
        title: '今日购买',
        dataIndex: 'todayBuy'
    },
    {
        title: '本月购买',
        dataIndex: 'monthBuy'
    },
    {
        title: '总购买',
        dataIndex: 'totalBuy'
    }
]

const countData = [
    {
        name: '今日支付订单',
        value: 1234,
        icon: 'CheckCircleOutlined',
        color: '#2ec7c9'
    },
    {
        name: '今日收藏订单',
        value: 1234,
        icon: 'ClockCircleOutlined',
        color: '#ffb980'
    },
    {
        name: '今日未支付订单',
        value: 1234,
        icon: 'CloseCircleOutlined',
        color: '#5ab1ef'
    },
    {
        name: '本月支付订单',
        value: 1234,
        icon: 'CheckCircleOutlined',
        color: '#2ec7c9'
    },
    {
        name: '本月收藏订单',
        value: 1234,
        icon: 'ClockCircleOutlined',
        color: '#ffb980'
    },
    {
        name: '本月未支付订单',
        value: 1234,
        icon: 'CloseCircleOutlined',
        color: '#5ab1ef'
    }
]
// 动态获取icon，处理菜单数据
const iconToElement = (name) => React.createElement(Icon[name]);
function Home() {
    const [tableData, setTableData] = useState([]);
    const [ echartData, setEchartData ] = useState({});

    const userImg = require('../../assets/images/shadow4.jpg');
    // 页面初次渲染完成后请求加载数据
    // React严格模式下组件渲染一次，Effect执行一次会导致下列请求被调用两次
    useEffect(() => {
        // 通过api获取数据
        getHomeData().then(({data}) => {
            // 打印数据
            // console.log(data, 'res');
            // 解构数据
            const {tableData, orderData, videoData, userData} = data.data;
            // 设置表格数据
            setTableData(tableData);
            // 重组订单数据
            const order = orderData;
            const xAxis = order.date;
            const keyArray = Object.keys(order.data[0]);
            let orderSeries = [];
            keyArray.forEach((key) => {
                orderSeries.push({
                    name: key,
                    data: order.data.map(item => item[key]),
                    type: 'line'
                });
            });
            setEchartData({
                order: {
                    xAxis,
                    series: orderSeries
                },
                user: {
                    xAxis: userData.map(item => item.date),
                    series: [
                        {
                            name: '活跃用户',
                            data: userData.map(item => item.active),
                            type: 'bar'
                        },
                        {
                            name: '新增用户',
                            data: userData.map(item => item.new),
                            type: 'bar'
                        }
                    ]
                },
                video: {
                    series: [
                        {
                            name: '视频播放量',
                            data: videoData,
                            type: 'pie'
                        }
                    ]
                }
                });
        });
    }, []);
    
    return (
        <div className='flex-container'>
            <div className='leftcolumn'>
                <div className='card'>
                    <div className='user'>
                        <img 
                        className='user-avatar'
                        src={userImg} alt='User Avatar' 
                        width='150px' height='150px'
                        style={{borderRadius: '50%', flex: '0 0 150px'}}
                        />
                        <div className='user-info'>
                            <p style={{fontSize: '25px'}}><b>Adimin</b></p>
                            <p>超级管理员</p>
                        </div>
                    </div>
                    <div className='login-info'>
                        <pre>
                            <p>上次登录时间:    <span>2025-2-20 17:18</span></p>
                            <p>上次登录地点:    <span>武汉-洪山区-华中科技大学</span></p>
                        </pre>
                    </div>
                </div>
                <div className='card'>
                    <Table rowKey={'name'} columns={tableColumns} dataSource={tableData} pagination={false} />
                </div>
            </div>
            <div className='rightcolumn'>
                <div className='sale-row'>
                    {countData.map((item, index) => {
                        return (
                            <div 
                            className='card' 
                            key={index}
                            style={{
                                display: 'flex',
                                flex: '1 1 220px',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                height: '100px',
                                margin: '10px 5px 5px 5px'}}>
                                <div className='icon-box' style={{backgroundColor: item.color}}>
                                    {iconToElement(item.icon)}
                                </div>
                                <div className='sale-info'>
                                    <p className='sale-title' style={{ fontSize: '14px' ,color: 'LightGray' }}>{item.name}</p>
                                    <p className='sale-value' style={{ fontSize: '20px' }}><b>￥</b>{item.value}</p>
                                </div>
                            </div>
                        )}
                    )}
                </div>
                <div className='chart-row' style={{justifyContent: 'center'}}>
                    <div 
                    className='card'
                    style={{display: 'flex', height: '240px', width: '680px', alignItems: 'center'}}>
                        {echartData.order&&
                        <Echarts 
                        chartData={echartData.order} 
                        isAxisChart='true' 
                        style={{height: '260px', width: '640px'}}
                        />}
                    </div>
                </div>
                <div className='chart-row' style={{justifyContent: 'space-between'}}>
                    {echartData.video&&
                        <Echarts 
                        chartData={echartData.video} 
                        isAxisChart='false'
                        style={{height: '260px', width: '300px', marginLeft: '10px'}}
                    />}
                    {echartData.user&&
                        <Echarts 
                        chartData={echartData.user} 
                        isAxisChart='true'
                        style={{height: '260px', width: '380px', marginRight: '10px'}}
                    />}
                </div>
            </div>
        </div>
    );
}

export default Home;