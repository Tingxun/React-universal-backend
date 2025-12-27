# Universal Backend 管理系统

## 项目简介

Universal Backend 是一个基于 React 19 的企业级后台管理系统，采用现代化的前端技术栈构建，提供完善的用户管理、权限控制、数据可视化等功能。

## 技术栈

- **前端框架**: React 19.0.0
- **路由管理**: React Router DOM 7.2.0
- **UI组件库**: Ant Design 6.1.2
- **HTTP请求**: Axios 1.7.9
- **数据可视化**: ECharts 5.6.0
- **构建工具**: Create React App

## 功能特性

### 🔐 用户认证与权限管理
- 基于 JWT 的登录认证
- 角色权限控制（管理员、商户、销售）
- 路由级权限守卫
- 动态菜单权限过滤

### 📊 数据可视化仪表盘
- 管理员仪表盘：系统概览、商户统计
- 商户仪表盘：个人业绩、销售数据
- 实时数据图表展示

### 🏪 商户管理
- 商户信息增删改查
- 商户状态管理（活跃/停用/审核中）
- 联系人信息管理

### 🛍️ 商品管理
- 商品列表与分类管理
- 商品搜索与筛选
- 销售统计与分析

### 👤 个人中心
- 个人信息展示与编辑
- 业绩统计与目标完成度
- 操作记录追踪

## 项目结构

```
src/
├── api/                    # API接口管理
│   ├── axios.js           # Axios二次封装
│   └── index.js           # API接口定义
├── assets/                 # 静态资源
├── components/             # 公共组件
│   ├── aside/             # 侧边栏
│   ├── echarts/           # 图表组件
│   ├── header/            # 顶部导航
│   └── tag/               # 标签页
├── config/                 # 配置文件
├── pages/                  # 页面组件
│   ├── home/              # 首页
│   ├── login/             # 登录页
│   ├── register/          # 注册页
│   ├── personal/          # 个人中心
│   ├── sales/             # 商户管理
│   ├── merchandise/       # 商品管理
│   └── other/             # 其他页面
├── router/                 # 路由配置
├── utils/                  # 工具函数
└── App.js                  # 应用入口
```

## 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动

### 构建生产版本

```bash
npm run build
```

构建文件将生成在 `build` 目录中

### 运行测试

```bash
npm test
```

## 配置说明

### API 配置

在 `src/api/axios.js` 中配置后端 API 地址：

```javascript
const baseURL = 'http://your-api-server.com/api';
```

### 菜单配置

在 `src/config/index.js` 中配置系统菜单：

```javascript
const menuList = [
  {
    path: '/home',
    name: 'home',
    label: '首页',
    icon: 'HomeOutlined',
    roles: ['admin', 'sales']
  },
  // ... 更多菜单项
];
```

## 用户角色说明

### 管理员 (admin)
- 系统最高权限
- 管理所有商户和商品
- 查看系统统计数据
- 配置系统参数

### 商户 (merchant)
- 管理自有商品
- 查看销售数据
- 管理客户信息

### 销售 (sales)
- 查看分配的商品
- 管理销售订单
- 查看个人业绩

## 开发指南

### 添加新页面

1. 在 `src/pages` 目录下创建新页面组件
2. 在 `src/router/index.js` 中添加路由配置
3. 在 `src/config/index.js` 中添加菜单项（如需要）

### 添加新 API

1. 在 `src/api/index.js` 中定义新的 API 接口
2. 在页面组件中导入并使用

### 样式开发

- 使用模块化 CSS，每个组件对应独立的 CSS 文件
- 遵循 Ant Design 设计规范
- 支持响应式布局

## 部署说明

### 开发环境部署

1. 确保后端 API 服务正常运行
2. 配置正确的 API 地址
3. 运行 `npm start` 启动开发服务器

### 生产环境部署

1. 运行 `npm run build` 构建生产版本
2. 将 `build` 目录部署到 Web 服务器
3. 配置服务器支持 SPA 路由

## 常见问题

### Q: 登录后页面空白？
A: 检查后端 API 服务是否正常，确认 API 地址配置正确

### Q: 菜单权限不生效？
A: 检查用户角色配置，确认菜单项的 roles 属性设置正确

### Q: 图表无法显示？
A: 确认 ECharts 依赖已正确安装，检查图表数据格式