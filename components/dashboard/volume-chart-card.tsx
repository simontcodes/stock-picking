"use client";

import ReactECharts from "echarts-for-react";
import { DashboardModule } from "./dashboard-module";
import type { DashboardResponse } from "@/lib/types/stock";

export function VolumeChartCard({ data }: { data: DashboardResponse }) {
  const dates = data.overallChart.priceSeries.map((point) => point.date);
  const volumes = data.overallChart.priceSeries.map(
    (point) => point.volume ?? 0,
  );

  const volumeMa30 = data.overallChart.priceSeries.map((_, index, series) => {
    if (index < 29) return null;
    const window = series.slice(index - 29, index + 1);
    const avg =
      window.reduce((sum, point) => sum + (point.volume ?? 0), 0) / 30;
    return avg;
  });

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
        name: "Volume",
        type: "bar",
        data: volumes,
        barMaxWidth: 10,
      },
      {
        name: "Volume MA 30",
        type: "line",
        data: volumeMa30,
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 2,
          color: "#0abc56",
        },
      },
    ],
  };

  return (
    <DashboardModule eyebrow="Activity" title="Volume Chart">
      <div className="h-[320px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </DashboardModule>
  );
}
