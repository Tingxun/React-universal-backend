# API 接口文档

## 基础信息

- **Base URL**: `http://your-domain/api`
- **Content-Type**: `application/json`
- **字符编码**: UTF-8
- **认证方式**: JWT Token（Bearer Token）

### 通用响应格式

```json
{
  "code": 20000,        // 状态码：20000=成功，其他=失败
  "message": "操作成功", // 提示信息
  "data": {}            // 数据内容
}
```

### 状态码说明

| 状态码   | 说明      |
| ----- | ------- |
| 20000 | 成功      |
| 40001 | 登录错误    |
| 40002 | 用户不存在   |
| 40003 | Token无效 |
| 40004 | 权限不足    |
| 40005 | 参数验证错误  |
| 50000 | 服务器错误   |

---

## 1. 认证相关接口

### 1.1 用户登录

**接口**: `POST /api/auth/login`

**请求头**:

```
Content-Type: application/json
```

**请求参数**:

```json
{
  "username": "string (必填)",
  "password": "string (必填)",
  "role": "string (必填, 'admin' | 'sales' | 'merchant')"
}
```

**响应示例**:

```json
{
  "code": 20000,
  "message": "登录成功",
  "data": {
    "token": "JWT_TOKEN_STRING",
    "userInfo": {
      "id": "user_id",
      "username": "username",
      "name": "用户姓名",
      "email": "email@example.com",
      "phone": "13800138000",
      "role": "merchant",
      "department": "部门",
      "status": "active"
    },
    "permissions": ["permission1", "permission2"]
  }
}
```

**前端调用示例**:

```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'merchant',
    password: 'merchant1234',
    role: 'sales'  // 或 'merchant' 或 'admin'
  })
})
.then(res => res.json())
.then(data => {
  if (data.code === 20000) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('userInfo', JSON.stringify(data.data.userInfo));
  }
});
```

---

### 1.2 用户注册

**接口**: `POST /api/auth/register`

**请求参数**:

```json
{
  "username": "string (必填)",
  "password": "string (必填)",
  "name": "string (必填)",
  "email": "string (必填)",
  "phone": "string (可选)",
  "role": "string (可选, 默认'sales', 'admin' | 'sales' | 'merchant')",
  "department": "string (可选)"
}
```

**响应示例**:

```json
{
  "code": 20000,
  "message": "注册成功",
  "data": {
    "userId": "user_id",
    "username": "username"
  }
}
```

---

### 1.3 验证Token

**接口**: `GET /api/auth/verify-token`

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 20000,
  "message": "Token有效",
  "data": {
    "valid": true,
    "user": {
      "id": "user_id",
      "username": "username",
      "role": "merchant"
    }
  }
}
```

---

### 1.4 获取用户权限

**接口**: `GET /api/auth/permissions`

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 20000,
  "message": "获取成功",
  "data": {
    "permissions": ["permission1", "permission2"]
  }
}
```

---

### 1.5 获取角色权限配置

**接口**: `GET /api/auth/role-permissions`

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 20000,
  "message": "获取成功",
  "data": {
    "admin": ["permission1", "permission2"],
    "merchant": ["permission3", "permission4"]
  }
}
```

---

### 1.6 忘记密码

**接口**: `POST /api/auth/forgot-password`

**请求参数**:

```json
{
  "email": "string (必填)"
}
```

---

### 1.7 重置密码

**接口**: `POST /api/auth/reset-password`

**请求参数**:

```json
{
  "token": "string (必填, 重置令牌)",
  "newPassword": "string (必填)"
}
```

---

## 2. 用户管理接口（管理员）

### 2.1 获取用户列表

**接口**: `GET /api/users`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20, 最大: 100)
- `name`: 姓名筛选 (可选)
- `role`: 角色筛选 (可选, 'admin' | 'merchant')

**响应示例**:

```json
{
  "code": 20000,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "user_id",
        "username": "username",
        "name": "用户姓名",
        "email": "email@example.com",
        "phone": "13800138000",
        "role": "merchant",
        "status": "active",
        "created_at": "2024-01-01 00:00:00"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

---

### 2.2 获取用户详情

**接口**: `GET /api/users/{userId}`

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 20000,
  "message": "获取成功",
  "data": {
    "user": {
      "id": "user_id",
      "username": "username",
      "name": "用户姓名",
      "phone": "13800138000",
      "email": "email@example.com",
      "role": "merchant",
      "department": "部门",
      "salesTarget": 100000.00,
      "performance": 50000.00,
      "permissions": ["permission1", "permission2"],
      "status": "active",
      "createdAt": "2024-01-01 00:00:00",
      "updatedAt": "2024-01-01 00:00:00",
      "lastLoginAt": "2024-12-24 12:00:00"
    }
  }
}
```

---

### 2.3 更新用户信息

**接口**: `PUT /api/users/{userId}`

**请求头**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:

```json
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "department": "string",
  "salesTarget": 0,
  "role": "string",
  "status": "string"
}
```

**响应示例**:

```json
{
  "code": 20000,
  "message": "更新成功",
  "data": {
    "id": "user_id",
    "username": "username",
    "name": "用户姓名",
    "email": "email@example.com",
    "phone": "13800138000",
    "role": "merchant",
    "status": "active"
  }
}
```

---

### 2.4 删除用户

**接口**: `DELETE /api/users/{userId}` 或 `POST /api/users/{userId}`

**请求头**:

```
Authorization: Bearer {token}
```

**说明**: 删除用户会同时删除相关的订单、商品和登录日志

---

### 2.5 批量删除用户

**接口**: `POST /api/users/batch-delete`

**请求头**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:

```json
{
  "ids": ["id1", "id2", "id3"]
}
```

---

## 3. 商户商品管理接口

### 3.1 获取商品列表

**接口**: `GET /api/merchant/products`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `page`: 页码 (默认: 1)
- `size`: 每页数量 (默认: 10)
- `category`: 分类筛选 (可选)
- `status`: 状态筛选 (可选, 'ON_SALE' | 'OFF_SALE' | 'PENDING')
- `searchKeyword`: 搜索关键词 (可选)
- `merchantId`: 商户ID (可选, 仅管理员可用)

**响应示例**:

```json
{
  "code": 20000,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "product_id",
        "merchant_id": "merchant_id",
        "product_name": "商品名称",
        "category": "分类",
        "description": "描述",
        "price": 99.99,
        "stock": 100,
        "min_stock": 10,
        "main_image": "图片URL",
        "images": "图片列表JSON",
        "specifications": "规格JSON",
        "status": "ON_SALE",
        "sales_count": 50,
        "views": 200,
        "created_at": "2024-01-01 00:00:00"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

---

### 3.2 创建商品

**接口**: `POST /api/merchant/products`

**请求头**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:

```json
{
  "productName": "string (必填)",
  "category": "string (必填)",
  "description": "string (可选)",
  "price": "number (必填)",
  "stock": "number (必填)",
  "minStock": "number (可选, 默认10)",
  "mainImage": "string (可选)",
  "images": "array (可选)",
  "specifications": "object (可选)",
  "status": "string (可选, 默认'ON_SALE')"
}
```

---

### 3.3 获取商品详情

**接口**: `GET /api/merchant/products/{productId}`

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 20000,
  "message": "success",
  "data": {
    "id": "product_id",
    "productName": "商品名称",
    "category": "分类",
    "description": "商品描述",
    "price": 99.99,
    "stock": 100,
    "mainImage": "https://example.com/image.jpg",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "specifications": [
      {
        "name": "颜色",
        "value": "红色"
      },
      {
        "name": "尺寸",
        "value": "L"
      }
    ],
    "status": "ON_SALE",
    "createTime": "2024-01-01 00:00:00",
    "updateTime": "2024-01-01 00:00:00",
    "salesCount": 50
  }
}
```

---

### 3.4 更新商品

**接口**: `PUT /api/merchant/products/{productId}`

**请求头**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**: 同创建商品

---

### 3.5 删除商品

**接口**: `DELETE /api/merchant/products/{productId}`

**请求头**:

```
Authorization: Bearer {token}
```

**说明**: 如果商品有关联订单，则只下架不删除

---

### 3.6 批量更新库存

**接口**: `POST /api/merchant/products/stock/batch`

**请求头**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:

```json
{
  "items": [
    {
      "productId": "product_id",
      "stock": 100
    }
  ]
}
```

---

## 4. 商户个人资料接口

### 4.1 获取/更新商户资料

**接口**: `GET /api/merchant/profile` (获取)  
**接口**: `PUT /api/merchant/profile` (更新)

**请求头**:

```
Authorization: Bearer {token}
```

**更新请求参数**:

```json
{
  "merchantName": "string",
  "contactPerson": "string",
  "address": "string",
  "businessLicense": "string",
  "phone": "string",
  "email": "string"
}
```

**获取响应示例**:

```json
{
  "code": 20000,
  "message": "success",
  "data": {
    "id": "merchant_id",
    "merchantName": "商户名称",
    "contactPerson": "联系人",
    "phone": "13800138000",
    "email": "email@example.com",
    "address": "商户地址",
    "status": "active",
    "productCount": 50,
    "registrationTime": "2024-01-01 00:00:00"
  }
}
```

**更新响应示例**:

```json
{
  "code": 20000,
  "message": "更新成功",
  "data": {
    "id": "merchant_id",
    "merchantName": "商户名称",
    "contactPerson": "联系人",
    "phone": "13800138000",
    "email": "email@example.com",
    "address": "商户地址",
    "status": "active",
    "productCount": 50,
    "registrationTime": "2024-01-01 00:00:00"
  }
}
```

---

## 5. 商户统计接口

### 5.1 概览统计

**接口**: `GET /api/merchant/statistics/overview`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `startDate`: 开始日期 (可选, 格式: YYYY-MM-DD, 默认: 当月1日)
- `endDate`: 结束日期 (可选, 格式: YYYY-MM-DD, 默认: 今天)

**响应示例**:

```json
{
  "code": 20000,
  "message": "success",
  "data": {
    "totalProducts": 100,
    "onSaleProducts": 80,
    "lowStockProducts": 5,
    "totalSalesAmount": 50000.00,
    "totalOrderCount": 200,
    "avgOrderValue": 250.00,
    "monthlyGrowthRate": 15.5,
    "conversionRate": 2.5
  }
}
```

**响应参数说明**:

| 参数 | 类型 | 说明 |
|------|------|------|
| totalProducts | number | 商品总数 |
| onSaleProducts | number | 在售商品数 |
| lowStockProducts | number | 低库存商品数 |
| totalSalesAmount | number | 总销售额 |
| totalOrderCount | number | 订单总数 |
| avgOrderValue | number | 平均订单价值 |
| monthlyGrowthRate | number | 月度增长率（百分比） |
| conversionRate | number | 转化率（百分比） |

---

### 5.2 商品销售统计

**接口**: `GET /api/merchant/statistics/product-sales`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `startDate`: 开始日期 (可选, 格式: YYYY-MM-DD, 默认: 当月1日)
- `endDate`: 结束日期 (可选, 格式: YYYY-MM-DD, 默认: 今天)
- `category`: 分类筛选 (可选, 默认: 'all')
- `sortBy`: 排序方式 (可选, 'sales' | 'count', 默认: 'sales')

**响应示例**:

```json
{
  "code": 20000,
  "message": "success",
  "data": {
    "productSales": [
      {
        "productId": "product_id",
        "productName": "商品名称",
        "category": "分类",
        "salesAmount": 10000.00,
        "salesCount": 50,
        "stock": 100,
        "avgPrice": 200.00,
        "growthRate": 10.5,
        "conversionRate": 2.5
      }
    ],
    "totalSalesAmount": 50000.00,
    "bestSeller": "热销商品名称",
    "slowMovingProducts": ["滞销商品1", "滞销商品2"]
  }
}
```

**响应参数说明**:

| 参数 | 类型 | 说明 |
|------|------|------|
| productSales | array | 商品销售列表 |
| productSales[].productId | string | 商品ID |
| productSales[].productName | string | 商品名称 |
| productSales[].category | string | 商品分类 |
| productSales[].salesAmount | number | 销售额 |
| productSales[].salesCount | number | 销售数量 |
| productSales[].stock | number | 当前库存 |
| productSales[].avgPrice | number | 平均售价 |
| productSales[].growthRate | number | 增长率（百分比） |
| productSales[].conversionRate | number | 转化率（百分比） |
| totalSalesAmount | number | 总销售额 |
| bestSeller | string | 热销商品名称 |
| slowMovingProducts | array | 滞销商品列表 |

---

### 5.3 库存统计

**接口**: `GET /api/merchant/statistics/inventory`

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 20000,
  "message": "success",
  "data": {
    "inventoryStatus": {
      "totalProducts": 100,
      "inStock": 80,
      "lowStock": 10,
      "outOfStock": 5,
      "overstock": 5
    },
    "stockValue": 500000.00,
    "turnoverRate": 2.5,
    "avgStockDays": 12,
    "alerts": [
      {
        "productId": "product_id",
        "productName": "商品名称",
        "currentStock": 5,
        "minStock": 10,
        "alertType": "LOW_STOCK"
      }
    ]
  }
}
```

**响应参数说明**:

| 参数 | 类型 | 说明 |
|------|------|------|
| inventoryStatus | object | 库存状态统计 |
| inventoryStatus.totalProducts | number | 商品总数 |
| inventoryStatus.inStock | number | 正常库存商品数 |
| inventoryStatus.lowStock | number | 低库存商品数 |
| inventoryStatus.outOfStock | number | 缺货商品数 |
| inventoryStatus.overstock | number | 积压商品数 |
| stockValue | number | 库存总值 |
| turnoverRate | number | 库存周转率 |
| avgStockDays | number | 平均库存天数 |
| alerts | array | 库存预警列表 |
| alerts[].productId | string | 商品ID |
| alerts[].productName | string | 商品名称 |
| alerts[].currentStock | number | 当前库存 |
| alerts[].minStock | number | 最低库存 |
| alerts[].alertType | string | 预警类型 ('LOW_STOCK' | 'OUT_OF_STOCK') |

---

### 5.4 销售趋势

**接口**: `GET /api/merchant/statistics/sales-trend`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `startDate`: 开始日期 (可选, 格式: YYYY-MM-DD, 默认: 当年1月1日)
- `endDate`: 结束日期 (可选, 格式: YYYY-MM-DD, 默认: 今天)
- `groupBy`: 分组方式 (可选, 'day' | 'week' | 'month', 默认: 'week')

**响应示例**:

```json
{
  "code": 20000,
  "message": "success",
  "data": {
    "trendData": [
      {
        "date": "2024-01",
        "salesAmount": 10000.00,
        "orderCount": 50,
        "avgOrderValue": 200.00,
        "productViews": 1000,
        "conversionRate": 5.0
      }
    ],
    "peakDay": "2024-12",
    "peakSales": 20000.00,
    "growthTrend": "up",
    "seasonality": {
      "peakSeason": ["11月", "12月"],
      "lowSeason": ["2月", "3月"]
    }
  }
}
```

**响应参数说明**:

| 参数 | 类型 | 说明 |
|------|------|------|
| trendData | array | 趋势数据列表 |
| trendData[].date | string | 日期（格式根据groupBy变化） |
| trendData[].salesAmount | number | 销售额 |
| trendData[].orderCount | number | 订单数 |
| trendData[].avgOrderValue | number | 平均订单价值 |
| trendData[].productViews | number | 商品浏览量 |
| trendData[].conversionRate | number | 转化率（百分比） |
| peakDay | string | 销售高峰日期 |
| peakSales | number | 销售高峰金额 |
| growthTrend | string | 增长趋势 ('up' | 'down' | 'stable') |
| seasonality | object | 季节性分析 |
| seasonality.peakSeason | array | 旺季月份 |
| seasonality.lowSeason | array | 淡季月份 |

---

### 5.5 商品排行

**接口**: `GET /api/merchant/statistics/product-ranking`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `startDate`: 开始日期 (可选, 格式: YYYY-MM-DD, 默认: 当年1月1日)
- `endDate`: 结束日期 (可选, 格式: YYYY-MM-DD, 默认: 今天)
- `limit`: 数量限制 (可选, 默认: 10)

**响应示例**:

```json
{
  "code": 20000,
  "message": "success",
  "data": {
    "salesRanking": [
      {
        "productId": "product_id",
        "productName": "商品名称",
        "salesAmount": 10000.00,
        "salesCount": 50,
        "ranking": 1
      }
    ],
    "viewsRanking": [
      {
        "productId": "product_id",
        "productName": "商品名称",
        "views": 1000,
        "ranking": 1
      }
    ],
    "conversionRanking": [
      {
        "productId": "product_id",
        "productName": "商品名称",
        "conversionRate": 5.5,
        "ranking": 1
      }
    ]
  }
}
```

**响应参数说明**:

| 参数 | 类型 | 说明 |
|------|------|------|
| salesRanking | array | 销售额排行 |
| salesRanking[].productId | string | 商品ID |
| salesRanking[].productName | string | 商品名称 |
| salesRanking[].salesAmount | number | 销售额 |
| salesRanking[].salesCount | number | 销售数量 |
| salesRanking[].ranking | number | 排名 |
| viewsRanking | array | 浏览量排行 |
| viewsRanking[].productId | string | 商品ID |
| viewsRanking[].productName | string | 商品名称 |
| viewsRanking[].views | number | 浏览量 |
| viewsRanking[].ranking | number | 排名 |
| conversionRanking | array | 转化率排行 |
| conversionRanking[].productId | string | 商品ID |
| conversionRanking[].productName | string | 商品名称 |
| conversionRanking[].conversionRate | number | 转化率（百分比） |
| conversionRanking[].ranking | number | 排名 |

---

### 5.6 财务统计

**接口**: `GET /api/merchant/statistics/finance`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `startDate`: 开始日期 (可选, 格式: YYYY-MM-DD, 默认: 当年1月1日)
- `endDate`: 结束日期 (可选, 格式: YYYY-MM-DD, 默认: 今天)

**响应示例**:

```json
{
  "code": 20000,
  "message": "success",
  "data": {
    "revenue": {
      "total": 100000.00,
      "monthlyAvg": 8333.33,
      "growthRate": 15.5
    },
    "costs": {
      "productCost": 60000.00,
      "operatingCost": 5000.00,
      "total": 65000.00
    },
    "profit": {
      "grossProfit": 40000.00,
      "netProfit": 35000.00,
      "profitMargin": 35.0
    },
    "monthlyData": [
      {
        "month": "2024-01",
        "revenue": 10000.00,
        "cost": 6500.00,
        "profit": 3500.00
      }
    ]
  }
}
```

**响应参数说明**:

| 参数 | 类型 | 说明 |
|------|------|------|
| revenue | object | 收入统计 |
| revenue.total | number | 总收入 |
| revenue.monthlyAvg | number | 月平均收入 |
| revenue.growthRate | number | 增长率（百分比） |
| costs | object | 成本统计 |
| costs.productCost | number | 商品成本 |
| costs.operatingCost | number | 运营成本 |
| costs.total | number | 总成本 |
| profit | object | 利润统计 |
| profit.grossProfit | number | 毛利润 |
| profit.netProfit | number | 净利润 |
| profit.profitMargin | number | 利润率（百分比） |
| monthlyData | array | 月度数据 |
| monthlyData[].month | string | 月份 (YYYY-MM) |
| monthlyData[].revenue | number | 月收入 |
| monthlyData[].cost | number | 月成本 |
| monthlyData[].profit | number | 月利润 |

---

## 6. 平台管理员接口

### 6.1 获取商户列表

**接口**: `GET /api/admin/merchantslist`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `page`: 页码 (默认: 1)
- `size`: 每页数量 (默认: 10)
- `status`: 状态筛选 (可选, 'active' | 'inactive')
- `keyword`: 搜索关键词 (可选, 搜索商户名称、联系人、电话、邮箱)

**响应示例**:

```json
{
  "code": 20000,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "merchant_id",
        "merchantName": "商户名称",
        "contactPerson": "联系人",
        "address": "地址",
        "businessLicense": "营业执照",
        "status": "active",
        "phone": "13800138000",
        "email": "email@example.com",
        "productCount": 50,
        "created_at": "2024-01-01 00:00:00"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

---

### 6.2 获取商户详情

**接口**: `GET /api/admin/merchantsdetail`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `merchantId`: 商户ID (必填)

---

### 6.3 创建商户

**接口**: `POST /api/admin/merchantscreate`

**请求头**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:

```json
{
  "username": "string (必填)",
  "password": "string (必填)",
  "merchantName": "string (必填)",
  "phone": "string (必填)",
  "email": "string (必填)",
  "contactPerson": "string (可选)",
  "address": "string (可选)",
  "businessLicense": "string (可选)"
}
```

---

### 6.4 更新商户

**接口**: `PUT /api/admin/merchantsupdate`

**请求头**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:

```json
{
  "merchantId": "string (必填)",
  "merchantName": "string (可选)",
  "phone": "string (可选)",
  "email": "string (可选)",
  "contactPerson": "string (可选)",
  "address": "string (可选)",
  "businessLicense": "string (可选)"
}
```

---

### 6.5 删除商户

**接口**: `DELETE /api/admin/merchantsdelete`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `merchantId`: 商户ID (必填)

**说明**: 删除商户会同时删除相关的订单、商品和登录日志

---

### 6.6 平台概览统计

**接口**: `GET /api/admin/total`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `startDate`: 开始日期 (可选, 默认: 当年1月1日)
- `endDate`: 结束日期 (可选, 默认: 当年12月31日)

**响应示例**:

```json
{
  "code": 20000,
  "message": "获取成功",
  "data": {
    "totalMerchants": 100,
    "activeMerchants": 80,
    "totalProducts": 1000,
    "onSaleProducts": 800,
    "totalSalesAmount": 100000.00,
    "monthlyGrowthRate": 15.5,
    "merchantRetentionRate": 80.0
  }
}
```

---

### 6.7 平台日报

**接口**: `GET /api/admin/daily-report`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `date`: 日期 (可选, 格式: YYYY-MM-DD, 默认: 今天)

**响应示例**:

```json
{
  "code": 20000,
  "message": "获取成功",
  "data": {
    "date": "2024-12-24",
    "newMerchants": 5,
    "newProducts": 20,
    "activeMerchants": 50,
    "totalTransactions": 100,
    "salesAmount": 10000.00,
    "topCategory": "电子产品",
    "hotProduct": "商品名称",
    "issues": {
      "lowStockProducts": 10,
      "inactiveMerchants": 5
    }
  }
}
```

---

### 6.8 商户增长趋势

**接口**: `GET /api/admin/growth`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `startDate`: 开始日期 (可选, 默认: 当年1月1日)
- `endDate`: 结束日期 (可选, 默认: 当年12月31日)
- `groupBy`: 分组方式 (可选, 'month' | 'week' | 'day', 默认: 'month')

**响应示例**:

```json
{
  "code": 20000,
  "message": "获取成功",
  "data": {
    "trendData": [
      {
        "date": "2024-01",
        "newMerchants": 10,
        "totalMerchants": 10,
        "activeMerchants": 8,
        "churnedMerchants": 0
      }
    ],
    "growthRate": 10.5,
    "churnRate": 2.0
  }
}
```

---

### 6.9 商品分类统计

**接口**: `GET /api/admin/distribution`

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 20000,
  "message": "获取成功",
  "data": {
    "categoryStats": [
      {
        "category": "电子产品",
        "productCount": 100,
        "percentage": 50.0,
        "salesAmount": 50000.00,
        "avgPrice": 500.00
      }
    ],
    "topCategories": ["电子产品", "服装", "食品"],
    "categoryGrowth": [
      {
        "category": "电子产品",
        "growthRate": 15.5,
        "trend": "up"
      }
    ]
  }
}
```

---

### 6.10 商户销售排行

**接口**: `GET /api/admin/ranking`

**请求头**:

```
Authorization: Bearer {token}
```

**查询参数**:

- `startDate`: 开始日期 (可选, 默认: 当年1月1日)
- `endDate`: 结束日期 (可选, 默认: 当年12月31日)
- `rankingType`: 排行类型 (可选, 'sales' | 'orderCount', 默认: 'sales')
- `limit`: 数量限制 (可选, 默认: 10, 最大: 100)

**响应示例**:

```json
{
  "code": 20000,
  "message": "获取成功",
  "data": {
    "rankingList": [
      {
        "merchantId": "merchant_id",
        "merchantName": "商户名称",
        "salesAmount": 100000.00,
        "orderCount": 500,
        "avgOrderValue": 200.00,
        "productCount": 50,
        "ranking": 1
      }
    ],
    "totalSalesAmount": 500000.00,
    "totalOrderCount": 2500
  }
}
```

---

## 7. 实时统计接口

### 7.1 实时销售数据

**接口**: `GET /api/statistics/realtime/sales`

**请求头**:

```
Authorization: Bearer {token}
```

---

### 7.2 监控告警

**接口**: `GET /api/statistics/monitoring/alerts`

**请求头**:

```
Authorization: Bearer {token}
```

---

### 7.3 导出销售报告

**接口**: `POST /api/statistics/export/sales-report`

**请求头**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:

```json
{
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "format": "excel" | "pdf"
}
```

---

### 7.4 导出库存报告

**接口**: `POST /api/statistics/export/inventory-report`

**请求头**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## 8. 测试数据生成接口（仅开发环境）

### 8.1 生成订单数据

**接口**: `POST /api/test/generate-orders`

**请求头**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:

```json
{
  "count": 10,              // 生成订单数量，默认10
  "startDate": "2024-01-01", // 订单开始日期，默认30天前
  "endDate": "2024-12-31",   // 订单结束日期，默认今天
  "merchantId": null,        // 指定商户ID，null则随机选择
  "status": "PAID"          // 订单状态，默认PAID
}
```

**说明**: 

- 会自动更新商品的库存和销量
- 只有状态为 `ON_SALE` 且库存大于 0 的商品才会被选择

---

### 8.2 生成登录日志

**接口**: `POST /api/test/generate-login-logs`

**请求头**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:

```json
{
  "count": 50,              // 生成登录日志数量，默认50
  "startDate": "2024-01-01", // 开始日期，默认30天前
  "endDate": "2024-12-31",   // 结束日期，默认今天
  "merchantId": null        // 指定商户ID，null则为所有商户生成
}
```

---

## 9. 健康检查

### 9.1 健康检查

**接口**: `GET /api/health`

**响应示例**:

```json
{
  "code": 20000,
  "message": "服务正常",
  "data": {
    "status": "ok",
    "timestamp": "2024-12-24 12:00:00"
  }
}
```

---

## 前端调用示例（JavaScript/Axios）

### 基础配置

```javascript
// 设置基础URL和拦截器
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器：自动添加Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一处理错误
api.interceptors.response.use(
  response => {
    if (response.data.code === 20000) {
      return response.data;
    } else {
      return Promise.reject(new Error(response.data.message));
    }
  },
  error => {
    if (error.response?.status === 401) {
      // Token过期，跳转到登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 使用示例

```javascript
// 登录
async function login(username, password, role) {
  try {
    const response = await api.post('/auth/login', {
      username,
      password,
      role
    });
    if (response.code === 20000) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
      return response.data;
    }
  } catch (error) {
    console.error('登录失败:', error.message);
  }
}

// 获取商品列表
async function getProducts(params) {
  try {
    const response = await api.get('/merchant/products', { params });
    return response.data;
  } catch (error) {
    console.error('获取商品列表失败:', error.message);
  }
}

// 创建商品
async function createProduct(productData) {
  try {
    const response = await api.post('/merchant/products', productData);
    return response.data;
  } catch (error) {
    console.error('创建商品失败:', error.message);
  }
}

// 获取商户列表（管理员）
async function getMerchants(params) {
  try {
    const response = await api.get('/admin/merchantslist', { params });
    return response.data;
  } catch (error) {
    console.error('获取商户列表失败:', error.message);
  }
}

// 获取平台统计
async function getPlatformStats(startDate, endDate) {
  try {
    const response = await api.get('/admin/total', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('获取统计失败:', error.message);
  }
}
```

---

## 注意事项

1. **Token管理**: 
   
   - Token存储在 `localStorage` 或 `sessionStorage`
   - 每次请求需要在 Header 中携带: `Authorization: Bearer {token}`
   - Token过期后需要重新登录

2. **角色映射**:
   
   - 前端可以使用 `sales` 或 `merchant` 作为商户角色
   - 后端会自动映射为 `merchant`
   - 登录和注册时都可以使用 `sales` 或 `merchant`

3. **时间格式**:
   
   - 日期格式: `YYYY-MM-DD`
   - 时间格式: `YYYY-MM-DD HH:mm:ss`

4. **分页参数**:
   
   - `page`: 从 1 开始
   - `size`/`limit`: 每页数量，注意不同接口可能使用不同的参数名

5. **错误处理**:
   
   - 所有接口统一返回格式
   - `code !== 20000` 表示失败
   - 根据 `code` 值判断错误类型

6. **CORS**:
   
   - 所有接口已配置 CORS，支持跨域请求
   - 预检请求（OPTIONS）会自动处理

---

## 更新日志

- 2024-12-24: 初始版本，包含所有基础接口
- 修复了统计接口的订单关联问题
- 添加了删除用户时的级联删除功能
- 优化了角色映射机制

