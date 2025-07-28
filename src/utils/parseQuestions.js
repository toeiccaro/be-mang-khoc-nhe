/**
 * Function để parse dữ liệu câu hỏi trắc nghiệm từ text
 * @param {string} textData - Dữ liệu text từ PDF
 * @returns {Array} - Mảng các câu hỏi đã được parse
 */
export function parseQuestionsFromText(textData) {
  const questions = [];
  
  // Tách text thành các câu hỏi riêng biệt
  // Sử dụng regex để tìm pattern "số. " ở đầu câu hỏi
  const questionBlocks = textData.split(/(?=\d+\.\s)/);
  
  questionBlocks.forEach((block, index) => {
    if (block.trim() === '') return;
    
    try {
      const parsedQuestion = parseQuestionBlock(block.trim(), index + 1);
      if (parsedQuestion) {
        questions.push(parsedQuestion);
      }
    } catch (error) {
      console.error(`Lỗi khi parse câu hỏi ${index + 1}:`, error);
    }
  });
  
  return questions;
}

/**
 * Parse một block câu hỏi riêng lẻ
 * @param {string} block - Text block chứa một câu hỏi
 * @param {number} questionNumber - Số thứ tự câu hỏi
 * @returns {Object|null} - Object câu hỏi đã parse hoặc null nếu lỗi
 */
function parseQuestionBlock(block, questionNumber) {
  // Regex để tách các phần của câu hỏi
  const questionMatch = block.match(/^(\d+)\.\s*(.*?)(?=\nA\.|$)/s);
  if (!questionMatch) return null;
  
  const questionText = questionMatch[2].trim();
  
  // Tìm các lựa chọn A, B, C, D
  const optionsRegex = /([A-D])\.\s*([^\n]*(?:\n(?![A-D]\.|Answer:)[^\n]*)*)/g;
  const options = {};
  let match;
  
  while ((match = optionsRegex.exec(block)) !== null) {
    const optionLetter = match[1];
    const optionText = match[2].trim().replace(/\n/g, ' ');
    options[optionLetter] = optionText;
  }
  
  // Tìm đáp án đúng
  const answerMatch = block.match(/Answer:\s*([A-D])/);
  const correctAnswer = answerMatch ? answerMatch[1] : null;
  
  // Kiểm tra tính hợp lệ
  if (!questionText || Object.keys(options).length < 4 || !correctAnswer) {
    console.warn(`Câu hỏi ${questionNumber} không đầy đủ thông tin`);
    return null;
  }
  
  return {
    id: questionNumber,
    question: questionText,
    options: {
      A: options.A || '',
      B: options.B || '',
      C: options.C || '',
      D: options.D || ''
    },
    correctAnswer: correctAnswer,
    userAnswer: null,
    isAnswered: false
  };
}

/**
 * Tạo dữ liệu mẫu từ text đã cho
 * @returns {Array} - Mảng câu hỏi mẫu
 */
export function createSampleData() {
  const sampleText = `1. MS Winword 2013: để soạn thảo nhanh một cụm từ lặp lại nhiều lần trong văn bản, ta thiết lập tự gõ tắt bằng cách vào File\\Optoins\\Proofing\\AutoOptoins..., ta chọn tiếp công cụ nào sau đây?
A. AutoFormat
B. Math Autocorrect
C. Autocorrect
D. AutoFormat As You Type
Answer: C

2. MS Winword 2013: khi dùng công cụ Autocorrect, ta nhập tự gõ tắt rồi nhấp cụm từ được thay thế bằng tự gõ tắt vào các mục tương ứng nào sau đây?
A. Replace - Replace With
B. Find What - Replace With
C. Find What - Replace
D. Replace - With
Answer: D`;

  return parseQuestionsFromText(sampleText);
}

/**
 * Lưu dữ liệu câu hỏi vào localStorage
 * @param {Array} questions - Mảng câu hỏi
 * @param {string} examName - Tên đề thi
 */
export function saveQuestionsToStorage(questions, examName = 'default') {
  try {
    const examData = {
      name: examName,
      questions: questions,
      createdAt: new Date().toISOString(),
      totalQuestions: questions.length
    };
    
    localStorage.setItem(`exam_${examName}`, JSON.stringify(examData));
    
    // Cập nhật danh sách đề thi
    const examList = getExamList();
    if (!examList.find(exam => exam.name === examName)) {
      examList.push({
        name: examName,
        totalQuestions: questions.length,
        createdAt: examData.createdAt
      });
      localStorage.setItem('examList', JSON.stringify(examList));
    }
    
    return true;
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu:', error);
    return false;
  }
}

/**
 * Lấy danh sách các đề thi
 * @returns {Array} - Danh sách đề thi
 */
export function getExamList() {
  try {
    const examList = localStorage.getItem('examList');
    return examList ? JSON.parse(examList) : [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đề thi:', error);
    return [];
  }
}

/**
 * Lấy dữ liệu câu hỏi của một đề thi
 * @param {string} examName - Tên đề thi
 * @returns {Object|null} - Dữ liệu đề thi hoặc null nếu không tìm thấy
 */
export function getExamData(examName) {
  try {
    const examData = localStorage.getItem(`exam_${examName}`);
    return examData ? JSON.parse(examData) : null;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu đề thi:', error);
    return null;
  }
}
