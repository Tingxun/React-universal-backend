import * as echarts from 'echarts';
import '../../pages/home/home.css'
import { useEffect, useRef} from 'react';

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

function Echarts({style, chartData, isAxisChart = true}) {
    //console.log(chartData, isAxisChart);
    // 获取dom实例
    const echartRef = useRef();
    let echartObj = useRef(null);
    useEffect(() => {
        let option;
        // 初始化echarts
        echartObj.current = echarts.init(echartRef.current);
        // 设置option
        if (isAxisChart) {
            axisOption.xAxis.data = chartData.xAxis;
            axisOption.series = chartData.series;
            option = axisOption;
        }else {
            normalOption.series = chartData.series;
            option = normalOption;
        }
        echartObj.current.setOption(option);    
    }, [chartData, isAxisChart]);
    return (
        <div style={style} ref={echartRef}>
        </div>
    );
}

export default Echarts;