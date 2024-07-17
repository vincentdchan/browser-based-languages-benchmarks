import React, { useRef, useEffect } from "react";
import * as echarts from 'echarts';

/**
 * 
 * @param {*} props 
 * @returns React.Component
 */
function GameRunner(props) {
  const { data, rows } = props;
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data) {
      return;
    }
    const myChart = echarts.init(containerRef.current);

    const options = {
      xAxis: {
        max: 'dataMax'
      },
      yAxis: {
        type: 'category',
        data: rows,
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        max: 2 // only the largest 3 bars will be displayed
      },
      series: [
        {
          realtimeSort: true,
          name: 'X',
          type: 'bar',
          data,
          label: {
            show: true,
            position: 'right',
            valueAnimation: true
          }
        }
      ],
      legend: {
        show: true
      },
      animationDuration: 0,
      animationDurationUpdate: 3000,
      animationEasing: 'linear',
      animationEasingUpdate: 'linear'
    };

    myChart.setOption(options);
  }, [containerRef, data, rows]);

  return (
    <div className="game-runner" style={{ width: 960, height: 480 }}>
      {!data && (
        <div className="placeholder">
          Click "Run" button to start the benchmark
        </div>
      )}
      <div ref={containerRef}>

      </div>
    </div>
  )
}

export default GameRunner;
