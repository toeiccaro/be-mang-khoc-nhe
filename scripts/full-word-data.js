const fs = require("fs-extra");

// Toàn bộ data từ user
const fullWordData = `1.	MS Winword 2013: để soạn thảo nhanh một cụm từ lặp lại nhiều lần trong văn bản, ta thiết lập từ gõ tắt bằng cách vào File\\Optoin\\ Proofing\\AutoOptoins..., ta chọn tiếp công cụ nào sau đây?
A.	AutoFormat
B.	Math Autocorrect
C.	Autocorrect
D.	AutoFormat As You Type
Answer: C

2.	MS Winword 2013: khi dùng công cụ Autocorrect, ta nhập từ gõ tắt rồi nhập cụm từ được thay thế bằng từ gõ tắt vào các mục tương ứng nào sau đây?
A.	Replace - Replace With
B.	Find What - Replace With
C.	Find What - Replace
D.	Replace -With
Answer: D

3.	MS Winword 2013: khi cần thay thế một nội dung cũ trong văn bản thành một nội dung mới, ta nhập nội dung cũ rồi nhập nội dung mới thay thế cho nội dung cũ vào các mục tương ứng nào sau đây?
A.	Replace - Replace With
B.	Find What - Replace With
C.	Find What - Replace
D.	Replace -With
Answer: B

4.	MS Winword 2013: Làm cách nào để thêm một trích dẫn vào văn bản bằng "References" trong Microsoft Word?
A.	Chọn vị trí trong văn bản mà bạn muốn thêm trích dẫn.
B.	Trong tab "References," chọn "Insert Citation."
C.	Chọn kiểu trích dẫn phù hợp (ví dụ: APA, MLA) hoặc tạo kiểu trích dẫn tùy chỉnh.
D.	Nhập thông tin của nguồn tham khảo (tác giả, tiêu đề, năm xuất bản, vv.) trong hộp thoại trích dẫn.
Answer: B

7.	MS Winword 2013: khi thực hiện ngắt trang để sang trang mới, phương án nào sau đây là đúng?
A.	Dùng phím Enter
B.	Dùng tổ hợp phím Alt + Enter
C.	Dùng tổ hợp phím Ctrl + Enter
D.	Dùng tổ hợp phím Shift + Enter
Answer: C

8.	MS Winword 2013: khi thực hiện ngắt trang để sang trang mới, phương án nào sau đây là đúng?
A.	Dùng phím Enter
B.	Dùng tổ hợp phím Alt + Enter
C.	Dùng lệnh Insert\\Page Break
D.	Dùng lệnh Page Layout\\Break\\Next Page
Answer: C

9.	MS Winword 2013: công cụ format painter có chức năng gì?
A.	Sao chép một định dạng đã có trong văn bản
B.	Tạo một định dạng mới cho văn bản
C.	Là công cụ định dạng cho các hình vẽ
D.	Là công cụ vẽ hình
Answer: A

10.	MS Winword 2013: khi thực hiện ngắt đoạn để sang đoạn mới, phương án nào sau đây là đúng?
A.	Dùng lệnh Insert\\Page Break
B.	Dùng lệnh Page Layout\\Break\\Next Page
C.	Dùng tổ hợp phím Ctrl + Enter
D.	Dùng tổ hợp phím Shift + Enter
Answer: B

11.	MS Winword 2013: văn bản có nhiều chương, muốn đánh số trang bắt đầu từ 1 cho từng chương, ta phải thực hiện thao tác nào sau đây?
A.	Ngắt đoạn ở cuối mỗi chương
B.	Dùng phím Enter để sang trang mới ở cuối mỗi chương
C.	Ngắt trang ở cuối mỗi chương
D.	Dùng tổ hợp phím Shift + Enter
Answer: A

12.	MS Winword 2013: để chia cột cho văn bản ta phải chọn đoạn văn bản cần chia cột rồi thực hiện cụm thao tác nào sau đây?
A.	Insert\\ Columns\\ More Columns
B.	Layout\\ Columns\\ More Columns
C.	Insert\\ Columns
D.	Page Layout\\ Columns\\ More Columns
Answer: D

13.	MS Winword 2013: để tạo Bảng cho việc tổ chức dữ liệu dạng danh sách ta thực hiện cụm thao tác nào sau đây?
A.	Page Layout\\Insert Table
B.	References\\Table of Contents
C.	References\\Insert Table
D.	Insert\\Table\\Insert Table
Answer: D

14.	MS Winword 2013: khi sử dụng Bảng muốn lặp lại dòng đầu tiên của bảng trên nhiều trang, ta chọn dòng đầu tiên của Bảng và thực hiện cụm thao tác nào sau đây?
A.	Insert\\Header
B.	Design\\Header Row
C.	Layout\\Repeat Header Rows
D.	Design\\First Row
Answer: C

15.	MS Winword 2013: khi muốn trộn các ô liên tiếp trong Bảng lại thành 1 ô, ta chọn các ô cần trộn và thực hiện cụm thao tác nào sau đây?
A.	Layout\\Merge cells
B.	Insert\\Merge cells
C.	Home\\Font\\Merge cells
D.	Maillings\\Start Mail Merge
Answer: A

16.	MS Winword 2013: khi muốn trộn các ô liên tiếp trong Bảng lại thành 1 ô, ta chọn các ô cần trộn và thực hiện cụm thao tác nào sau đây?
A.	Right Click\\Merge cells
B.	Insert\\Merge cells
C.	Home\\Font\\Merge cells
D.	Maillings\\Start Mail Merge
Answer: A

17.	MS Winword 2013: khi muốn chia 1 ô đã được trộn từ nhiều ô khác trong Bảng thành nhiều ô, ta chọn ô cần chia và thực hiện cụm thao tác nào sau đây?
A.	Right Click\\Insert\\Insert cells
B.	Insert\\Cells
C.	Page Layout\\Line Numbers
D.	Right Click\\Split cells
Answer: D

18.	MS Winword 2013: khi muốn chia 1 ô đã được trộn từ nhiều ô khác trong Bảng thành nhiều ô, ta chọn ô cần chia và thực hiện cụm thao tác nào sau đây?
A.	Right Click\\Insert\\Insert cells
B.	Layout\\Split cells
C.	Page Layout\\Line Numbers
D.	Insert\\Cells
Answer: B

19.	MS Winword 2013: để định dạng hướng của văn bản trong một ô của Bảng ta chọn ô cần định dạng và thực hiện cụm thao tác nào sau đây?
A.	Right Click\\Cells Alignment
B.	Right Click\\Text Directoin
C.	Home\\Font\\ UnderLine Style
D.	View\\Gridlines
Answer: B

20.	MS Winword 2013: để định dạng hướng của văn bản trong một ô của Bảng ta chọn ô cần định dạng và thực hiện cụm thao tác nào sau đây?
A.	Layout\\Cells Alignment
B.	Home\\Font\\ UnderLine Style
C.	Layout\\Text Directoin
D.	View\\Gridlines
Answer: C

21.	MS Winword 2013: để tạo tiêu đề chung ở chân trang cho các trang văn bản ta thực hiện cụm thao tác nào sau đây?
A.	Insert\\Footer
B.	References\\Insert Footnote
C.	References\\Insert Endnote
D.	Insert\\Endnote
Answer: A

22.	MS Winword 2013: để tạo chú thích ở cuối trang cho một nội dung nào đó trong trang văn bản, ta thực hiện cụm thao tác nào sau đây?
A.	Insert\\Footer
B.	References\\Insert Footnote
C.	References\\Insert Endnote
D.	Insert\\Footnote
Answer: B

23.	MS Winword 2013: để tạo chú thích cho một nội dung nào đó trong văn bản và phần chú thích đó được hiển thị ở cuối văn bản, ta thực hiện cụm thao tác nào sau đây?
A.	Insert\\Footer
B.	References\\Insert Footnote
C.	References\\Insert Endnote
D.	Insert\\Footnote
Answer: C

26.	MS Winword 2013: khi thực hiện thao tác Insert\\Picture là để chèn vào văn bản:
A.	Một hình ảnh đã được người dùng lưu trên ổ đĩa
B.	Một hình ảnh lưu trong thư viện hình ảnh của Word
C.	Một mẫu chữ nghệ thuật
D.	Một biểu đồ (đồ thị)
Answer: A

27.	MS Winword 2013: khi thực hiện thao tác Insert\\Chart là để chèn vào văn bản:
A.	Một hình ảnh đã được người dùng lưu trên ổ đĩa
B.	Một hình ảnh lưu trong thư viện hình ảnh của Word
C.	Một mẫu chữ nghệ thuật
D.	Một biểu đồ (đồ thị)
Answer: D

28.	MS Winword 2013: khi thực hiện thao tác Insert\\Clip Art là để chèn vào văn bản:
A.	Một hình ảnh đã được người dùng lưu trên ổ đĩa
B.	Một hình ảnh lưu trong thư viện hình ảnh của Word
C.	Một mẫu chữ nghệ thuật
D.	Một biểu đồ (đồ thị)
Answer: B

29.	MS Winword 2013: khi thực hiện thao tác Insert\\WordArt là để chèn vào văn bản:
A.	Một hình ảnh đã được người dùng lưu trên ổ đĩa
B.	Một hình ảnh lưu trong thư viện hình ảnh của Word
C.	Một mẫu chữ nghệ thuật
D.	Một biểu đồ (đồ thị)
Answer: C

30.	MS Winword 2013: để tạo mục lục tự động cho văn bản, sau khi thiết lập Level cho các nội dung tạo mục lục, ta đặt con trỏ tại vị trí tạo mục lục và thực hiện cụm thao tác nào sau đây?
A.	References\\Table of Contents\\Insert Table of Contents
B.	Insert\\Table
C.	References\\Insert Table of Figure
D.	References\\Insert Index
Answer: A`;

const remainingData = `31.	MS Winword 2013: khi thực hiện trộn thư ta thực hiện thao tác Mailling\\Select Recipients\\Use Existing List..., hệ thống sẽ yêu cầu ta làm gì tiếp theo?
A.	Chỉ đường dẫn đến File dữ liệu nguồn cung cấp cho việc trộn thư.
B.	Tạo mới một danh sách dữ liệu cung cấp cho việc trộn thư
C.	Chỉ định trường dữ liệu chèn vào tài liệu gốc
D.	Xem kết quả trộn thư
Answer: A

32.	MS Winword 2013: khi thực hiện trộn thư ta thực hiện thao tác Mailling\\Select Recipients\\Type New List..., hệ thống sẽ yêu cầu ta làm gì tiếp theo?
A.	Chỉ đường dẫn đến File dữ liệu nguồn cung cấp cho việc trộn thư.
B.	Tạo mới một danh sách dữ liệu cung cấp cho việc trộn thư
C.	Chỉ định trường dữ liệu chèn vào tài liệu gốc
D.	Xem kết quả trộn thư
Answer: B

33.	MS Winword 2013: khi thực hiện trộn thư ta thực hiện thao tác Mailling\\Insert Merge Field, hệ thống sẽ yêu cầu ta làm gì tiếp theo?
A.	Chỉ đường dẫn đến File dữ liệu nguồn cung cấp cho việc trộn thư.
B.	Tạo mới một danh sách dữ liệu cung cấp cho việc trộn thư
C.	Chỉ định trường dữ liệu chèn vào tài liệu gốc
D.	Xem kết quả trộn thư
Answer: C

37.	MS Winword 2013: khi văn bản được gắn mật khẩu, để làm việc trên văn bản này, người dùng phải nhập mật khẩu khi nào?
A.	Khi thực hiện chỉnh sửa thông tin trên văn bản
B.	Khi Lưu văn bản với nội dung được chỉnh sửa
C.	Khi lưu văn bản với một tên mới
D.	Khi mở văn bản
Answer: D

40.	MS Winword 2013: tại cửa sổ Page Setup ta chọn Port Trait với chủ đích gì?
A.	Chỉ định in trang dọc
B.	Chọn khổ giấy A4
C.	Chỉ định in trang ngang
D.	Chọn khổ giấy A5
Answer: A

41.	MS Winword 2013: tại cửa sổ Page Setup ta chọn LandScape với chủ đích gì?
A.	Chỉ định in trang dọc
B.	Chọn khổ giấy A4
C.	Chỉ định in trang ngang
D.	Chọn khổ giấy A5
Answer: C

50.	MS Winword 2013: khi muốn in trang 5, con trỏ soạn thảo đang ở trang 5 trong văn bản có 20 trang, ta thao tác File\\Print, tiếp theo ta chỉ định trang in theo cách nào sau đây?
A.	Print Current Page
B.	Tại mục Pages gõ vào 1-5
C.	Tại mục Pages gõ vào 1
D.	Tại mục Pages gõ vào 1-1,5
Answer: A

51.	MS Winword 2013: Chủ đề nào không thuộc Menu Home
A.	Links
B.	Font
C.	Paragraph
D.	Styles
Answer: A

52.	MS Winword 2013: Chủ đề nào không thuộc Menu Home
A.	Tables
B.	Font
C.	Paragraph
D.	Styles
Answer: A

53.	MS Winword 2013: Chủ đề nào không thuộc Menu Home
A.	Header & Footer
B.	Font
C.	Paragraph
D.	Styles
Answer: A

54.	MS Winword 2013: Chủ đề nào không thuộc Menu Home
A.	Text
B.	Font
C.	Paragraph
D.	Styles
Answer: A

55.	MS Winword 2013: Chủ đề nào không thuộc Menu Insert
A.	Font
B.	Links
C.	Tables
D.	Header & Footer
Answer: A

56.	MS Winword 2013: Chủ đề nào không thuộc Menu Insert
A.	Paragraph
B.	Links
C.	Tables
D.	Header & Footer
Answer: A

57.	MS Winword 2013: Chủ đề nào không thuộc Menu Insert
A.	Styles
B.	Links
C.	Tables
D.	Header & Footer
Answer: A

58.	MS Winword 2013: Chủ đề nào không thuộc Menu Insert
A.	Clipboard
B.	Links
C.	Tables
D.	Header & Footer
Answer: A

59.	MS Winword 2013: Chủ đề nào không thuộc Menu Insert
A.	Editing
B.	Links
C.	Tables
D.	Header & Footer
Answer: A

60.	MS Winword 2013: Chủ đề nào thuộc Menu Page Layout
A.	Themes
B.	Links
C.	Font
D.	Styles
Answer: A`;

// Combine all data
const completeWordData = fullWordData + "\n\n" + remainingData;

// Import functions từ simple-pdf-converter
const { parseQuestionsFromPDF } = require("./simple-pdf-converter");

/**
 * Tạo data từ text và chia thành các đề 30 câu
 */
function createMultipleExamsFromText(
  textData,
  baseExamName = "Đề thi MS Word 2013"
) {
  const questions = parseQuestionsFromPDF(textData);
  console.log(`📝 Đã parse ${questions.length} câu hỏi`);

  const exams = [];
  const questionsPerExam = 30;
  const totalExams = Math.ceil(questions.length / questionsPerExam);

  for (let i = 0; i < totalExams; i++) {
    const startIndex = i * questionsPerExam;
    const endIndex = Math.min(startIndex + questionsPerExam, questions.length);
    const examQuestions = questions.slice(startIndex, endIndex);

    // Reset question IDs for each exam
    examQuestions.forEach((q, index) => {
      q.id = index + 1;
    });

    const examName =
      totalExams > 1 ? `${baseExamName} - Phần ${i + 1}` : baseExamName;
    const examId = `ms_word_2013_part_${i + 1}`;

    exams.push({
      id: examId,
      name: examName,
      description: `Đề thi trắc nghiệm MS Word 2013 - Phần ${i + 1} (${
        examQuestions.length
      } câu)`,
      duration: 30,
      totalQuestions: examQuestions.length,
      questions: examQuestions,
    });
  }

  return { exams };
}

// Generate data nếu chạy trực tiếp
if (require.main === module) {
  const examData = createMultipleExamsFromText(
    completeWordData,
    "Đề thi MS Word 2013"
  );

  // Lưu file JSON
  fs.writeJSON("./public/data.json", examData, { spaces: 2 })
    .then(() => {
      console.log(
        `✅ Đã tạo ${examData.exams.length} đề thi thành công: ./public/data.json`
      );
      examData.exams.forEach((exam, index) => {
        console.log(
          `   ${index + 1}. ${exam.name}: ${exam.totalQuestions} câu`
        );
      });
    })
    .catch((error) => {
      console.error("❌ Lỗi khi lưu file:", error.message);
    });
}

module.exports = {
  fullWordData,
  completeWordData,
  createMultipleExamsFromText,
};
