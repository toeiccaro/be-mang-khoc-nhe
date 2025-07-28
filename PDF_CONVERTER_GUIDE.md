# 📄 Hướng dẫn Convert PDF thành Data JSON

## 🚀 Cách sử dụng

### Cách 1: Sử dụng npm script (Khuyến nghị)

```bash
# Convert PDF thành data.json mặc định
npm run pdf-to-json path/to/your/exam.pdf

# Convert với tùy chọn custom
npm run pdf-to-json path/to/your/exam.pdf -- -o custom-data.json -n "Đề thi Word 2013" -d "Đề thi Microsoft Word 2013" -t 45
```

### Cách 2: Chạy trực tiếp

```bash
node scripts/pdf-to-json.js path/to/your/exam.pdf
```

## 📋 Các tùy chọn

| Tùy chọn | Viết tắt | Mô tả | Mặc định |
|----------|----------|-------|----------|
| `--output` | `-o` | Đường dẫn file JSON output | `./public/data.json` |
| `--name` | `-n` | Tên đề thi | `Đề thi trắc nghiệm` |
| `--description` | `-d` | Mô tả đề thi | `Đề thi được tạo từ PDF` |
| `--duration` | `-t` | Thời gian làm bài (phút) | `30` |
| `--help` | `-h` | Hiển thị trợ giúp | - |

## 📝 Format PDF được hỗ trợ

Script hỗ trợ 3 format phổ biến:

### Format 1: Chuẩn (Khuyến nghị)
```
1. MS Word 2013: Để tạo tài liệu mới, ta sử dụng phím tắt nào?
A. Ctrl + N
B. Ctrl + O
C. Ctrl + S
D. Ctrl + P
Answer: A

2. MS Word 2013: Để lưu tài liệu, ta sử dụng phím tắt nào?
A. Ctrl + N
B. Ctrl + O
C. Ctrl + S
D. Ctrl + P
Answer: C
```

### Format 2: Với chữ thường
```
Câu 1: MS Word 2013: Để tạo tài liệu mới, ta sử dụng phím tắt nào?
a) Ctrl + N
b) Ctrl + O
c) Ctrl + S
d) Ctrl + P
Đáp án: a

Câu 2: MS Word 2013: Để lưu tài liệu, ta sử dụng phím tắt nào?
a) Ctrl + N
b) Ctrl + O
c) Ctrl + S
d) Ctrl + P
Đáp án: c
```

### Format 3: Với dấu ngoặc
```
Question 1: MS Word 2013: Để tạo tài liệu mới, ta sử dụng phím tắt nào?
(A) Ctrl + N
(B) Ctrl + O
(C) Ctrl + S
(D) Ctrl + P
Correct: A

Question 2: MS Word 2013: Để lưu tài liệu, ta sử dụng phím tắt nào?
(A) Ctrl + N
(B) Ctrl + O
(C) Ctrl + S
(D) Ctrl + P
Correct: C
```

## 💡 Ví dụ sử dụng

### Ví dụ 1: Convert cơ bản
```bash
npm run pdf-to-json exam-word-2013.pdf
```
**Kết quả:** Tạo file `public/data.json` với đề thi mặc định

### Ví dụ 2: Convert với tên custom
```bash
npm run pdf-to-json exam-word-2013.pdf -- -n "Đề thi MS Word 2013" -d "Đề thi trắc nghiệm Microsoft Word 2013 cơ bản"
```

### Ví dụ 3: Convert với thời gian 45 phút
```bash
npm run pdf-to-json exam-advanced.pdf -- -t 45 -n "Đề thi nâng cao" -o public/advanced-exam.json
```

### Ví dụ 4: Convert nhiều file
```bash
# Tạo script batch
npm run pdf-to-json word-basic.pdf -- -o public/word-basic.json -n "Word Cơ bản"
npm run pdf-to-json word-advanced.pdf -- -o public/word-advanced.json -n "Word Nâng cao"
npm run pdf-to-json excel-basic.pdf -- -o public/excel-basic.json -n "Excel Cơ bản"
```

## 🔧 Troubleshooting

### Lỗi: "Không tìm thấy câu hỏi nào"

**Nguyên nhân:** Format PDF không đúng chuẩn

**Giải pháp:**
1. Kiểm tra file `*_debug.txt` được tạo ra để xem text đã extract
2. Đảm bảo PDF có format đúng như hướng dẫn
3. Thử copy-paste text từ PDF và kiểm tra format

### Lỗi: "File PDF không tồn tại"

**Nguyên nhân:** Đường dẫn file không đúng

**Giải pháp:**
```bash
# Kiểm tra đường dẫn tuyệt đối
npm run pdf-to-json "C:\Users\YourName\Documents\exam.pdf"

# Hoặc đường dẫn tương đối từ thư mục project
npm run pdf-to-json "./documents/exam.pdf"
```

### Lỗi: "Cannot read properties of undefined"

**Nguyên nhân:** PDF bị corrupt hoặc không đọc được

**Giải pháp:**
1. Thử mở PDF bằng Adobe Reader để kiểm tra
2. Export PDF sang format khác rồi convert lại
3. Sử dụng OCR nếu PDF là scan

## 📊 Output JSON Structure

File JSON được tạo sẽ có cấu trúc:

```json
{
  "exams": [
    {
      "id": "de_thi_trac_nghiem",
      "name": "Đề thi trắc nghiệm",
      "description": "Đề thi được tạo từ PDF",
      "duration": 30,
      "totalQuestions": 10,
      "questions": [
        {
          "id": 1,
          "question": "Câu hỏi?",
          "options": {
            "A": "Đáp án A",
            "B": "Đáp án B", 
            "C": "Đáp án C",
            "D": "Đáp án D"
          },
          "correctAnswer": "A",
          "userAnswer": null,
          "isAnswered": false
        }
      ]
    }
  ]
}
```

## 🎯 Tips để có kết quả tốt nhất

1. **Chuẩn bị PDF:**
   - Đảm bảo text có thể select được (không phải scan)
   - Format câu hỏi nhất quán
   - Tránh có hình ảnh xen kẽ giữa câu hỏi

2. **Kiểm tra kết quả:**
   - Luôn xem preview 3 câu đầu
   - Kiểm tra file debug nếu có lỗi
   - Test thử vài câu trong ứng dụng

3. **Tối ưu hóa:**
   - Sử dụng tên đề thi có ý nghĩa
   - Đặt thời gian phù hợp với số câu hỏi
   - Tạo mô tả chi tiết cho đề thi

## 🔄 Workflow khuyến nghị

1. **Chuẩn bị PDF** với format chuẩn
2. **Convert** bằng script: `npm run pdf-to-json exam.pdf`
3. **Kiểm tra** output và preview
4. **Test** trong ứng dụng
5. **Điều chỉnh** nếu cần thiết
6. **Deploy** lên production

---

**💡 Tip:** Nếu bạn có nhiều PDF cần convert, hãy tạo một script batch để tự động hóa quá trình!
