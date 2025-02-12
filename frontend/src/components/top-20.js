"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const generateTimeSeriesData = (length = 30, baseValue = 500, trend = "up") => {
  let value = baseValue;
  let trendFactor = trend === "up" ? 1.02 : trend === "down" ? 0.98 : 1;

  return Array.from({ length }, (_, i) => {
    const change = (Math.random() - 0.5) * baseValue * 0.2;
    value = Math.max(50, (value + change) * trendFactor);
    return {
      date: new Date(2024, i % 12, 1).toLocaleString("default", {
        month: "short",
      }),
      value: Math.round(value),
      total: baseValue * length * (i / length),
    };
  });
};

const Top20Grid = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("30D");

  const users = [
    {
      name: "vitalik.eth",
      percentage: "1.64%",
      baseValue: 1000,
      trend: "up",
      gridSpan: "col-span-2 row-span-2",
      crown: true,
      totalValue: "2.4M",
    },
    {
      name: "aixbt",
      percentage: "1.54%",
      baseValue: 800,
      trend: "up",
      gridSpan: "col-span-1 row-span-2",
      crown: true,
      totalValue: "1.8M",
    },
    {
      name: "mert | heli..",
      percentage: "0.93%",
      baseValue: 600,
      trend: "down",
      gridSpan: "col-span-1 row-span-1",
      crown: true,
      totalValue: "982K",
    },
    {
      name: "mert | heli..",
      percentage: "0.93%",
      baseValue: 600,
      trend: "down",
      gridSpan: "col-span-1 row-span-1",
      crown: true,
      totalValue: "982K",
    },
    {
      name: "mert | heli..",
      percentage: "0.93%",
      baseValue: 600,
      trend: "down",
      gridSpan: "col-span-1 row-span-1",
      crown: true,
      totalValue: "982K",
    },
    {
      name: "mert | heli..",
      percentage: "0.93%",
      baseValue: 600,
      trend: "down",
      gridSpan: "col-span-1 row-span-1",
      crown: true,
      totalValue: "982K",
    },
    {
      name: "mert | heli..",
      percentage: "0.93%",
      baseValue: 600,
      trend: "down",
      gridSpan: "col-span-1 row-span-1",
      crown: true,
      totalValue: "982K",
    },
    {
      name: "mert | heli..",
      percentage: "0.93%",
      baseValue: 600,
      trend: "down",
      gridSpan: "col-span-1 row-span-1",
      crown: true,
      totalValue: "982K",
    },
    {
      name: "mert | heli..",
      percentage: "0.93%",
      baseValue: 600,
      trend: "down",
      gridSpan: "col-span-1 row-span-1",
      crown: true,
      totalValue: "982K",
    },
    {
      name: "mert | heli..",
      percentage: "0.93%",
      baseValue: 600,
      trend: "down",
      gridSpan: "col-span-1 row-span-1",
      crown: true,
      totalValue: "982K",
    },
    {
      name: "mert | heli..",
      percentage: "0.93%",
      baseValue: 600,
      trend: "down",
      gridSpan: "col-span-1 row-span-1",
      crown: true,
      totalValue: "982K",
    },
    {
      name: "mert | heli..",
      percentage: "0.93%",
      baseValue: 600,
      trend: "down",
      gridSpan: "col-span-1 row-span-1",
      crown: true,
      totalValue: "982K",
    },
    // ... add more users with their specific data
  ].map((user) => ({
    ...user,
    data: generateTimeSeriesData(30, user.baseValue, user.trend),
    chartConfig: {
      value: {
        label: "Value",
        color: "hsl(var(--primary))",
      },
    },
    growth: Math.floor(Math.random() * 15 + 5),
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-bold">Top20</h2>
        <div className="flex gap-2">
          {["7D", "30D", "3M", "6M", "12M"].map((timeframe) => (
            <Button
              key={timeframe}
              variant="ghost"
              className={`px-3 py-1 ${
                activeTimeframe === timeframe
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => setActiveTimeframe(timeframe)}
            >
              {timeframe}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 ">
        <div className="grid grid-cols-3 auto-rows-fr gap-4 h-full">
          {users.map((user, index) => (
            <Card
              key={user.name}
              className={`${user.gridSpan} flex flex-col h-full overflow-hidden`}
            >
              <CardHeader className="flex-none flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    {user.name}
                    {user.crown && (
                      <Crown className="w-4 h-4 text-yellow-400" />
                    )}
                  </CardTitle>
                  <div className="text-sm font-medium text-muted-foreground">
                    Total: {user.totalValue}
                  </div>
                </div>
                <div className="text-sm font-medium">{user.percentage}</div>
              </CardHeader>
              <CardContent className="flex-auto relative overflow-hidden min-h-0">
                <div className="h-full absolute bottom-0 inset-0">
                  <ChartContainer config={user.chartConfig} className="h-full w-full">
                    <AreaChart
                      data={user.data}
                      width="100%"
                      height="100%"
                      margin={{
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        vertical={false}
                        strokeOpacity={0.2}
                        className="stroke-border"
                      />
                      <XAxis
                        hide={true}
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                        className="fill-muted-foreground text-xs"
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                        strokeWidth={1.5}
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Top20Grid;
