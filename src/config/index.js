const menuList = [
    {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'HomeOutlined',
        url: '/home/idnex'
    },
    {
        path: '/user',
        name: 'user',
        label: '用户管理',
        icon: 'UserOutlined',
        url: '/user/idnex'
    },
    {
        path: '/mall',
        name: 'mall',
        label: '商品管理',
        icon: 'ShoppingOutlined',
        url: '/mall/idnex'
    },
    {
        path: '/other',
        name: 'other',
        label: '其他管理',
        icon: 'SettingOutlined',
        children: [
            {
                path: '/other/pageOne',
                name: 'pageOne',
                label: '页面1',
                icon: 'HomeOutlined',
                url: '/other/pageOne'
            },
            {
                path: '/other/pageTwo',
                name: 'pageTwo',
                label: '页面2',
                icon: 'HomeOutlined',
                url: '/other/pageTwo'
            }
            
        ]
    }
]

export default menuList;