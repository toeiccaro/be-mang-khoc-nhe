#!/usr/bin/env node

const fs = require("fs-extra");

/**
 * Parse câu hỏi từ text theo format:
 * Format 1: Answer ở dòng riêng
 * "4. MS Winword 2013: Làm cách nào...
 * A. Chọn vị trí...
 * B. Trong tab...
 * C. Chọn kiểu...
 * D. Nhập thông tin...
 * Answer: B"
 *
 * Format 2: Answer ở cuối dòng D
 * "1. MS Winword 2013: để soạn thảo...
 * A. AutoFormat
 * B. Math Autocorrect
 * C. Autocorrect
 * D. AutoFormat As You Type Answer: C"
 */
function parseQuestionsFromText(text) {
  const questions = [];

  // Pattern 1: Answer ở dòng riêng
  const pattern1 =
    /(\d+)\.\s*(.+?)\n\s*A\.\s*(.+?)\n\s*B\.\s*(.+?)\n\s*C\.\s*(.+?)\n\s*D\.\s*(.+?)\n\s*Answer:\s*([ABCD])/gi;

  // Pattern 2: Answer ở cuối dòng D
  const pattern2 =
    /(\d+)\.\s*(.+?)\n\s*A\.\s*(.+?)\n\s*B\.\s*(.+?)\n\s*C\.\s*(.+?)\n\s*D\.\s*(.+?)\s+Answer:\s*([ABCD])/gi;

  let questionId = 1;

  // Thử pattern 1 trước
  let match;
  while ((match = pattern1.exec(text)) !== null) {
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

    questions.push({
      id: questionId++,
      question: questionText.trim(),
      options: {
        A: optionA.trim(),
        B: optionB.trim(),
        C: optionC.trim(),
        D: optionD.trim(),
      },
      correctAnswer: correctAnswer.trim(),
      userAnswer: null,
      isAnswered: false,
    });
  }

  // Reset regex và thử pattern 2
  pattern2.lastIndex = 0;
  while ((match = pattern2.exec(text)) !== null) {
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

    // Kiểm tra xem câu hỏi này đã được thêm chưa (tránh duplicate)
    const existingQuestion = questions.find((q) =>
      q.question.includes(questionText.trim().substring(0, 50))
    );
    if (!existingQuestion) {
      questions.push({
        id: questionId++,
        question: questionText.trim(),
        options: {
          A: optionA.trim(),
          B: optionB.trim(),
          C: optionC.trim(),
          D: optionD
            .trim()
            .replace(/\s+Answer:\s*[ABCD].*$/, "")
            .trim(), // Loại bỏ Answer khỏi option D
        },
        correctAnswer: correctAnswer.trim(),
        userAnswer: null,
        isAnswered: false,
      });
    }
  }

  // Sắp xếp theo thứ tự câu hỏi và reset ID
  questions.sort((a, b) => {
    const aNum = parseInt(a.question.match(/^\d+/)?.[0] || "0");
    const bNum = parseInt(b.question.match(/^\d+/)?.[0] || "0");
    return aNum - bNum;
  });

  // Reset IDs
  questions.forEach((q, index) => {
    q.id = index + 1;
  });

  return questions;
}

/**
 * Tạo data từ text và chia thành các đề 30 câu
 */
function createMultipleExamsFromText(
  textData,
  baseExamName = "Đề thi trắc nghiệm"
) {
  const questions = parseQuestionsFromText(textData);
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
    const examId =
      baseExamName.toLowerCase().replace(/\s+/g, "_") + `_part_${i + 1}`;

    exams.push({
      id: examId,
      name: examName,
      description: `${baseExamName} - Phần ${i + 1} (${
        examQuestions.length
      } câu)`,
      duration: 30,
      totalQuestions: examQuestions.length,
      questions: examQuestions,
    });
  }

  return { exams };
}

/**
 * Main function để convert text sang JSON
 */
async function convertTextToJSON(
  inputPath,
  outputPath,
  examName = "Đề thi trắc nghiệm"
) {
  try {
    console.log(`🔄 Đang đọc file text: ${inputPath}`);

    // Kiểm tra file có tồn tại không
    if (!(await fs.pathExists(inputPath))) {
      throw new Error(`File không tồn tại: ${inputPath}`);
    }

    // Đọc file text
    const textData = await fs.readFile(inputPath, "utf8");
    console.log(`📄 Đã đọc file: ${textData.length} ký tự`);

    // Parse câu hỏi và tạo exams
    const examData = createMultipleExamsFromText(textData, examName);

    if (examData.exams.length === 0) {
      console.warn(
        "⚠️  Không tìm thấy câu hỏi nào. Kiểm tra lại format của text."
      );
      console.log("📋 Format mong đợi:");
      console.log("1. Câu hỏi?");
      console.log("A. Đáp án A");
      console.log("B. Đáp án B");
      console.log("C. Đáp án C");
      console.log("D. Đáp án D");
      console.log("Answer: A");
      return;
    }

    // Tạo thư mục output nếu chưa có
    await fs.ensureDir(require("path").dirname(outputPath));

    // Lưu file JSON
    await fs.writeJSON(outputPath, examData, { spaces: 2 });

    console.log(`✅ Đã tạo file JSON thành công: ${outputPath}`);
    console.log(`📊 Thống kê:`);
    examData.exams.forEach((exam, index) => {
      console.log(`   ${index + 1}. ${exam.name}: ${exam.totalQuestions} câu`);
    });

    // Hiển thị preview 3 câu hỏi đầu của đề đầu tiên
    if (examData.exams[0] && examData.exams[0].questions.length > 0) {
      console.log(
        `\n📋 Preview 3 câu hỏi đầu của "${examData.exams[0].name}":`
      );
      examData.exams[0].questions.slice(0, 3).forEach((q, index) => {
        console.log(`\n${index + 1}. ${q.question}`);
        console.log(`   A. ${q.options.A}`);
        console.log(`   B. ${q.options.B}`);
        console.log(`   C. ${q.options.C}`);
        console.log(`   D. ${q.options.D}`);
        console.log(`   Đáp án: ${q.correctAnswer}`);
      });
    }
  } catch (error) {
    console.error(`❌ Lỗi khi convert text: ${error.message}`);
    throw error;
  }
}

// Lấy arguments từ command line
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("📋 Cách sử dụng:");
  console.log(
    "node scripts/parse-text-to-json.js <textFilePath> [outputPath] [examName]"
  );
  console.log("");
  console.log("Ví dụ:");
  console.log('node scripts/parse-text-to-json.js "questions.txt"');
  console.log(
    'node scripts/parse-text-to-json.js "questions.txt" "public/data.json" "Đề thi Word 2013"'
  );
  console.log("");
  console.log("Hoặc sử dụng data có sẵn:");
  console.log("node scripts/full-word-data.js");
  process.exit(1);
}

const inputPath = args[0];
const outputPath = args[1] || "./public/data.json";
const examName = args[2] || "Đề thi trắc nghiệm";

// Chạy conversion
convertTextToJSON(inputPath, outputPath, examName).catch((error) => {
  console.error("❌ Conversion failed:", error.message);
  process.exit(1);
});

module.exports = {
  parseQuestionsFromText,
  createMultipleExamsFromText,
  convertTextToJSON,
};
