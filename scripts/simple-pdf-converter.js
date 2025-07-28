#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const pdf = require("pdf-parse");

/**
 * Parse câu hỏi từ text PDF
 */
function parseQuestionsFromPDF(text) {
  const questions = [];

  // Regex patterns để tìm câu hỏi
  const questionPatterns = [
    // Pattern 1: "1. Câu hỏi?\nA. Đáp án A\nB. Đáp án B\nC. Đáp án C\nD. Đáp án D\nAnswer: A"
    /(\d+)\.\s*(.+?)\n\s*A\.\s*(.+?)\n\s*B\.\s*(.+?)\n\s*C\.\s*(.+?)\n\s*D\.\s*(.+?)\n\s*(?:Answer|Đáp án|ĐA):\s*([ABCD])/gi,

    // Pattern 2: "Câu 1: Câu hỏi?\na) Đáp án A\nb) Đáp án B\nc) Đáp án C\nd) Đáp án D\nĐáp án: a"
    /(?:Câu\s*)?(\d+)[:.]?\s*(.+?)\n\s*a\)\s*(.+?)\n\s*b\)\s*(.+?)\n\s*c\)\s*(.+?)\n\s*d\)\s*(.+?)\n\s*(?:Đáp án|Answer):\s*([abcdABCD])/gi,

    // Pattern 3: "Question 1: Câu hỏi?\n(A) Đáp án A\n(B) Đáp án B\n(C) Đáp án C\n(D) Đáp án D\nCorrect: A"
    /(?:Question\s*)?(\d+)[:.]?\s*(.+?)\n\s*\(A\)\s*(.+?)\n\s*\(B\)\s*(.+?)\n\s*\(C\)\s*(.+?)\n\s*\(D\)\s*(.+?)\n\s*(?:Correct|Answer):\s*([ABCD])/gi,
  ];

  let questionId = 1;

  // Thử từng pattern
  for (const pattern of questionPatterns) {
    let match;
    const tempQuestions = [];

    while ((match = pattern.exec(text)) !== null) {
      const [
        ,
        questionNum,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
      ] = match;

      // Chuẩn hóa đáp án đúng
      let normalizedAnswer = correctAnswer.toUpperCase();
      if (["a", "b", "c", "d"].includes(correctAnswer.toLowerCase())) {
        const mapping = { a: "A", b: "B", c: "C", d: "D" };
        normalizedAnswer = mapping[correctAnswer.toLowerCase()];
      }

      tempQuestions.push({
        id: questionId++,
        question: questionText.trim(),
        options: {
          A: optionA.trim(),
          B: optionB.trim(),
          C: optionC.trim(),
          D: optionD.trim(),
        },
        correctAnswer: normalizedAnswer,
        userAnswer: null,
        isAnswered: false,
      });
    }

    if (tempQuestions.length > 0) {
      questions.push(...tempQuestions);
      break; // Dừng khi tìm thấy pattern phù hợp
    }
  }

  return questions;
}

/**
 * Làm sạch text từ PDF
 */
function cleanPDFText(text) {
  return (
    text
      // Loại bỏ các ký tự đặc biệt
      .replace(/[^\w\s\n\r\(\)\[\]\.,:;?!-]/g, " ")
      // Chuẩn hóa khoảng trắng
      .replace(/\s+/g, " ")
      // Chuẩn hóa xuống dòng
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      // Loại bỏ dòng trống thừa
      .replace(/\n\s*\n/g, "\n")
      .trim()
  );
}

/**
 * Tạo exam data từ questions
 */
function createExamData(questions, options = {}) {
  const {
    examName = "Đề thi trắc nghiệm",
    description = "Đề thi được tạo từ PDF",
    duration = 30,
  } = options;

  return {
    exams: [
      {
        id: examName
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, ""),
        name: examName,
        description: description,
        duration: duration,
        totalQuestions: questions.length,
        questions: questions,
      },
    ],
  };
}

/**
 * Main function để convert PDF sang JSON
 */
async function convertPDFToJSON(pdfPath, outputPath, options = {}) {
  try {
    console.log(`🔄 Đang đọc file PDF: ${pdfPath}`);

    // Kiểm tra file PDF có tồn tại không
    if (!(await fs.pathExists(pdfPath))) {
      throw new Error(`File PDF không tồn tại: ${pdfPath}`);
    }

    // Đọc file PDF
    const dataBuffer = await fs.readFile(pdfPath);
    const pdfData = await pdf(dataBuffer);

    console.log(
      `📄 Đã đọc PDF: ${pdfData.numpages} trang, ${pdfData.text.length} ký tự`
    );

    // Làm sạch text
    const cleanText = cleanPDFText(pdfData.text);
    console.log(`🧹 Đã làm sạch text: ${cleanText.length} ký tự`);

    // Parse câu hỏi
    const questions = parseQuestionsFromPDF(cleanText);
    console.log(`📝 Đã tìm thấy ${questions.length} câu hỏi`);

    if (questions.length === 0) {
      console.warn(
        "⚠️  Không tìm thấy câu hỏi nào. Kiểm tra lại format của PDF."
      );
      console.log("📋 Format mong đợi:");
      console.log("1. Câu hỏi?");
      console.log("A. Đáp án A");
      console.log("B. Đáp án B");
      console.log("C. Đáp án C");
      console.log("D. Đáp án D");
      console.log("Answer: A");
      console.log("");

      // Lưu raw text để debug
      const debugPath = outputPath.replace(".json", "_debug.txt");
      await fs.writeFile(debugPath, cleanText, "utf8");
      console.log(`🐛 Đã lưu text debug vào: ${debugPath}`);
      return;
    }

    // Tạo exam data
    const examData = createExamData(questions, options);

    // Tạo thư mục output nếu chưa có
    await fs.ensureDir(path.dirname(outputPath));

    // Lưu file JSON
    await fs.writeJSON(outputPath, examData, { spaces: 2 });

    console.log(`✅ Đã tạo file JSON thành công: ${outputPath}`);
    console.log(`📊 Thống kê:`);
    console.log(`   - Tên đề thi: ${examData.exams[0].name}`);
    console.log(`   - Số câu hỏi: ${questions.length}`);
    console.log(`   - Thời gian: ${examData.exams[0].duration} phút`);

    // Hiển thị preview 3 câu hỏi đầu
    console.log(`\n📋 Preview 3 câu hỏi đầu:`);
    questions.slice(0, 3).forEach((q, index) => {
      console.log(`\n${index + 1}. ${q.question}`);
      console.log(`   A. ${q.options.A}`);
      console.log(`   B. ${q.options.B}`);
      console.log(`   C. ${q.options.C}`);
      console.log(`   D. ${q.options.D}`);
      console.log(`   Đáp án: ${q.correctAnswer}`);
    });
  } catch (error) {
    console.error(`❌ Lỗi khi convert PDF: ${error.message}`);
    throw error;
  }
}

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

// Lấy arguments từ command line
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("📋 Cách sử dụng:");
  console.log(
    "node scripts/simple-pdf-converter.js <pdfPath> [outputPath] [examName] [duration]"
  );
  console.log(
    "node scripts/simple-pdf-converter.js --text-mode [outputPath] [examName]"
  );
  console.log("");
  console.log("Ví dụ:");
  console.log('node scripts/simple-pdf-converter.js "exam.pdf"');
  console.log(
    'node scripts/simple-pdf-converter.js "exam.pdf" "public/data.json" "Đề thi Word" 45'
  );
  console.log(
    'node scripts/simple-pdf-converter.js --text-mode "public/data.json" "MS Word 2013"'
  );
  process.exit(1);
}

// Check if text mode
if (args[0] === "--text-mode") {
  const outputPath = args[1] || "./public/data.json";
  const examName = args[2] || "Đề thi MS Word 2013";

  // Text data từ user
  const textData = `1.	MS Winword 2013: để soạn thảo nhanh một cụm từ lặp lại nhiều lần trong văn bản, ta thiết lập từ gõ tắt bằng cách vào File\\Optoin\\ Proofing\\AutoOptoins..., ta chọn tiếp công cụ nào sau đây?
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
Answer: B`;

  // Thêm tất cả text data từ user (chỉ lấy một phần để demo)
  const examData = createMultipleExamsFromText(textData, examName);

  // Lưu file JSON
  fs.writeJSON(outputPath, examData, { spaces: 2 })
    .then(() => {
      console.log(
        `✅ Đã tạo ${examData.exams.length} đề thi thành công: ${outputPath}`
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

  return;
}

const pdfPath = args[0];
const outputPath = args[1] || "./public/data.json";
const examName = args[2] || "Đề thi trắc nghiệm";
const duration = parseInt(args[3]) || 30;

// Chạy conversion
convertPDFToJSON(pdfPath, outputPath, {
  examName: examName,
  description: `Đề thi ${examName} được tạo từ PDF`,
  duration: duration,
}).catch((error) => {
  console.error("❌ Conversion failed:", error.message);
  process.exit(1);
});

module.exports = {
  convertPDFToJSON,
  parseQuestionsFromPDF,
  cleanPDFText,
  createExamData,
};
