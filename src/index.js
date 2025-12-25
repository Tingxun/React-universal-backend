import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import './api/mock';

// 主入口文件
// 挂载点，使用 React 和 ReactDOM 创建并渲染一个 React 应用的主入口部分
// id为root的DOM元素通常在public/index.html文件中，用于渲染 React 应用的根组件。
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // React.StrictMode是一个用于开发环境的工具，用于开启React的严格模式。
  // 严格模式下会对应用进行额外的检查和警告，以帮助开发者发现并修复一些常见的错误。
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
