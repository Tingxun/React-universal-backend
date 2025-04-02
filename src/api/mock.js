import Mock from 'mockjs';
// 引入定义好的模拟数据接口文件
import homeApi from './mockTestData/home'
import userApi from './mockTestData/user'
import permissionApi from './mockTestData/permission'

// 拦截接口（正则表达式-匹配符合请求的url， 请求方法， 回调函数-匹配到相应请求时调用）
Mock.mock(/home\/getHomeData/, 'get', homeApi.getData)
Mock.mock(/user\/getUserList/, 'get', userApi.getUserList)
Mock.mock(/user\/createUser/, 'post', userApi.createUser)
Mock.mock(/user\/deleteUser/, 'post', userApi.deleteUser)
Mock.mock(/user\/updateUser/, 'post', userApi.updateUser)
Mock.mock(/permission\/getMenu/, 'post', permissionApi.getMenu)