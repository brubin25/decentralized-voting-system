import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';

const PieChart = ({data}) => {
  console.log('pichat:',data)
  const [chartData, setChartData] = useState(data);
  const [options, setOptions] = useState({
    data: chartData,
    angleField: 'voteCount',
    colorField: 'name',
    autoFit: true,
    label: {
      text: 'name',
      position: 'inside',
    },
    legend: false,
  });

  useEffect(() => {
    console.log('data updated：',data)
    setChartData(data);
    setOptions(prevOptions => ({ ...prevOptions, data: data }));
  }, [data]);

  if(options.data && options.data.length>0){
    console.log('Render data chart：',options.data)
    return <Pie {...options} />;
  } else {
    return <></>
  }
};

export default PieChart;
