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
    animation: true,
    grid: {
      top: 36,
      right: 24,
      bottom: 40,
      left: 24,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "rgba(255,255,255,0.14)",
        },
        lineStyle: {
          color: "rgba(255,255,255,0.14)",
          width: 1,
        },
      },
      backgroundColor: "rgba(16,20,25,0.96)",
      borderColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
      textStyle: {
        color: "#E8EDF5",
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
        fontSize: 12,
      },
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLine: {
        lineStyle: {
          color: "rgba(166,173,183,0.10)",
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
      splitNumber: 4,
      splitLine: {
        lineStyle: {
          color: "rgba(166,173,183,0.05)",
        },
      },
      axisLine: {
        show: false,
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
        itemStyle: {
          color: "rgba(120, 160, 210, 0.38)",
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: "rgba(145, 190, 245, 0.55)",
          },
        },
      },
      {
        name: "Volume MA 30",
        type: "line",
        data: volumeMa30,
        smooth: true,
        symbol: "none",
        z: 3,
        lineStyle: {
          width: 2.5,
          color: "#F6C177",
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
              { offset: 0, color: "rgba(246, 193, 119, 0.20)" },
              { offset: 1, color: "rgba(246, 193, 119, 0.00)" },
            ],
          },
        },
        emphasis: {
          focus: "series",
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
