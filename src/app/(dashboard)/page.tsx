"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import {
  Users,
  UserPlus,
  Utensils,
  CalendarDays,
  AlertCircle,
  FileCheck2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dashboardService } from "@/services/dashboardService";
import type { IDashboardV2Overview } from "@/types/dashboard.type";

const GOAL_COLORS: Record<string, string> = {
  GOAL_LOSS: "#3B82F6",
  GOAL_GAIN: "#10B981",
  GOAL_MAINTAIN: "#F59E0B",
  GOAL_STRICT: "#8B5CF6",
};

export default function AdminDashboardV2() {
  const [data, setData] = useState<IDashboardV2Overview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardService.getOverview();
        if (response?.metadata?.EC === 0) {
          setData(response.data);
        } else {
          // fallback if wrapped with EC inside data
          const inner = response.data as any;
          if (inner?.EC === 0 && inner?.result) {
            setData(inner.result);
          } else {
            setData(response.data);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-red-500">
        <AlertCircle className="w-5 h-5 mr-2" />
        <p>{error || "Không có dữ liệu"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8 font-sans">
      <div className="space-y-6 max-w-[1400px] mx-auto">
        {/* ROW 1: KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border-l-4 border-l-blue-500 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full min-h-[9rem]">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 text-[13px] font-bold uppercase tracking-wider">
                Tổng User
              </p>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-blue-600 mb-1.5 break-all">
                {data.keyMetrics.totalUsers.value.toLocaleString()}
              </p>
              {data.keyMetrics.totalUsers.trendPercent !== null && (
                <p className={`text-[12px] font-bold inline-block px-2 py-0.5 rounded-full ${data.keyMetrics.totalUsers.trendPercent >= 0 ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
                  {data.keyMetrics.totalUsers.trendPercent > 0 ? "+" : ""}
                  {data.keyMetrics.totalUsers.trendPercent}% {data.keyMetrics.totalUsers.trendLabel}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white border-l-4 border-l-emerald-500 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full min-h-[9rem]">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 text-[13px] font-bold uppercase tracking-wider">
                User Mới (Hôm nay)
              </p>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <UserPlus className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-emerald-600 mb-1.5 break-all">
                {data.keyMetrics.newUsersToday.value.toLocaleString()}
              </p>
              {data.keyMetrics.newUsersToday.trendPercent !== null && (
                <p className={`text-[12px] font-bold inline-block px-2 py-0.5 rounded-full ${data.keyMetrics.newUsersToday.trendPercent >= 0 ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
                  {data.keyMetrics.newUsersToday.trendPercent > 0 ? "+" : ""}
                  {data.keyMetrics.newUsersToday.trendPercent}% {data.keyMetrics.newUsersToday.trendLabel}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white border-l-4 border-l-purple-500 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full min-h-[9rem]">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 text-[13px] font-bold uppercase tracking-wider">
                Tổng Món Ăn
              </p>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Utensils className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-purple-600 mb-1.5 break-all">
                {data.keyMetrics.totalFoods.value.toLocaleString()}
              </p>
              <p className="text-[12px] font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">
                +{data.keyMetrics.totalFoods.newContributions} {data.keyMetrics.totalFoods.trendLabel}
              </p>
            </div>
          </div>

          <div className="bg-white border-l-4 border-l-orange-500 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full min-h-[9rem]">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 text-[13px] font-bold uppercase tracking-wider">
                Lượt log bữa ăn
              </p>
              <div className="p-2 bg-orange-50 rounded-lg">
                <CalendarDays className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-orange-500 mb-1.5 break-all">
                {data.keyMetrics.totalMealLogs.value.toLocaleString()}
              </p>
              <p className="text-[12px] font-bold text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded-full">
                {data.keyMetrics.totalMealLogs.trendPercent !== null 
                  ? `${data.keyMetrics.totalMealLogs.trendPercent > 0 ? "+" : ""}${data.keyMetrics.totalMealLogs.trendPercent}% ` 
                  : ""}
                {data.keyMetrics.totalMealLogs.trendLabel}
              </p>
            </div>
          </div>
        </div>

        {/* ROW 2: Charts (Line: 8 cols, Pie: 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lượng User hoạt động 30 ngày qua */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm col-span-12 lg:col-span-8 flex flex-col min-h-[380px] h-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-slate-800 text-[15px] font-bold tracking-wider uppercase">
                  Lượng User hoạt động (30 ngày)
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Xu hướng tăng trưởng DAU liên tục duy trì sắc xanh.
                </p>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.trends.activeUsersLast30Days}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f1f5f9" }}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ color: "#0f172a", fontWeight: "bold" }}
                  />
                  <Bar
                    dataKey="users"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tỉ lệ mục tiêu */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm col-span-12 lg:col-span-4 min-h-[380px] h-full flex flex-col">
            <h2 className="text-slate-800 text-[15px] font-bold tracking-wider uppercase mb-1">
              Tỉ lệ mục tiêu người dùng
            </h2>
            <p className="text-sm text-slate-500 font-medium mb-4">
              Cán cân mục tiêu dinh dưỡng hiện tại
            </p>

            <div className="flex-1 flex flex-col items-center justify-center relative pt-2">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data.analytics.userGoalsBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="percentage"
                    nameKey="name"
                    stroke="none"
                  >
                    {data.analytics.userGoalsBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GOAL_COLORS[entry.goalType] || "#94A3B8"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ color: "#0f172a", fontWeight: "bold" }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend Text */}
              <div className="flex flex-col gap-3 w-full px-4 mt-6">
                {data.analytics.userGoalsBreakdown.map((item) => (
                  <div
                    key={item.goalType}
                    className="flex justify-between items-center text-[14px] font-semibold text-slate-700 pb-2 border-b border-slate-50 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center">
                      <span
                        className="w-3.5 h-3.5 rounded bg-shadow-sm mr-3"
                        style={{ backgroundColor: GOAL_COLORS[item.goalType] || "#94A3B8" }}
                      ></span>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-slate-800 font-extrabold">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Tables & Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Món Ăn Yêu Thích */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-slate-800 text-[15px] font-bold tracking-wider uppercase">
                🔥 Top món ăn phổ biến
              </h2>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-[13px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                    Xem toàn bộ
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Danh sách món ăn phổ biến nhất
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[65vh] w-full pr-4 mt-4">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b-2 border-slate-100 text-slate-500 text-sm">
                          <th className="pb-3 pt-2 font-semibold uppercase w-12 text-center">
                            #
                          </th>
                          <th className="pb-3 pt-2 font-semibold uppercase">
                            Tên món ăn
                          </th>
                          <th className="pb-3 pt-2 font-semibold uppercase text-right">
                            Lượt log
                          </th>
                          <th className="pb-3 pt-2 font-semibold uppercase text-center w-24">
                            Xu hướng
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.analytics.topFoods.map((food, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-slate-50 hover:bg-slate-50 transition-colors group"
                          >
                            <td className="py-4 text-center font-bold text-slate-400 group-hover:text-blue-500">
                              {food.rank}
                            </td>
                            <td className="py-4">
                              <p className="font-bold text-slate-800 text-[15px]">
                                {food.name}
                              </p>
                              <p className="text-xs text-slate-500 font-medium">
                                {food.calories ? `${food.calories} kcal` : "Chưa cập nhật"}
                              </p>
                            </td>
                            <td className="py-4 text-right font-extrabold text-slate-700">
                              {food.logCount.toLocaleString()} lần
                            </td>
                            <td className="py-4 text-center">
                              {food.trendPercent !== null ? (
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${food.trendPercent >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                                >
                                  {food.trendPercent > 0 ? "+" : ""}{food.trendPercent}%
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-slate-500 text-sm">
                    <th className="pb-3 font-semibold uppercase w-12 text-center">
                      #
                    </th>
                    <th className="pb-3 font-semibold uppercase">Tên món ăn</th>
                    <th className="pb-3 font-semibold uppercase text-right">
                      Lượt log
                    </th>
                    <th className="pb-3 font-semibold uppercase text-center w-24">
                      Xu hướng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.analytics.topFoods.slice(0, 5).map((food, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-50 hover:bg-slate-100 transition-colors group"
                    >
                      <td className="py-4 text-center font-bold text-slate-400 group-hover:text-blue-500">
                        {food.rank}
                      </td>
                      <td className="py-4">
                        <p className="font-bold text-slate-800 text-[15px]">
                          {food.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {food.calories ? `${food.calories} kcal` : "Chưa cập nhật"}
                        </p>
                      </td>
                      <td className="py-4 text-right font-extrabold text-slate-700">
                        {food.logCount.toLocaleString()}
                      </td>
                      <td className="py-4 text-center">
                        {food.trendPercent !== null ? (
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${food.trendPercent >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                          >
                            {food.trendPercent > 0 ? "+" : ""}{food.trendPercent}%
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Thông báo xử lý */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-slate-800 text-[15px] font-bold tracking-wider uppercase">
                Thông báo & Cần duyệt
              </h2>
              <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-[11px] font-extrabold">
                {data.management.totalAlerts} MỤC
              </span>
            </div>

            <div className="space-y-4">
              {data.management.alerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="mr-4 mt-0.5 shrink-0">
                    {alert.type === "pending" && (
                      <FileCheck2 className="w-5 h-5 text-amber-500" />
                    )}
                    {alert.type === "report" && (
                      <AlertCircle className="w-5 h-5 text-rose-500" />
                    )}
                    {alert.type === "missing" && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-[14px] font-semibold leading-tight mb-1.5 ${alert.type === "report" || alert.type === "missing" ? "text-rose-700" : "text-slate-700"}`}
                    >
                      {alert.text}
                    </p>
                    <p className="text-[12px] font-medium text-slate-400">
                      {alert.timeAgo}
                    </p>
                  </div>
                </div>
              ))}

              {data.management.alerts.length > 4 && (
                <div className="pt-1">
                  <button className="w-full py-2.5 text-[13px] font-bold text-blue-600 bg-blue-50/50 hover:bg-blue-100/50 border border-transparent hover:border-blue-200 rounded-xl transition-all">
                    Xem thêm +{data.management.totalAlerts - 4} thông báo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
