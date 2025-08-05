# 🖼️ Hướng dẫn tích hợp hình ảnh vào hệ thống thi trắc nghiệm

## 📋 Tổng quan

Hệ thống đã được cập nhật để hỗ trợ câu hỏi dạng hình ảnh với các tính năng:

- ✅ Hiển thị câu hỏi dạng hình ảnh
- ✅ Hỗ trợ options dạng text và hình ảnh  
- ✅ OCR tự động extract text từ hình ảnh
- ✅ Backward compatibility với format cũ
- ✅ Responsive design cho mobile

## 🗂️ Cấu trúc file hình ảnh

Đặt hình ảnh trong thư mục `public/images/` theo format:

```
public/images/
├── 1.Q.PNG    # Câu hỏi số 1
├── 1.O.PNG    # Options cho câu hỏi số 1  
├── 1.A.PNG    # Answer cho câu hỏi số 1
├── 2.Q.PNG    # Câu hỏi số 2
├── 2.O.PNG    # Options cho câu hỏi số 2
├── 2.A.PNG    # Answer cho câu hỏi số 2
└── ...
```

### Quy tắc đặt tên:
- `{số}.Q.PNG` - Hình ảnh câu hỏi
- `{số}.O.PNG` - Hình ảnh options (A, B, C, D)
- `{số}.A.PNG` - Hình ảnh đáp án (Answer: B)

## 📊 Format dữ liệu mới

### Câu hỏi dạng hình ảnh:
```json
{
  "id": 1,
  "question": {
    "type": "image",
    "content": "/images/1.Q.PNG"
  },
  "options": {
    "type": "text",
    "content": {
      "A": "=HLOOKUP, IF",
      "B": "=HLOOKUP, MATCH",
      "C": "=HLOOKUP, RIGHT, LEFT", 
      "D": "=HLOOKUP, MID, IF"
    }
  },
  "correctAnswer": "B"
}
```

### Câu hỏi dạng text (backward compatible):
```json
{
  "id": 2,
  "question": "Câu hỏi dạng text thông thường",
  "options": {
    "A": "Đáp án A",
    "B": "Đáp án B", 
    "C": "Đáp án C",
    "D": "Đáp án D"
  },
  "correctAnswer": "A"
}
```

## 🚀 Cách sử dụng

### 1. Tạo sample data để test:
```bash
npm run create-sample-images
```

### 2. Thêm hình ảnh thật vào `public/images/`

### 3. Chạy OCR để extract text (cần hình ảnh thật):
```bash
# Cài đặt tesseract.js nếu chưa có
npm install

# Chạy OCR
npm run convert-images
```

### 4. Khởi động ứng dụng:
```bash
npm start
```

## 🔧 Scripts có sẵn

| Script | Mô tả |
|--------|-------|
| `npm run create-sample-images` | Tạo sample data để test |
| `npm run convert-images` | OCR hình ảnh thành JSON |
| `npm run images-to-json` | Alias cho convert-images |

## 📱 Responsive Design

Hình ảnh tự động responsive:
- Desktop: Max 400px height cho câu hỏi
- Mobile: Max 250px height cho câu hỏi
- Options: Max 200px width trên desktop, 150px trên mobile

## 🔍 OCR Configuration

Script OCR hỗ trợ:
- Ngôn ngữ: English + Vietnamese
- Format đầu ra: JSON structure
- Error handling: Graceful fallback
- Progress tracking: Real-time progress

## 🎯 Backward Compatibility

Hệ thống tự động detect format:
- Format cũ: `question` là string
- Format mới: `question` là object với `type` và `content`
- Cả hai format đều hoạt động bình thường

## 🐛 Troubleshooting

### Hình ảnh không hiển thị:
1. Kiểm tra đường dẫn file trong `public/images/`
2. Đảm bảo tên file đúng format: `{số}.{Q|O|A}.PNG`
3. Kiểm tra console browser để xem lỗi 404

### OCR không hoạt động:
1. Đảm bảo đã cài `tesseract.js`: `npm install`
2. Kiểm tra hình ảnh có text rõ ràng
3. Thử với hình ảnh có độ phân giải cao hơn

### Performance issues:
1. Optimize hình ảnh trước khi upload
2. Sử dụng format PNG hoặc JPG
3. Giới hạn kích thước file < 2MB

## 📈 Kế hoạch phát triển

- [ ] Hỗ trợ drag & drop upload hình ảnh
- [ ] Batch processing nhiều hình ảnh cùng lúc
- [ ] Preview hình ảnh trước khi convert
- [ ] Export/Import exam với hình ảnh
- [ ] Zoom in/out cho hình ảnh lớn

## 💡 Tips

1. **Chất lượng hình ảnh**: Sử dụng hình ảnh có độ phân giải cao và text rõ ràng
2. **Naming convention**: Tuân thủ strict naming để OCR hoạt động đúng
3. **Testing**: Luôn test với sample data trước khi deploy
4. **Performance**: Optimize hình ảnh để tăng tốc độ load
