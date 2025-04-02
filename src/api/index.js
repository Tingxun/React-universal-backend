import http from "./axios"
/**
 * axios的配置对象options主要包括的属性如下：
 * url：请求地址
 * method：请求方法，默认为get
 * params：get请求的参数，post请求的参数
 * data：post请求的参数
 * headers：请求头
 * timeout：请求超时时间
 * 
 */

// 获取数据api
export function getHomeData() {
    return http.request({
        url: "/home/getHomeData",
        method: "get"
    })
}
export function getUserList(params) {
    return http.request({
        url: "/user/getUserList",
        method: "get",
        params
    })
}
export function createUser(data) {
    return http.request({
        url: "/user/createUser",
        method: "post",
        data
    })
}
export function updateUser(data) {
    return http.request({
        url: "/user/updateUser",
        method: "post",
        data
    })
}
export function deleteUser(data) {
    return http.request({
        url: "/user/deleteUser",
        method: "post",
        data
    })
}

export function getMenu(data) {
    return http.request({
        url: "/permission/getMenu",
        method: "post",
        data
    })
}