"use client";

import ReactECharts from "echarts-for-react";
import { DashboardModule } from "./dashboard-module";
import type { DashboardResponse } from "@/lib/types/stock";

export function PriceChartCard({ data }: { data: DashboardResponse }) {
  const dates = data.overallChart.priceSeries.map((point) => point.date);
  const prices = data.overallChart.priceSeries.map((point) => point.close);
  const movingAverage = data.overallChart.movingAverage30.map(
    (point) => point.value,
  );

  const bullishCrossovers = data.overallChart.crossovers.filter(
    (point) => point.type === "bullish",
  );

  const bearishCrossovers = data.overallChart.crossovers.filter(
    (point) => point.type === "bearish",
  );

  const option = {
    backgroundColor: "transparent",
    animation: true,
    grid: {
      top: 40,
      right: 24,
      bottom: 40,
      left: 24,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(16,20,25,0.96)",
      borderColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
      textStyle: {
        color: "#f5f7fa",
      },
    },
    legend: {
      top: 0,
      right: 0,
      textStyle: {
        color: "#a6adb7",
      },
    },
    xAxis: {
      type: "category",
      data: dates,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: "rgba(166,173,183,0.12)",
        },
      },
      axisLabel: {
        color: "#7d8590",
        hideOverlap: true,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLine: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "rgba(166,173,183,0.05)",
        },
      },
      axisLabel: {
        color: "#7d8590",
      },
    },
    series: [
      {
        name: "Close",
        type: "line",
        data: prices,
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 3,
          color: "#f5f7fa",
        },
        areaStyle: {
          opacity: 0.08,
        },
      },
      {
        name: "MA 30",
        type: "line",
        data: movingAverage,
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 2,
          color: "#0abc56",
        },
      },
      {
        name: "Bullish Cross",
        type: "scatter",
        data: bullishCrossovers.map((point) => [
          point.date,
          point.price,
          point.movingAverage,
          point.type,
        ]),
        symbol: "arrow",
        symbolSize: 18,
        symbolRotate: 0,
        itemStyle: {
          color: "#0abc56",
        },
        tooltip: {
          formatter: (params: any) => {
            const [, price, ma, type] = params.data;
            return `
              <div>
                <strong>${params.name}</strong><br/>
                Price: ${Number(price).toFixed(2)}<br/>
                MA: ${Number(ma).toFixed(2)}<br/>
                Type: ${type}
              </div>
            `;
          },
        },
      },
      {
        name: "Bearish Cross",
        type: "scatter",
        data: bearishCrossovers.map((point) => [
          point.date,
          point.price,
          point.movingAverage,
          point.type,
        ]),
        symbol: "arrow",
        symbolSize: 18,
        symbolRotate: 180,
        itemStyle: {
          color: "#ff8b7c",
        },
        tooltip: {
          formatter: (params: any) => {
            const [, price, ma, type] = params.data;
            return `
              <div>
                <strong>${params.name}</strong><br/>
                Price: ${Number(price).toFixed(2)}<br/>
                MA: ${Number(ma).toFixed(2)}<br/>
                Type: ${type}
              </div>
            `;
          },
        },
      },
      {
        name: "Floor",
        type: "line",
        data: dates.map(() => data.overallChart.floor),
        symbol: "none",
        lineStyle: {
          type: "dashed",
          width: 1.5,
          color: "rgba(255,255,255,0.22)",
        },
      },
      {
        name: "Ceiling",
        type: "line",
        data: dates.map(() => data.overallChart.ceiling),
        symbol: "none",
        lineStyle: {
          type: "dashed",
          width: 1.5,
          color: "rgba(255,255,255,0.22)",
        },
      },
    ],
  };

  return (
    <DashboardModule eyebrow="Trend" title="Overall Indicator Chart">
      <div className="h-[420px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </DashboardModule>
  );
}
