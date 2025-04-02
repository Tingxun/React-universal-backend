import Mock from 'mockjs';

let list = [];  

const testData = {
    getData: () => {
        for(let i = 0; i < 7; i++) {
            list.push(Mock.mock({
                苹果: Mock.Random.float(100, 8000, 0, 0),
                vivo: Mock.Random.float(100, 8000, 0, 0),
                华为: Mock.Random.float(100, 8000, 0, 0),
                小米: Mock.Random.float(100, 8000, 0, 0),
                三星: Mock.Random.float(100, 8000, 0, 0),
                魅族: Mock.Random.float(100, 8000, 0, 0),
            }))
        }
        return {
            code: 20000,
            data: {
                //订单数据
                orderData: {
                    data: list,
                    date: [
                        '2019-01-01',
                        '2020-01-01',
                        '2021-01-01',
                        '2022-01-01',
                        '2023-01-01',
                        '2024-01-01',
                        '2025-01-01'
                    ]
                },
                //饼图
                videoData: [
                    {
                        name: '小米',
                        value: 2999
                    },
                    {
                        name: '华为',
                        value: 7999
                    },
                    {
                        name: '苹果',
                        value: 5999
                    },
                    {
                        name: 'vivo',
                        value: 1999
                    },
                    {
                        name: '三星',
                        value: 3999
                    },
                    {
                        name: '魅族',
                        value: 1999
                    }
                ],
                //柱状图
                userData: [
                    {
                        date: '周一',
                        new: 5,
                        active: 200
                    },
                    {
                        date: '周二',
                        new: 20,
                        active: 100
                    },
                    {
                        date: '周三',
                        new: 36,
                        active: 300
                    },
                    {
                        date: '周四',
                        new: 10,
                        active: 250
                    },
                    {
                        date: '周五',
                        new: 15,
                        active: 400
                    },
                    {
                        date: '周六',
                        new: 30,
                        active: 150
                    },
                    {
                        date: '周日',
                        new: 40,
                        active: 300
                    }
                ],
                //折线图
                tableData: [
                    {
                        name: '华为',
                        todayBuy: 500,
                        monthBuy: 3500,
                        totalBuy: 22000
                    },
                    {
                        name: '小米',
                        todayBuy: 200,
                        monthBuy: 1500,
                        totalBuy: 10000
                    },
                    {
                        name: '苹果',
                        todayBuy: 100,
                        monthBuy: 500,
                        totalBuy: 3000
                    },
                    {
                        name: 'vivo',
                        todayBuy: 300,
                        monthBuy: 2000,
                        totalBuy: 15000
                    },
                    {
                        name:'三星',
                        todayBuy: 400,
                        monthBuy: 2500,
                        totalBuy: 18000
                    },
                    {
                        name: '魅族',
                        todayBuy: 200,
                        monthBuy: 1500,
                        totalBuy: 10000
                    }
                ]
            }
        }
    }
};

export default testData;