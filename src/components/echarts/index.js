import * as echarts from 'echarts';
import '../../pages/home/home.css'
import { useEffect, useRef, useState, useCallback} from 'react';

// echarts的配置数据
const axisOption = {
    textStyle: {
        color: '#333',
    },
    tooltip: {
        trigger: 'axis',
    },
    title: {
        text: null,
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLine: {
            lineStyle: {
                color: '#17b3a3',
            },
        },
        axisLabel: {
            interval: 0,
            color: '#333',
        },
    },
    yAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: '#17b3a3',
            },
        },
    },
    color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
    series: [],
}

const normalOption = {
    tooltip: {
        trigger: 'item',
    },
    title: {
        text: null,
    },
    color: ['#0f78f4', '#dd536b', '#9462e5', '#a6a6a6', '#e1bbz2', '#39c362', '#3ed1cf'],
    series: [{
        radius:'50%',
        emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }],
}

function Echarts({style, chartData, isAxisChart = true, chartType = 'bar'}) {
    //console.log(chartData, isAxisChart);
    // 获取dom实例
    const echartRef = useRef();
    let echartObj = useRef(null);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // 防抖函数
    const debounce = useCallback((func, wait) => {
        let timeout;
        const executedFunction = (...args) => {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
        
        // 添加取消方法
        executedFunction.cancel = () => {
            clearTimeout(timeout);
        };
        
        return executedFunction;
    }, []);

    // 窗口大小变化处理
    const handleResize = useCallback(debounce(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }, 250), [debounce]);

    // 监听窗口大小变化
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            // 清理防抖定时器
            handleResize.cancel && handleResize.cancel();
        };
    }, [handleResize]);

    // 图表初始化和更新
    useEffect(() => {
        let option;
        // 初始化或重新初始化echarts
        if (!echartObj.current) {
            echartObj.current = echarts.init(echartRef.current);
        }
        
        // 设置option
        if (isAxisChart) {
            const axisOption = {
                textStyle: {
                    color: '#333',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params) {
                        let result = params[0].name + '<br/>';
                        params.forEach(item => {
                            result += `${item.marker} ${item.seriesName}: ¥${item.value.toLocaleString()}<br/>`;
                        });
                        return result;
                    }
                },
                legend: {
                    data: chartData.series?.map(item => item.name) || [],
                    textStyle: {
                        color: '#333'
                    }
                },
                grid: {
                    left: '1%',
                    right: '1%',
                    bottom: chartType === 'bar' ? '15%' : '3%',
                    top: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: chartData.xAxis || [],
                    axisLine: {
                        lineStyle: {
                            color: '#d9d9d9',
                        },
                    },
                    axisTick: {
                        alignWithLabel: true,
                        lineStyle: {
                            color: '#d9d9d9'
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        color: '#595959',
                        rotate: chartType === 'bar' ? 45 : 0,
                        fontSize: 12
                    },
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#d9d9d9',
                        },
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#d9d9d9'
                        }
                    },
                    axisLabel: {
                        color: '#595959',
                        fontSize: 12,
                        formatter: function(value) {
                            if (value >= 10000) {
                                return '¥' + (value / 10000).toFixed(1) + '万';
                            }
                            return '¥' + value.toLocaleString();
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f0f0f0',
                            type: 'dashed'
                        }
                    }
                },
                color: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#fa541c', '#13c2c2', '#eb2f96', '#f759ab', '#9254de'],
                series: (chartData.series || []).map(seriesItem => ({
                    ...seriesItem,
                    barWidth: chartType === 'bar' ? '60%' : undefined,
                    itemStyle: {
                        borderRadius: chartType === 'bar' ? [2, 2, 0, 0] : undefined,
                        borderWidth: chartType === 'bar' ? 0 : undefined
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }))
            };
            option = axisOption;
        } else {
            normalOption.series = chartData.series;
            option = normalOption;
        }
        echartObj.current.setOption(option);
        
        // 图表重绘
        echartObj.current.resize();
    }, [chartData, isAxisChart, chartType, windowSize]);
    return (
        <div style={style} ref={echartRef}>
        </div>
    );
}

export default Echarts;