export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Tổng Users", value: "1,284", change: "+12.5%" },
          { label: "Món ăn", value: "456", change: "+8.2%" },
          { label: "Bữa ăn hôm nay", value: "89", change: "+23.1%" },
          { label: "AI Accuracy", value: "97.8%", change: "+2.1%" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-xs text-emerald-600 font-medium">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Phân tích chi tiết</h2>
        <p className="text-muted-foreground">Trang phân tích đang được phát triển. Sẽ bao gồm biểu đồ xu hướng, phân bố dinh dưỡng, và thống kê sử dụng.</p>
      </div>
    </div>
  );
}
