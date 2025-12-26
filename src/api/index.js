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

// 商品销售统计API（商户视角）
export function getProductSalesStatistics(params) {
    return http.request({
        url: "/api/merchant/statistics/product-sales",
        method: "get",
        params
    })
}

// 商户销售排行API（管理员视角）
export function getMerchantRanking(params) {
    return http.request({
        url: "/api/admin/ranking",
        method: "get",
        params
    })
}

// 商品类别销售趋势API
// 请求参数: startDate(开始日期), endDate(结束日期), groupBy(分组方式: day|week|month)
export function getCategorySalesStatistics(params) {
    return http.request({
        url: "/api/merchant/statistics/category-sales",
        method: "get",
        params
    })
}

// 商品分类统计API（管理员视角）
// 请求参数: startDate(开始日期), endDate(结束日期)
export function getCategoryDistribution(params) {
    return http.request({
        url: "/api/admin/distribution",
        method: "get",
        params
    })
}

// 商户统计API - 新增接口
export function getMerchantOverviewStatistics(params) {
    return http.request({
        url: "/api/merchant/statistics/overview",
        method: "get",
        params
    })
}

export function getMerchantInventoryStatistics(params) {
    return http.request({
        url: "/api/merchant/statistics/inventory",
        method: "get",
        params
    })
}

export function getMerchantSalesTrendStatistics(params) {
    return http.request({
        url: "/api/merchant/statistics/sales-trend",
        method: "get",
        params
    })
}

export function getMerchantProductRankingStatistics(params) {
    return http.request({
        url: "/api/merchant/statistics/product-ranking",
        method: "get",
        params
    })
}

export function getMerchantFinanceStatistics(params) {
    return http.request({
        url: "/api/merchant/statistics/finance",
        method: "get",
        params
    })
}
