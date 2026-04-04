"use client";

import ReactECharts from "echarts-for-react";
import { DashboardModule } from "./dashboard-module";
import type { DashboardResponse } from "@/lib/types/stock";

export function MacdChartCard({ data }: { data: DashboardResponse }) {
  const dates = data.macdChart.series.map((point) => point.date);
  const macd = data.macdChart.series.map((point) => point.macd);
  const signal = data.macdChart.series.map((point) => point.signal);

  const bullishCrossovers = data.macdChart.crossovers.filter(
    (point) => point.type === "bullish",
  );

  const bearishCrossovers = data.macdChart.crossovers.filter(
    (point) => point.type === "bearish",
  );

  const option = {
    backgroundColor: "transparent",
    animation: true,
    grid: {
      top: 30,
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
        name: "Zero",
        type: "line",
        z: 1,
        data: dates.map(() => 0),
        symbol: "none",
        lineStyle: {
          width: 1,
          type: "dashed",
          color: "rgba(255,255,255,0.15)",
        },
        tooltip: {
          show: false,
        },
      },
      {
        name: "MACD",
        type: "line",
        z: 2,
        data: macd,
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 2.5,
          color: "#4DA3FF",
        },
        emphasis: {
          focus: "series",
        },
        areaStyle: {
          opacity: 0.08,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(77,163,255,0.30)" },
              { offset: 1, color: "rgba(77,163,255,0.00)" },
            ],
          },
        },
      },
      {
        name: "Signal",
        type: "line",
        z: 2,
        data: signal,
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 2,
          color: "#A78BFA",
          opacity: 0.9,
        },
        emphasis: {
          focus: "series",
        },
      },
      {
        name: "Bullish Cross",
        type: "scatter",
        z: 5,
        data: bullishCrossovers.map((point) => [point.date, point.macd]),
        symbol: "arrow",
        symbolSize: 16,
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
      },
      {
        name: "Bearish Cross",
        type: "scatter",
        z: 5,
        data: bearishCrossovers.map((point) => [point.date, point.macd]),
        symbol: "arrow",
        symbolRotate: 180,
        symbolSize: 16,
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
      },
    ],
  };

  return (
    <DashboardModule eyebrow="Momentum" title="MACD Chart">
      <div className="h-[320px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </DashboardModule>
  );
}