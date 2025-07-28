#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const pdf = require("pdf-parse");
const yargs = require("yargs");

/**
 * Parse câu hỏi từ text PDF
 * @param {string} text - Text từ PDF
 * @returns {Array} - Mảng câu hỏi đã parse
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
 * @param {string} text - Text thô từ PDF
 * @returns {string} - Text đã được làm sạch
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
 * @param {Array} questions - Mảng câu hỏi
 * @param {Object} options - Tùy chọn
 * @returns {Object} - Exam data
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
 * @param {string} pdfPath - Đường dẫn file PDF
 * @param {string} outputPath - Đường dẫn file JSON output
 * @param {Object} options - Tùy chọn
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

// CLI setup
const argv = yargs(process.argv.slice(2))
  .usage("Usage: $0 <pdfPath> [options]")
  .command("$0 <pdfPath>", "Convert PDF to JSON exam data", (yargs) => {
    yargs.positional("pdfPath", {
      describe: "Đường dẫn file PDF",
      type: "string",
    });
  })
  .option("output", {
    alias: "o",
    describe: "Đường dẫn file JSON output",
    type: "string",
    default: "./public/data.json",
  })
  .option("name", {
    alias: "n",
    describe: "Tên đề thi",
    type: "string",
    default: "Đề thi trắc nghiệm",
  })
  .option("description", {
    alias: "d",
    describe: "Mô tả đề thi",
    type: "string",
    default: "Đề thi được tạo từ PDF",
  })
  .option("duration", {
    alias: "t",
    describe: "Thời gian làm bài (phút)",
    type: "number",
    default: 30,
  })
  .help()
  .alias("help", "h")
  .example("$0 exam.pdf", "Convert exam.pdf thành data.json")
  .example(
    '$0 exam.pdf -o custom.json -n "Đề thi Word" -t 45',
    "Convert với tùy chọn custom"
  )
  .parseSync();

// Chạy conversion
if (require.main === module) {
  convertPDFToJSON(argv.pdfPath, argv.output, {
    examName: argv.name,
    description: argv.description,
    duration: argv.duration,
  }).catch((error) => {
    console.error("❌ Conversion failed:", error.message);
    process.exit(1);
  });
}

module.exports = {
  convertPDFToJSON,
  parseQuestionsFromPDF,
  cleanPDFText,
  createExamData,
};
