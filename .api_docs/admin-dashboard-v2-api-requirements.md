# Yêu cầu Backend (API) cho Giao diện Dashboard (V2)

Trong lần thiết kế lại giao diện Dashboard mới tập trung vào 4 nhóm thông tin cốt lõi (Key Metrics, Analytics, Management, Trends), hệ thống Frontend yêu cầu trả về dữ liệu (JSON) theo cấu trúc sau. Có thể gộp chung vào 1 endpoint (VD: `/api/v1/admin/dashboard/overview`) để tối ưu tốc độ load.

---

## Cấu trúc JSON Đề Xuất

```json
{
  "EC": 0,
  "EM": "Thành công",
  "data": {
    "keyMetrics": {
      "totalUsers": {
        "value": 14285,
        "trendPercent": 4.2,        // Dấu dương là tăng, âm là giảm
        "trendLabel": "so với tháng trước"
      },
      "newUsersToday": {
        "value": 238,
        "trendPercent": 12.0,
        "trendLabel": "so với hôm qua"
      },
      "totalFoods": {
        "value": 2410,
        "newContributions": 45,     // Số món ăn đóng góp mới (chưa duyệt hoặc mới trong ngày)
        "trendLabel": "món đóng góp mới"
      },
      "totalMealLogs": {
        "value": 68904,
        "trendLabel": "Độ tương tác tháng này"
      }
    },
    
    "trends": {
      "activeUsersLast30Days": [
        { "date": "01/04", "users": 120 },
        { "date": "03/04", "users": 132 },
        // ... liên tục 30 mẫu
      ]
    },

    "analytics": {
      "userGoalsBreakdown": [
        { "name": "Giảm cân", "percentage": 45 },
        { "name": "Tăng cơ", "percentage": 30 },
        { "name": "Duy trì", "percentage": 25 }
      ],
      "topFoods": [
        { 
          "rank": 1, 
          "name": "Phở bò", 
          "calories": "523 kcal", // Hoặc có thể trả về kiểu number (523) và frontend format
          "logCount": 4210, 
          "trendPercent": 12.0    // Dương/âm để hiển thị màu xanh/đỏ
        },
        // ... Top 5 món
      ]
    },

    "management": {
      "totalAlerts": 5,           // Số đếm lượng thông báo
      "alerts": [
        {
          "id": "1",
          "type": "pending",      // "pending" | "report" | "missing" (Dùng render icon)
          "text": "Món \"Gà ủ muối\" chờ duyệt thông tin.",
          "timeAgo": "15 phút trước" // Hoặc trả về ISO timestamp frontend xử lý
        },
        // ... List 5-10 thông báo mới nhất
      ]
    }
  }
}
```

## Các Lưu Ý Cho Backend
1. **Dữ liệu Biểu đồ (Trends):** Mảng `activeUsersLast30Days` nên được nhóm (group by) sẵn và trả về chuẩn từ phía Backend, đảm bảo đủ số lượng ngày (kể cả những ngày missing/0 users thì vẫn phải trả về 0) để biểu đồ mượt.
2. **Tính Percent/Trend:** Các con số `%` thay đổi (`trendPercent`, `trendPercent` của Top Foods) nên được query và tính toán ở tầng Backend tránh tình trạng Frontend phải lưu hoặc gọi 2 frame thời gian khác nhau để tự chia.
3. **Phân loại Alerts (`type`):** Giúp Frontend chọn biểu tượng (icon) và màu sắc (warning, critical, info) tương ứng.
