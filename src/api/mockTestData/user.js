import Mock from 'mockjs';
// 使用Mock.js模拟后端API服务器

// get请求从config.url中获取参数，post请求从config.body中获取参数
function param2Obj(url) {
    // console.log('URL:', url);
    const search = url.split('?')[1];
    // url中没有请求参数返回空值
    if (!search) {
        console.log('No search parameters found');
        return {};
    }
    try {
        const params = new URLSearchParams(search);
        return {
            name: params.get('name') || '',
            page: parseInt(params.get('page'), 10) || 1,
            limit: parseInt(params.get('limit'), 10) || 20
        }
    } catch (error) {
        console.error('解析 URL 查询参数时出错:', error);
        return {};
    }
}

let list = [];
const count = 200;
for (let i = 0; i < count; i++) {
    list.push(Mock.mock({
        id: Mock.Random.guid(),
        name: Mock.Random.cname(),
        addr: Mock.mock('@county(true)'),
        'age|18-60': 1,
        birth: Mock.Random.date(),
        gender: Mock.Random.integer(0, 1)
    }));
}

const userData = {
    // 获取用户列表
    getUserList: (config) => {
        const { name, page=1, limit=20} = param2Obj(config.url);
        // console.log('name: ', name);
        let mockList = list.filter(user => {
        if (name && user.name.indexOf(name) === -1) return false;
        return true;
        });
        const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));
        return {code: 20000 ,count: mockList.length, items: pageList}; 
    },
    // 删除用户
    deleteUser: (config) => {
        const id = JSON.parse(config.body).id;
        if (!id) {
            return {code: -999, data: {message: '参数不正确，删除失败'}};
        } else {
            list = list.filter(u => u.id !== id);
            return {code: 20000, data: {message: '删除成功'}};

        }
    },
    // 批量删除
    batchRemoveUser: (config) => {
        let {ids} = param2Obj(config.url);
        ids = ids.split(',');
        list = list.filter(u => !ids.includes(u.id));
        return {code: 20000, data: {message: '批量删除成功'}};
    },
    // 新增用户
    createUser: (config) => {
        const {name, age, addr, birth, gender} = JSON.parse(config.body);
        list.unshift({
            id: Mock.Random.guid(),
            name: name,
            age: age,
            addr: addr,
            birth: birth,
            gender: gender
        });
        return {
            code: 20000,
            data: {
                message: '添加成功'
            }
        }
    },
    // 更新用户
    updateUser: (config) => {
        let updated = false;
        const { id, name, age, addr, birth, gender } = JSON.parse(config.body);
        
        list = list.map(u => {
            if (u.id === id) {
                updated = true;
                return {
                    ...u,
                    name: name || u.name,
                    age: age !== undefined ? age : u.age,
                    addr: addr || u.addr,
                    birth: birth || u.birth,
                    gender: gender !== undefined ? gender : u.gender
                };
            }
            return u;
        });
    
        if (!updated) {
            return {
                code: -999,
                data: { message: '未找到指定用户，更新失败' }
            };
        }
    
        return {
            code: 20000,
            data: {
                message: '编辑成功'
            }
        };
    }
}

export default userData;