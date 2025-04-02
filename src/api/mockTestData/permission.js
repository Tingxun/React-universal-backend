import Mock from 'mockjs';

const loginData = {
    getMenu: (config) => {
        // console.log('config', config);
    const {username, password} = JSON.parse(config.body);
        // 先判断用户是否存在
        // 判断账号和密码是否对应
        if (username === 'admin' && password === 'admin') {
            return {
                code: 20000,
                data: {
                    menu: [
                        {
                            path: '/home',
                            name: 'home',
                            label: '首页',
                            icon: 's-home',
                            url: 'home/index'
                        },
                        {
                            path: '/user',
                            name: 'user',
                            label: '用户管理',
                            icon: 'user',
                            url: 'user/index'
                        },
                        {
                            path: '/mall',
                            name: 'mall',
                            label: '商品管理',
                            icon: 'video-play',
                            url: 'mall/index'
                        },
                        {
                            path: '/其他',
                            icon: 'loction',
                            children: [
                                {
                                    path: '/pageOne',
                                    name: 'pageOne',
                                    label: '页面1',
                                    icon: 'setting',
                                    url: 'other/pageOne.vue'
                                },
                                {
                                    path: '/pageTwo',
                                    name: 'pageTwo',
                                    label: '页面2',
                                    icon: 'setting',
                                    url: 'other/pageTwo.vue'
                                }
                            ]
                        }             
                    ],
                    token: Mock.Random.guid(),
                    message: '获取成功'                
                }
            }
        }else if (username === 'user' && password === 'user') {
            return {
                code: 20000,
                data: {
                    menu: [
                        {
                            path: '/home',
                            name: 'home',
                            label: '首页',
                            icon: 's-home',
                            url: 'home/index'
                        },
                        {
                            path: '/mall',
                            name: 'mall',
                            label: '商品管理',
                            icon: 'video-play',
                            url: 'mall/index'
                        }
                    ],
                    token: Mock.Random.guid(),
                    message: '获取成功'
                }
            }
        }else {
            // 验证失败
            return {
                code: -20000,
                data: {
                    message: '账号或密码不正确'
                }
            }
        }
    }
}


export default loginData;