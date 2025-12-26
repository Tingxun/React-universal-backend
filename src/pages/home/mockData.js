// 模拟数据用于仪表盘演示
export const mockOverviewData = {
    code: 20000,
    message: "success",
    data: {
        totalProducts: 156,
        onSaleProducts: 128,
        lowStockProducts: 8,
        totalSalesAmount: 125000.00,
        totalOrderCount: 342,
        avgOrderValue: 365.50,
        monthlyGrowthRate: 12.5,
        conversionRate: 3.2
    }
};

export const mockInventoryData = {
    code: 20000,
    message: "success",
    data: {
        inventoryStatus: {
            totalProducts: 156,
            inStock: 128,
            lowStock: 8,
            outOfStock: 5,
            overstock: 15
        },
        stockValue: 250000.00,
        turnoverRate: 2.8,
        avgStockDays: 13,
        alerts: [
            {
                productId: "prod001",
                productName: "iPhone 15 Pro",
                currentStock: 3,
                minStock: 10,
                alertType: "LOW_STOCK"
            },
            {
                productId: "prod002",
                productName: "MacBook Air",
                currentStock: 0,
                minStock: 5,
                alertType: "OUT_OF_STOCK"
            },
            {
                productId: "prod003",
                productName: "AirPods Pro",
                currentStock: 2,
                minStock: 8,
                alertType: "LOW_STOCK"
            }
        ]
    }
};

export const mockSalesTrendData = {
    code: 20000,
    message: "success",
    data: {
        trendData: [
            {
                date: "2024-01",
                salesAmount: 85000.00,
                orderCount: 210,
                avgOrderValue: 404.76,
                productViews: 1250,
                conversionRate: 3.2
            },
            {
                date: "2024-02",
                salesAmount: 92000.00,
                orderCount: 245,
                avgOrderValue: 375.51,
                productViews: 1380,
                conversionRate: 3.5
            },
            {
                date: "2024-03",
                salesAmount: 105000.00,
                orderCount: 280,
                avgOrderValue: 375.00,
                productViews: 1520,
                conversionRate: 3.7
            },
            {
                date: "2024-04",
                salesAmount: 98000.00,
                orderCount: 265,
                avgOrderValue: 369.81,
                productViews: 1450,
                conversionRate: 3.6
            },
            {
                date: "2024-05",
                salesAmount: 112000.00,
                orderCount: 295,
                avgOrderValue: 379.66,
                productViews: 1620,
                conversionRate: 3.6
            },
            {
                date: "2024-06",
                salesAmount: 125000.00,
                orderCount: 342,
                avgOrderValue: 365.50,
                productViews: 1780,
                conversionRate: 3.8
            }
        ],
        peakDay: "2024-06",
        peakSales: 125000.00,
        growthTrend: "up",
        seasonality: {
            peakSeason: ["11月", "12月"],
            lowSeason: ["2月", "3月"]
        }
    }
};

export const mockProductRankingData = {
    code: 20000,
    message: "success",
    data: {
        salesRanking: [
            {
                productId: "prod001",
                productName: "iPhone 15 Pro 256GB",
                salesAmount: 45000.00,
                salesCount: 45,
                ranking: 1
            },
            {
                productId: "prod002",
                productName: "MacBook Air M2",
                salesAmount: 32000.00,
                salesCount: 16,
                ranking: 2
            },
            {
                productId: "prod003",
                productName: "AirPods Pro 2代",
                salesAmount: 18000.00,
                salesCount: 60,
                ranking: 3
            },
            {
                productId: "prod004",
                productName: "iPad Air 5代",
                salesAmount: 15000.00,
                salesCount: 20,
                ranking: 4
            },
            {
                productId: "prod005",
                productName: "Apple Watch Series 9",
                salesAmount: 12000.00,
                salesCount: 30,
                ranking: 5
            }
        ],
        viewsRanking: [
            {
                productId: "prod001",
                productName: "iPhone 15 Pro 256GB",
                views: 1250,
                ranking: 1
            },
            {
                productId: "prod003",
                productName: "AirPods Pro 2代",
                views: 980,
                ranking: 2
            },
            {
                productId: "prod002",
                productName: "MacBook Air M2",
                views: 850,
                ranking: 3
            }
        ],
        conversionRanking: [
            {
                productId: "prod001",
                productName: "iPhone 15 Pro 256GB",
                conversionRate: 5.5,
                ranking: 1
            },
            {
                productId: "prod002",
                productName: "MacBook Air M2",
                conversionRate: 4.8,
                ranking: 2
            },
            {
                productId: "prod003",
                productName: "AirPods Pro 2代",
                conversionRate: 4.2,
                ranking: 3
            }
        ]
    }
};

export const mockFinanceData = {
    code: 20000,
    message: "success",
    data: {
        revenue: {
            total: 125000.00,
            monthlyAvg: 20833.33,
            growthRate: 12.5
        },
        costs: {
            productCost: 75000.00,
            operatingCost: 15000.00,
            total: 90000.00
        },
        profit: {
            grossProfit: 50000.00,
            netProfit: 35000.00,
            profitMargin: 28.0
        },
        monthlyData: [
            {
                month: "2024-01",
                revenue: 85000.00,
                cost: 65000.00,
                profit: 20000.00
            },
            {
                month: "2024-02",
                revenue: 92000.00,
                cost: 70000.00,
                profit: 22000.00
            },
            {
                month: "2024-03",
                revenue: 105000.00,
                cost: 75000.00,
                profit: 30000.00
            },
            {
                month: "2024-04",
                revenue: 98000.00,
                cost: 72000.00,
                profit: 26000.00
            },
            {
                month: "2024-05",
                revenue: 112000.00,
                cost: 80000.00,
                profit: 32000.00
            },
            {
                month: "2024-06",
                revenue: 125000.00,
                cost: 90000.00,
                profit: 35000.00
            }
        ]
    }
};