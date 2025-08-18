import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';

const PieChart = ({data}) => {
  console.log('pichat:',data)
  const [chartData, setChartData] = useState(data);
  const [options, setOptions] = useState({
    data: chartData,
    // xField: 'category',
    // yField: 'value',
    // seriesField: 'type',
    angleField: 'voteCount',
    colorField: 'name',
    autoFit: true,
    label: {
      text: 'name',
      position: 'outside',
    },
    legend: false,
    // data: [
    //   {
    //     "name": "a",
    //     "voteCount": 1,
    //   },
    //   {
    //     "name": "b",
    //     "voteCount": 2,
    //   }
    // ]


  });

  useEffect(() => {
    console.log('data 更新了：',data)
    setChartData(data);
    setOptions(prevOptions => ({ ...prevOptions, data: data }));
  }, [data]);

  if(options.data && options.data.length>0){
    console.log('渲染数据图：',options.data)
    return <Pie {...options} />;
  } else {
    return <></>
  }
};

export default PieChart;