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
    grid: {
      top: 30,
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
        name: "MACD",
        type: "line",
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
              { offset: 0, color: "#4DA3FF" },
              { offset: 1, color: "transparent" },
            ],
          },
        },
      },
      {
        name: "Signal",
        type: "line",
        data: signal,
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 2,
          color: "#A78BFA",
          opacity: 0.85,
        },
      },
      {
        name: "Bullish Cross",
        type: "scatter",
        data: bullishCrossovers.map((point) => [point.date, point.macd]),
        symbol: "arrow",
        symbolSize: 14,
        itemStyle: {
          color: "#22c55e",
          shadowBlur: 10,
          shadowColor: "rgba(34,197,94,0.5)",
        },
      },
      {
        name: "Bearish Cross",
        type: "scatter",
        data: bearishCrossovers.map((point) => [point.date, point.macd]),
        symbol: "arrow",
        symbolRotate: 180,
        symbolSize: 14,
        itemStyle: {
          color: "#f87171",
          shadowBlur: 10,
          shadowColor: "rgba(248,113,113,0.5)",
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
