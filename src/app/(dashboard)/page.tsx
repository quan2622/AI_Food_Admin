"use client";

import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

// --- DỮ LIỆU TĨNH ---
const lineChartData = [
  { day: "T2", users: 3700 },
  { day: "T3", users: 3850 },
  { day: "T4", users: 3600 },
  { day: "T5", users: 4000 },
  { day: "T6", users: 3950 },
  { day: "T7", users: 3800 },
  { day: "CN", users: 4127 },
];

const pieData = [
  { name: "Giảm cân", value: 42, color: "#3B82F6" }, 
  { name: "Tăng cơ", value: 28, color: "#10B981" },  
  { name: "Cân bằng", value: 18, color: "#F59E0B" }, 
  { name: "Tăng cân", value: 12, color: "#EC4899" }, 
];

const alertsData = [
  { id: 1, color: "bg-red-500", text: 'Món ăn "Phở bò đặc biệt" bị báo cáo dữ liệu dinh dưỡng sai', time: "12 phút trước" },
  { id: 2, color: "bg-orange-500", text: 'Lượng ghi nhận calo của 342 user vượt ngưỡng bất thường', time: "2 giờ trước" },
  { id: 3, color: "bg-amber-500", text: 'Danh mục "Đồ uống" thiếu 48 mục dữ liệu dinh dưỡng', time: "5 giờ trước" },
  { id: 4, color: "bg-emerald-500", text: 'Cơ sở dữ liệu thực phẩm cập nhật thành công (v4.1.2)', time: "Hôm qua" },
];

const nutritionProgress = [
  { label: "Calo", current: "1,840", max: "2,000", unit: "kcal", percent: 92, bg: "bg-blue-500", track: "bg-blue-100", textCol: "text-blue-600" },
  { label: "Protein", current: "68", max: "80", unit: "g", percent: 85, bg: "bg-emerald-500", track: "bg-emerald-100", textCol: "text-emerald-600" },
  { label: "Tinh bột", current: "240", max: "250", unit: "g", percent: 96, bg: "bg-orange-500", track: "bg-orange-100", textCol: "text-orange-600" },
  { label: "Chất béo", current: "55", max: "65", unit: "g", percent: 84, bg: "bg-rose-500", track: "bg-rose-100", textCol: "text-rose-600" },
  { label: "Chất xơ", current: "18", max: "30", unit: "g", percent: 60, bg: "bg-purple-500", track: "bg-purple-100", textCol: "text-purple-600" },
];

const topFoods = [
  { name: "Phở bò", sub: "Sáng • 523 kcal", count: "4,210 lần" },
  { name: "Cơm tấm sườn", sub: "Trưa • 680 kcal", count: "3,870 lần" },
  { name: "Bánh mì thịt", sub: "Sáng • 420 kcal", count: "3,540 lần" },
  { name: "Bún bò Huế", sub: "Trưa • 590 kcal", count: "2,910 lần" },
  { name: "Salad ức gà", sub: "Tối • 310 kcal", count: "2,640 lần" },
];

const recentUsers = [
  { name: "Nguyễn Thị Lan", sub: "lan.nguyen@gmail.com • Mục tiêu: Giảm cân", badge: "Mới", badgeClasses: "bg-emerald-100 text-emerald-700" },
  { name: "Trần Minh Đức", sub: "duc.tran@gmail.com • Mục tiêu: Tăng cơ", badge: "Mới", badgeClasses: "bg-emerald-100 text-emerald-700" },
  { name: "Lê Hoàng Phúc", sub: "phuc.le@gmail.com • Mục tiêu: Cân bằng", badge: "Premium", badgeClasses: "bg-blue-100 text-blue-700" },
  { name: "Phạm Thu Hà", sub: "ha.pham@gmail.com • Mục tiêu: Giảm cân", badge: "Chưa xác minh", badgeClasses: "bg-amber-100 text-amber-700" },
];

export default function AdminDashboardStatic() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b pb-4 border-slate-200">
        <h1 className="text-2xl font-semibold text-slate-800 tracking-wide">
          Dashboard quản trị <span className="text-slate-400 font-light">— NutriTrack</span>
        </h1>
        <p className="text-sm text-slate-500 mt-2 sm:mt-0 font-medium">Hôm nay: <span className="text-blue-600 font-bold">09/04/2026</span></p>
      </div>

      <div className="space-y-6 max-w-[1400px] mx-auto">
        
        {/* KPI Row (4 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-36">
            <p className="text-slate-500 text-[13px] font-bold uppercase tracking-wider">Tổng người dùng</p>
            <div>
              <p className="text-4xl font-extrabold text-blue-600 mb-1">12,480</p>
              <p className="text-xs font-semibold text-emerald-500 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">+3.2% so tháng trước</p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-36">
            <p className="text-slate-500 text-[13px] font-bold uppercase tracking-wider">Hoạt động hôm nay</p>
            <div>
              <p className="text-4xl font-extrabold text-emerald-500 mb-1">4,127</p>
              <p className="text-xs font-semibold text-emerald-500 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">+8% so hôm qua</p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-36">
            <p className="text-slate-500 text-[13px] font-bold uppercase tracking-wider">Bữa ăn ghi nhận</p>
            <div>
              <p className="text-4xl font-extrabold text-orange-500 mb-1">18,904</p>
              <p className="text-xs font-semibold text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded-full">Trong 7 ngày qua</p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-36">
            <p className="text-slate-500 text-[13px] font-bold uppercase tracking-wider">Người dùng mới</p>
            <div>
              <p className="text-4xl font-extrabold text-purple-600 mb-1">238</p>
              <p className="text-xs font-semibold text-rose-500 bg-rose-50 inline-block px-2 py-0.5 rounded-full">-5% so tuần trước</p>
            </div>
          </div>
        </div>

        {/* Row 2: Chart & Alerts (approx 55% / 45%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Line Chart */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow col-span-12 lg:col-span-7 flex flex-col h-[350px]">
            <h2 className="text-slate-800 text-[14px] font-bold tracking-wider uppercase mb-6">Người dùng hoạt động (7 ngày)</h2>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                    domain={[3600, 4200]}
                    ticks={[3600, 3700, 3800, 3900, 4000, 4100, 4200]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    itemStyle={{ color: "#0f172a", fontWeight: "bold" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3B82F6" 
                    strokeWidth={4}
                    dot={{ fill: "#ffffff", r: 5, strokeWidth: 3, stroke: "#3B82F6" }}
                    activeDot={{ r: 7, fill: "#2563EB", stroke: "#bfdbfe", strokeWidth: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow col-span-12 lg:col-span-5 h-[350px] flex flex-col">
            <h2 className="text-slate-800 text-[14px] font-bold tracking-wider uppercase mb-4 flex items-center justify-between">
              Cảnh báo hệ thống
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-extrabold">{alertsData.length} MỚI</span>
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-0 relative">
              {alertsData.map((alert, idx) => (
                <div key={alert.id} className={`py-3.5 flex items-start ${idx !== alertsData.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 mr-3 shrink-0 shadow-sm ${alert.color}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700 leading-snug mb-1">{alert.text}</p>
                    <p className="text-[11px] font-medium text-slate-400">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Nutrition / Top Foods / Goals (3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Nutrition Avg */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-[340px] flex flex-col">
            <h2 className="text-slate-800 text-[14px] font-bold tracking-wider uppercase mb-5 leading-relaxed">
              Dinh dưỡng TB / Ngày
            </h2>
            <div className="space-y-4 flex-1 flex flex-col justify-end pb-2">
              {nutritionProgress.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[13px] mb-1.5 font-bold">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-slate-400">
                      <span className={`${item.textCol} text-[15px] mr-1 inline-block`}>{item.current}</span>
                      / {item.max} {item.unit}
                    </span>
                  </div>
                  <div className={`h-2.5 w-full rounded-full ${item.track} overflow-hidden`}>
                    <div className={`h-full rounded-full ${item.bg} relative`} style={{ width: `${item.percent}%` }}>
                       <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Foods */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-[340px] flex flex-col">
            <h2 className="text-slate-800 text-[14px] font-bold tracking-wider uppercase mb-4">Top món phổ biến</h2>
            <div className="flex-1 flex flex-col gap-0 justify-between pb-1">
              {topFoods.map((food, idx) => (
                <div key={idx} className={`flex items-center justify-between pb-2 ${idx !== topFoods.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div>
                    <p className="text-[14px] text-slate-800 font-bold mb-0.5">{food.name}</p>
                    <p className="text-[11px] font-medium text-slate-400">{food.sub}</p>
                  </div>
                  <div className="bg-sky-50 text-sky-600 px-3 py-1 rounded-full text-[12px] font-extrabold tracking-wide border border-sky-100 shadow-sm">
                    {food.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-[340px] flex flex-col">
             <h2 className="text-slate-800 text-[14px] font-bold tracking-wider uppercase mb-2">Mục tiêu dinh dưỡng</h2>
             <div className="flex-1 flex flex-col items-center relative min-h-0 pt-2">
               <ResponsiveContainer width="100%" height={170}>
                 <PieChart>
                   <Pie
                     data={pieData}
                     cx="50%"
                     cy="50%"
                     innerRadius={55}
                     outerRadius={80}
                     paddingAngle={3}
                     dataKey="value"
                     stroke="none"
                   >
                     {pieData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                     itemStyle={{ color: "#0f172a", fontWeight: "bold" }}
                   />
                 </PieChart>
               </ResponsiveContainer>
               
               {/* Legend Grid */}
               <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full px-2 mt-5">
                 {pieData.map(item => (
                   <div key={item.name} className="flex items-center text-[12px] font-semibold text-slate-500">
                     <span className="w-3 h-3 rounded-full mr-2 shrink-0 shadow-sm" style={{ backgroundColor: item.color }}></span>
                     <span className="truncate">{item.name} <span className="text-slate-800 ml-1 font-extrabold">{item.value}%</span></span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>

        {/* Row 4: Recent Users & Data Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Users */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-slate-800 text-[14px] font-bold tracking-wider uppercase mb-5">Đăng ký gần đây</h2>
            <div className="space-y-4">
              {recentUsers.map((user, idx) => (
                <div key={idx} className={`flex items-center justify-between ${idx !== recentUsers.length - 1 ? 'border-b border-slate-100 pb-4' : ''}`}>
                  <div className="pr-4">
                    <p className="text-[14px] font-bold text-slate-800 mb-0.5">{user.name}</p>
                    <p className="text-[12px] font-medium text-slate-500 truncate max-w-[280px] sm:max-w-md">{user.sub}</p>
                  </div>
                  <div className={`px-3 py-1 bg-white border ${user.badgeClasses.includes('emerald') ? 'border-emerald-200' : user.badgeClasses.includes('blue') ? 'border-blue-200' : 'border-amber-200'} ${user.badgeClasses} rounded-full font-extrabold text-[11px] whitespace-nowrap shadow-sm`}>
                    {user.badge}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Status */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-slate-800 text-[14px] font-bold tracking-wider uppercase mb-5">Trạng thái hệ thống</h2>
            <div className="space-y-5">
              
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-4">
                <span className="text-slate-600 font-semibold">Tổng món ăn trong DB</span>
                <span className="text-blue-600 font-extrabold text-lg">24,310</span>
              </div>
              
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-4">
                <span className="text-slate-600 font-semibold">Chờ kiểm duyệt (user thêm)</span>
                <span className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">87 món</span>
              </div>

              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-4">
                <span className="text-slate-600 font-semibold">Bị báo cáo sai dữ liệu</span>
                <span className="bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">12 món</span>
              </div>

              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-4">
                 <span className="text-slate-600 font-semibold">Kế hoạch ăn được tạo hôm nay</span>
                 <span className="text-purple-600 font-extrabold text-lg">1,204</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-600 font-semibold">Bài viết dinh dưỡng đã đăng</span>
                 <span className="text-emerald-600 font-extrabold text-lg">48</span>
              </div>

            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
}
