const menuList = [
    {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'HomeOutlined',
        url: '/home/index',
        roles: ['admin', 'sales'] // 所有角色都可以访问
    },
    {
        path: '/personal',
        name: 'personal',
        label: '个人中心',
        icon: 'UserOutlined',
        url: '/personal/index',
        roles: ['admin', 'sales'] // 所有角色都可以访问
    },
    {
        path: '/sales',
        name: 'sales',
        label: '商户管理',
        icon: 'AuditOutlined',
        url: '/sales/index',
        roles: ['admin'] // 只有管理员可以访问
    },
    {
        path: '/merchandise',
        name: 'merchandise',
        label: '商品管理',
        icon: 'ShoppingOutlined',
        url: '/merchandise/index',
        roles: ['admin', 'sales'] // 所有角色都可以访问
    },
    {
        path: '/other',
        name: 'other',
        label: '其他管理',
        icon: 'SettingOutlined',
        roles: ['admin', 'sales'], // 所有角色都可以访问
        children: [
            {
                path: '/other/pageOne',
                name: 'pageOne',
                label: '页面1',
                icon: 'HomeOutlined',
                url: '/other/pageOne',
                roles: ['admin', 'sales']
            },
            {
                path: '/other/pageTwo',
                name: 'pageTwo',
                label: '页面2',
                icon: 'HomeOutlined',
                url: '/other/pageTwo',
                roles: ['admin', 'sales']
            }
            
        ]
    }
]

export default menuList;