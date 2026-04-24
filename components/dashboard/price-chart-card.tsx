"use client";

import ReactECharts from "echarts-for-react";
import { DashboardModule } from "./dashboard-module";
import type { DashboardResponse } from "@/lib/types/stock";

type CrossoverTooltipParams = {
  name: string;
  data: [string, number, number, string];
};

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
      axisPointer: {
        type: "cross",
        lineStyle: {
          color: "rgba(255,255,255,0.18)",
          width: 1,
        },
        crossStyle: {
          color: "rgba(255,255,255,0.18)",
        },
      },
      backgroundColor: "rgba(16,20,25,0.96)",
      borderColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
      textStyle: {
        color: "#f5f7fa",
      },
      extraCssText:
        "backdrop-filter: blur(10px); border-radius: 12px; padding: 10px 12px;",
    },
    legend: {
      top: 0,
      right: 0,
      icon: "circle",
      itemWidth: 10,
      itemHeight: 10,
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
      splitLine: {
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
        name: "Floor",
        type: "line",
        z: 1,
        data: dates.map(() => data.overallChart.floor),
        symbol: "none",
        lineStyle: {
          type: "dashed",
          width: 1.2,
          color: "rgba(255,255,255,0.14)",
        },
        tooltip: {
          show: false,
        },
      },
      {
        name: "Ceiling",
        type: "line",
        z: 1,
        data: dates.map(() => data.overallChart.ceiling),
        symbol: "none",
        lineStyle: {
          type: "dashed",
          width: 1.4,
          color: "rgba(255,255,255,0.18)",
        },
        tooltip: {
          show: false,
        },
      },
      {
        name: "Close",
        type: "line",
        z: 2,
        data: prices,
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 3,
          color: "#E6EDF3",
        },
        areaStyle: {
          opacity: 0.06,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(230,237,243,0.22)" },
              { offset: 1, color: "rgba(230,237,243,0.00)" },
            ],
          },
        },
        emphasis: {
          focus: "series",
        },
      },
      {
        name: "MA 30",
        type: "line",
        z: 2,
        data: movingAverage,
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 2.2,
          color: "#60A5FA",
        },
        areaStyle: {
          opacity: 0.04,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(96,165,250,0.18)" },
              { offset: 1, color: "rgba(96,165,250,0.00)" },
            ],
          },
        },
        emphasis: {
          focus: "series",
        },
      },
      {
        name: "Bullish Cross",
        type: "scatter",
        z: 5,
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
          color: "#22c55e",
          borderColor: "#0b0f14",
          borderWidth: 1.5,
          shadowBlur: 12,
          shadowColor: "rgba(34,197,94,0.6)",
        },
        emphasis: {
          scale: 1.15,
        },
        tooltip: {
          formatter: (params: CrossoverTooltipParams) => {
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
        z: 5,
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
          color: "#f87171",
          borderColor: "#0b0f14",
          borderWidth: 1.5,
          shadowBlur: 12,
          shadowColor: "rgba(248,113,113,0.6)",
        },
        emphasis: {
          scale: 1.15,
        },
        tooltip: {
          formatter: (params: CrossoverTooltipParams) => {
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
