"use client";

import React from "react";
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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- DỮ LIỆU TĨNH ---
const lineChartData = [
  { day: "01/04", users: 120 },
  { day: "03/04", users: 132 },
  { day: "05/04", users: 101 },
  { day: "07/04", users: 145 },
  { day: "09/04", users: 190 },
  { day: "11/04", users: 210 },
  { day: "13/04", users: 215 },
  { day: "15/04", users: 230 },
  { day: "17/04", users: 290 },
  { day: "19/04", users: 310 },
  { day: "21/04", users: 280 },
  { day: "23/04", users: 380 },
  { day: "25/04", users: 410 },
  { day: "27/04", users: 450 },
  { day: "29/04", users: 520 },
];

const pieData = [
  { name: "Giảm cân", value: 45, color: "#3B82F6" },
  { name: "Tăng cơ", value: 30, color: "#10B981" },
  { name: "Duy trì", value: 25, color: "#F59E0B" },
];

const top20Foods = [
  {
    rank: 1,
    name: "Phở bò",
    calories: "523 kcal",
    count: "4,210 lần",
    trend: "+12%",
  },
  {
    rank: 2,
    name: "Cơm tấm sườn",
    calories: "680 kcal",
    count: "3,870 lần",
    trend: "+8%",
  },
  {
    rank: 3,
    name: "Bánh mì thịt",
    calories: "420 kcal",
    count: "3,540 lần",
    trend: "+5%",
  },
  {
    rank: 4,
    name: "Bún bò Huế",
    calories: "590 kcal",
    count: "2,910 lần",
    trend: "-2%",
  },
  {
    rank: 5,
    name: "Salad ức gà",
    calories: "310 kcal",
    count: "2,640 lần",
    trend: "+15%",
  },
  {
    rank: 6,
    name: "Gỏi cuốn",
    calories: "250 kcal",
    count: "2,500 lần",
    trend: "+3%",
  },
  {
    rank: 7,
    name: "Hủ tiếu Nam Vang",
    calories: "550 kcal",
    count: "2,100 lần",
    trend: "+1%",
  },
  {
    rank: 8,
    name: "Bò kho",
    calories: "480 kcal",
    count: "1,980 lần",
    trend: "-4%",
  },
  {
    rank: 9,
    name: "Cơm chiên Dương Châu",
    calories: "750 kcal",
    count: "1,850 lần",
    trend: "-1%",
  },
  {
    rank: 10,
    name: "Gà rán",
    calories: "650 kcal",
    count: "1,720 lần",
    trend: "+20%",
  },
  {
    rank: 11,
    name: "Bánh xèo",
    calories: "400 kcal",
    count: "1,600 lần",
    trend: "+5%",
  },
  {
    rank: 12,
    name: "Bún chả Hà Nội",
    calories: "580 kcal",
    count: "1,550 lần",
    trend: "+4%",
  },
  {
    rank: 13,
    name: "Bún đậu mắm tôm",
    calories: "600 kcal",
    count: "1,500 lần",
    trend: "-2%",
  },
  {
    rank: 14,
    name: "Mì Quảng",
    calories: "540 kcal",
    count: "1,450 lần",
    trend: "+6%",
  },
  {
    rank: 15,
    name: "Sườn nướng",
    calories: "450 kcal",
    count: "1,400 lần",
    trend: "+2%",
  },
  {
    rank: 16,
    name: "Cá kho tộ",
    calories: "350 kcal",
    count: "1,350 lần",
    trend: "-1%",
  },
  {
    rank: 17,
    name: "Canh chua cá lóc",
    calories: "220 kcal",
    count: "1,300 lần",
    trend: "+8%",
  },
  {
    rank: 18,
    name: "Nem chua",
    calories: "150 kcal",
    count: "1,250 lần",
    trend: "-3%",
  },
  {
    rank: 19,
    name: "Chả giò",
    calories: "300 kcal",
    count: "1,200 lần",
    trend: "+7%",
  },
  {
    rank: 20,
    name: "Bánh bao",
    calories: "280 kcal",
    count: "1,150 lần",
    trend: "+1%",
  },
];

const alertsList = [
  {
    id: 1,
    type: "pending",
    text: 'Món "Gà ủ muối" chờ duyệt thông tin.',
    time: "15 phút trước",
  },
  {
    id: 2,
    type: "report",
    text: 'Báo cáo: Lượng Calo của "Bún riêu" sai lệch.',
    time: "1 giờ trước",
  },
  {
    id: 3,
    type: "missing",
    text: "Thiếu vi chất: 12 món ăn phổ biến chưa có Vitamin.",
    time: "3 giờ trước",
  },
  {
    id: 4,
    type: "pending",
    text: 'Món "Nước ép cần tây" chờ duyệt thông tin.',
    time: "Hôm qua",
  },
  {
    id: 5,
    type: "report",
    text: 'Báo cáo: Hình ảnh "Xôi mặn" không phù hợp.',
    time: "Hôm qua",
  },
];

export default function AdminDashboardStatic() {
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
                14,285
              </p>
              <p className="text-[12px] font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">
                +4.2% so với tháng trước
              </p>
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
                238
              </p>
              <p className="text-[12px] font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">
                +12% so với hôm qua
              </p>
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
                2,410
              </p>
              <p className="text-[12px] font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">
                +45 món đóng góp mới
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
                68,904
              </p>
              <p className="text-[12px] font-bold text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded-full">
                Độ tương tác tháng này
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
                  data={lineChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="day"
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
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
                {pieData.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center text-[14px] font-semibold text-slate-700 pb-2 border-b border-slate-50 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center">
                      <span
                        className="w-3.5 h-3.5 rounded bg-shadow-sm mr-3"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-slate-800 font-extrabold">
                      {item.value}%
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
                        {top20Foods.map((food, idx) => (
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
                                {food.calories}
                              </p>
                            </td>
                            <td className="py-4 text-right font-extrabold text-slate-700">
                              {food.count}
                            </td>
                            <td className="py-4 text-center">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${food.trend.startsWith("+") ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                              >
                                {food.trend}
                              </span>
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
                  {top20Foods.slice(0, 5).map((food, idx) => (
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
                          {food.calories}
                        </p>
                      </td>
                      <td className="py-4 text-right font-extrabold text-slate-700">
                        {food.count}
                      </td>
                      <td className="py-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${food.trend.startsWith("+") ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                        >
                          {food.trend}
                        </span>
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
                5 MỤC
              </span>
            </div>

            <div className="space-y-4">
              {alertsList.slice(0, 4).map((alert) => (
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
                      <AlertCircle className="w-5 h-5 text-purple-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-[14px] font-semibold leading-tight mb-1.5 ${alert.type === "report" ? "text-rose-700" : "text-slate-700"}`}
                    >
                      {alert.text}
                    </p>
                    <p className="text-[12px] font-medium text-slate-400">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}

              {alertsList.length > 4 && (
                <div className="pt-1">
                  <button className="w-full py-2.5 text-[13px] font-bold text-blue-600 bg-blue-50/50 hover:bg-blue-100/50 border border-transparent hover:border-blue-200 rounded-xl transition-all">
                    Xem thêm +{alertsList.length - 4} thông báo
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
