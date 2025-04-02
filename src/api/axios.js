import axios from 'axios';
/**
 * @description: axios二次封装
 * Axios 是一个基于 promise 的 HTTP 库，可以用于浏览器和 node.js 的开发工具
 * 主要应用于前、后端数据交互，使用Axios向服务器发送HTTP请求，并接收服务器返回的响应数据
 */
const baseURL = '/api';


//axios二次封装核心思想:增强接口请求的泛用性和安全性
class HttpRequest {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    getInsideConfig() {
        const config = {
            baseURL: this.baseURL,
            header: {}
        };
        return config;
    }

    // 目前使用的原装拦截器，等待后续改进
    interceptors(instance) {
        // 添加请求拦截器，在每个请求发送前被调用
        instance.interceptors.request.use(function (config) {
            // 在发送请求之前做些什么
            return config;
        }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
        });

        // 添加响应拦截器，在每次接受响应数据后被调用
        instance.interceptors.response.use(function (response) {
            // 2xx 范围内的状态码都会触发该函数。
            // 对响应数据做点什么
            return response;
        }, function (error) {
            // 超出 2xx 范围的状态码都会触发该函数。
            // 对响应错误做点什么
            return Promise.reject(error);
        });
    }

    request(options) {
        //合并配置
        options = {...this.getInsideConfig(), ...options};
        //创建axios实例
        const instance = axios.create();
        //axios实例拦截器绑定
        this.interceptors(instance);
        return instance(options);
    }
}
//返回可用的axios实例
const http = new HttpRequest(baseURL);
export default http;