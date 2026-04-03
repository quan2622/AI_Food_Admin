## Nội dung tài liệu API:

### 📁 1. Users Management ([/users](cci:9://file:///home/quannguyen/Desktop/luan_van/server/backend_service/src/modules/users:0:0-0:0))
| API | Method | Mô tả |
|-----|--------|-------|
| Lấy tất cả users | `GET /users` | Danh sách users với profile |
| Lấy 1 user | `GET /users/:id` | Chi tiết user + relations |
| Tạo user | `POST /users` | Body: email, password, fullName... |
| Cập nhật user | `PATCH /users/:id` | Body: các field tùy chọn |
| Đổi mật khẩu | `PATCH /users/:id/password` | Body: newPassword |
| Đổi trạng thái | `PATCH /users/:id/status` | Body: status (true/false) |
| Xóa user | `DELETE /users/:id` | ⚠️ Cascade xóa tất cả data |

### 📁 2. User Profiles (`/user-profiles`)
| API | Method | Mô tả |
|-----|--------|-------|
| Lấy tất cả profiles | `GET /user-profiles/all` | Có thông tin user liên kết |
| Lấy theo userId | `GET /user-profiles/by-user/:userId` | Profile của user cụ thể |
| Lấy theo profileId | `GET /user-profiles/:id` | Chi tiết 1 profile |
| Tạo profile | `POST /user-profiles` | Body: userId, age, height, weight... |
| Cập nhật profile | `PATCH /user-profiles/:id` | Auto tính lại BMI/BMR/TDEE |
| Xóa profile | `DELETE /user-profiles/:id` | Xóa profile |

### 📁 3. User Allergies (`/user-allergies`)
| API | Method | Mô tả |
|-----|--------|-------|
| Lấy theo userId | `GET /user-allergies/user/:userId` | Danh sách allergies của user |
| Lấy chi tiết | `GET /user-allergies/:id` | Chi tiết 1 allergy |
| Thêm allergy | `POST /user-allergies` | Body: userId, allergenId, severity, note |
| Cập nhật | `PATCH /user-allergies/:id` | Chỉ đổi severity và note |
| Xóa | `DELETE /user-allergies/:id` | Xóa allergy |

---

File có đầy đủ:
- **Request/Response chi tiết** với ví dụ JSON
- **Validation rules** (required, optional, constraints)
- **Severity levels** và **Activity levels** lookup tables
- **Status codes** và **Error handling**
- **Flow ví dụ** cho admin thao tác
- **Warning** về CASCADE delete

---
---

## Tóm tắt API Thực phẩm:

### 🍽️ 1. Món ăn (`/foods`)
| API | Method | Yêu cầu Admin | Mô tả |
|-----|--------|---------------|-------|
| Lấy tất cả | `GET /foods` | ❌ | Danh sách món ăn |
| Lấy theo category | `GET /foods?categoryId=` | ❌ | Lọc theo category |
| Lấy chi tiết | `GET /foods/:id` | ❌ | Chi tiết 1 món |
| Tạo món | `POST /foods` | ✅ | Body: foodName, description, imageUrl, categoryId |
| Tạo nhiều | `POST /foods/bulk` | ✅ | Body: items[] |
| Cập nhật | `PATCH /foods/:id` | ✅ | Body: các field tùy chọn |
| Xóa 1 món | `DELETE /foods/:id` | ✅ | |
| Xóa nhiều | `DELETE /foods/bulk` | ✅ | Body: ids[] |

### 📁 2. Phân loại (`/food-categories`)
| API | Method | Yêu cầu Admin | Mô tả |
|-----|--------|---------------|-------|
| Lấy tất cả | `GET /food-categories` | ❌ | Cây phân cấp cha-con |
| Lấy root | `GET /food-categories/roots` | ❌ | Categories cấp cao nhất |
| Lấy chi tiết | `GET /food-categories/:id` | ❌ | |
| Lấy children | `GET /food-categories/:id/children` | ❌ | Sub-categories |
| Tạo category | `POST /food-categories` | ✅ | Body: name, description, parentId |
| Cập nhật | `PATCH /food-categories/:id` | ✅ | |
| Xóa | `DELETE /food-categories/:id` | ✅ | ⚠️ Không xóa nếu có con hoặc có foods |

### 🖼️ 3. Ảnh thực phẩm (`/food-images`)
| API | Method | Yêu cầu Admin | Mô tả |
|-----|--------|---------------|-------|
| Upload | `POST /food-images/upload` | ❌ | FormData: image + mealId, max 5MB |
| Lấy theo meal | `GET /food-images/meals/:mealId` | ❌ | |
| Lấy chi tiết | `GET /food-images/:id` | ❌ | |
| Xóa 1 ảnh | `DELETE /food-images/:id` | ✅ | |
| Xóa tất cả | `DELETE /food-images/meals/:mealId` | ✅ | |

**File bao gồm:**
- ✅ Request/Response JSON chi tiết
- ✅ Validation rules (maxLength, required, etc.)
- ✅ File upload specs (5MB, jpeg/png/webp)
- ⚠️ Cascade delete warnings
- 📝 Flow ví dụ admin operations

---
---

Tôi đã tìm hiểu cấu trúc. Hệ thống không có controller CRUD riêng cho Ingredients, mà Ingredients được quản lý thông qua các liên kết (Food-Ingredient, Ingredient-Allergen) và dinh dưỡng. Tôi sẽ tạo tài liệu dựa trên các controller có sẵn.
## Tóm tắt API Nguyên liệu:

### ⚠️ Lưu ý quan trọng
Hệ thống **không có API CRUD trực tiếp** cho danh sách nguyên liệu (Ingredient). Nguyên liệu được quản lý thông qua các liên kết:

### 🥜 1. Allergens (`/allergens`)
| API | Method | Admin | Mô tả |
|-----|--------|-------|-------|
| Lấy tất cả | `GET /allergens` | ❌ | |
| Lấy chi tiết | `GET /allergens/:id` | ❌ | |
| Tạo | `POST /allergens` | ❌ | Body: name, description |
| Cập nhật | `PATCH /allergens/:id` | ❌ | |
| Xóa | `DELETE /allergens/:id` | ❌ | ⚠️ Cascade xóa ingredientAllergens, userAllergies |

### 🔗 2. Ingredient-Allergen (`/ingredient-allergens`)
| API | Method | Admin | Mô tả |
|-----|--------|-------|-------|
| Lấy theo ingredient | `GET /ingredient-allergens/ingredient/:id` | ❌ | |
| Tạo liên kết | `POST /ingredient-allergens` | ❌ | Body: ingredientId, allergenId |
| Xóa theo ID | `DELETE /ingredient-allergens/:id` | ❌ | |
| Xóa theo key | `DELETE /ingredient-allergens/ingredient/:i/allergen/:a` | ❌ | |

### 🍽️ 3. Dish Ingredients (`/foods/:dishId/ingredients`)
| API | Method | Admin | Mô tả |
|-----|--------|-------|-------|
| Lấy theo dish | `GET /foods/:dishId/ingredients` | ❌ | |
| Thêm nguyên liệu | `POST /foods/:dishId/ingredients` | ✅ | Body: ingredientId, quantityGrams |
| Cập nhật | `PATCH /foods/:dishId/ingredients/:id` | ✅ | Body: quantityGrams |
| Xóa | `DELETE /foods/:dishId/ingredients/:id` | ✅ | |

### 📊 4. Ingredient Nutrition (`/ingredients/:id/nutritions`)
| API | Method | Admin | Mô tả |
|-----|--------|-------|-------|
| Lấy dinh dưỡng | `GET /ingredients/:id/nutritions` | ❌ | |
| Tạo | `POST /ingredients/:id/nutritions` | ❌ | Body: servingSize, servingUnit, source, isCalculated |
| Cập nhật | `PATCH /foods/:f/nutritions/:id` | ❌ | |
| Xóa | `DELETE /foods/:f/nutritions/:id` | ❌ | |
| Upsert values | `POST /foods/:f/nutritions/:id/values` | ❌ | Body: values[] |

### 🧪 5. Nutrition Components (`/nutrition-components`)
| API | Method | Admin | Mô tả |
|-----|--------|-------|-------|
| Lấy tất cả | `GET /nutrition-components` | ❌ | |
| Tạo | `POST /nutrition-components` | ✅ | Body: name, unit (G/KG/MG/OZ/LB) |
| Cập nhật | `PATCH /nutrition-components/:id` | ✅ | |
| Xóa | `DELETE /nutrition-components/:id` | ✅ | |


---
---

## 📁 File đã tạo:

### 1. Dinh dưỡng: `@/home/quannguyen/Desktop/luan_van/server/backend_service/api_doc/admin-nutrition-management-api.md`

| Section | API | Method | Yêu cầu Admin |
|---------|-----|--------|---------------|
| **Nutrition Components** | Lấy tất cả | `GET /nutrition-components` | ❌ |
| | Tạo | `POST /nutrition-components` | ✅ |
| | Cập nhật | `PATCH /nutrition-components/:id` | ✅ |
| | Xóa | `DELETE /nutrition-components/:id` | ✅ |
| **Nutrition Goals** | [Admin] Lấy tất cả | `GET /nutrition-goals/all` | ✅ |
| | Lấy của user | `GET /nutrition-goals` | ❌ |
| | Lấy với history | `GET /nutrition-goals/my-goals` | ❌ |
| | Lấy current | `GET /nutrition-goals/current` | ❌ |
| | Chi tiết | `GET /nutrition-goals/:id` | ❌ |
| | Tạo | `POST /nutrition-goals` | ❌ |
| | Cập nhật | `PATCH /nutrition-goals/:id` | ❌ |
| | Xóa 1 | `DELETE /nutrition-goals/:id` | ❌ |
| | Xóa nhiều | `DELETE /nutrition-goals/bulk` | ❌ |

---

### 2. Logs & Tracking: `@/home/quannguyen/Desktop/luan_van/server/backend_service/api_doc/admin-logs-tracking-api.md`

| Section | API | Method | Yêu cầu Admin |
|---------|-----|--------|---------------|
| **Daily Logs** | [Admin] Lấy tất cả | `GET /daily-logs/all` | ✅ |
| | [Admin] Chi tiết | `GET /daily-logs/id/:id` | ✅ |
| | Lấy của user | `GET /daily-logs` | ❌ |
| | Hôm nay | `GET /daily-logs/today` | ❌ |
| | Theo ngày | `GET /daily-logs/:date` | ❌ |
| | Tóm tắt 7 ngày | `GET /daily-logs/weekly` | ❌ |
| **Workout Logs** | Lấy tất cả (paging) | `GET /workout-logs?page=&limit=` | ❌ |
| | Theo ngày | `GET /workout-logs/date/:date` | ❌ |
| | Chi tiết | `GET /workout-logs/:id` | ❌ |
| | Tạo | `POST /workout-logs` | ❌ |
| | Cập nhật | `PATCH /workout-logs/:id` | ❌ |
| | Xóa | `DELETE /workout-logs/:id` | ❌ |
| **Meals** | [Admin] Lấy tất cả | `GET /meals/all` | ✅ |
| | Theo daily log | `GET /meals/daily-log/:id` | ❌ |
| | Chi tiết | `GET /meals/:id` | ❌ |
| | Tạo | `POST /meals` | ❌ |
| | Cập nhật | `PATCH /meals/:id` | ❌ |
| | Xóa | `DELETE /meals/:id` | ❌ |

---

## 📚 Tổng số API docs hiện có:

| File | Nội dung |
|------|----------|
| `admin-user-management-api.md` | Users, User Profiles, User Allergies |
| [admin-food-management-api.md](cci:7://file:///home/quannguyen/Desktop/luan_van/server/backend_service/api_doc/admin-food-management-api.md:0:0-0:0) | Foods, Categories, Food Images |
| [admin-ingredients-management-api.md](cci:7://file:///home/quannguyen/Desktop/luan_van/server/backend_service/api_doc/admin-ingredients-management-api.md:0:0-0:0) | Allergens, Ingredient-Allergen, Dish Ingredients, Nutrition |
| [admin-nutrition-management-api.md](cci:7://file:///home/quannguyen/Desktop/luan_van/server/backend_service/api_doc/admin-nutrition-management-api.md:0:0-0:0) | Nutrition Components, Nutrition Goals |
| [admin-logs-tracking-api.md](cci:7://file:///home/quannguyen/Desktop/luan_van/server/backend_service/api_doc/admin-logs-tracking-api.md:0:0-0:0) | Daily Logs, Workout Logs, Meals |
