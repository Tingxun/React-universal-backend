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

// 测试用API
export function getData() {
    return http.request({
        url: "/health",
        method: "get"
    })
}

// 登陆注册API
export function register(data) {
    return http.request({
        url: "/auth/register",
        method: "post",
        data
    })
}

export function login(data) {
    return http.request({
        url: "/auth/login",
        method: "post",
        data
    })
}

// 商品管理API
export function getProductList(params) {
    return http.request({
        url: "/merchant/products",
        method: "get",
        params
    })
}

export function getProductDetail(productId) {
    return http.request({
        url: `/merchant/products/${productId}`,
        method: "get"
    })
}

export function createProduct(data) {
    return http.request({
        url: "/merchant/products",
        method: "post",
        data
    })
}

export function updateProduct(productId, data) {
    return http.request({
        url: `/merchant/products/${productId}`,
        method: "put",
        data
    })
}

export function deleteProduct(productId) {
    return http.request({
        url: `/merchant/products/${productId}`,
        method: "delete"
    })
}

// 商户信息API
export function getMerchantProfile() {
    return http.request({
        url: "/merchant/profile",
        method: "get"
    })
}

export function updateMerchantProfile(data) {
    return http.request({
        url: "/merchant/profile",
        method: "put",
        data
    })
}

// 商户管理API（平台管理员）
export function getMerchantList(params) {
    return http.request({
        url: "/api/admin/merchantslist",
        method: "get",
        params
    })
}

export function createMerchant(data) {
    return http.request({
        url: "/api/admin/merchantscreate",
        method: "post",
        data
    })
}

export function updateMerchant(data) {
    return http.request({
        url: `/api/admin/merchantsupdate?merchantId=${data.merchantId}`,
        method: "put",
        data
    })
}

export function deleteMerchant(merchantId) {
    return http.request({
        url: `/api/admin/merchantsdelete?merchantId=${merchantId}`,
        method: "delete"
    })
}

export function getMerchantDetail(merchantId) {
    return http.request({
        url: `/api/admin/merchantsdetail?merchantId=${merchantId}`,
        method: "get"
    })
}
