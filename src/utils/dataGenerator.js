import { parseQuestionsFromText, saveQuestionsToStorage } from './parseQuestions';

/**
 * Tạo thêm dữ liệu mẫu cho hệ thống
 */
export function generateMoreSampleData() {
  // Dữ liệu mẫu thêm cho MS Word 2013
  const additionalWordData = `3. MS Word 2013: Để tạo một danh sách có bullet points, ta sử dụng công cụ nào?
A. Numbering
B. Bullets
C. Multilevel List
D. Outline
Answer: B

4. MS Word 2013: Phím tắt để mở hộp thoại Find and Replace là gì?
A. Ctrl + F
B. Ctrl + H
C. Ctrl + G
D. Ctrl + R
Answer: B

5. MS Word 2013: Để chèn một bảng vào tài liệu, ta vào tab nào?
A. Home
B. Insert
C. Design
D. Layout
Answer: B

6. MS Word 2013: Để thay đổi kích thước font chữ, ta sử dụng công cụ nào trong nhóm Font?
A. Font Color
B. Font Size
C. Font Style
D. Font Family
Answer: B

7. MS Word 2013: Phím tắt để copy text là gì?
A. Ctrl + X
B. Ctrl + C
C. Ctrl + V
D. Ctrl + Z
Answer: B

8. MS Word 2013: Để căn lề trái cho đoạn văn, ta sử dụng phím tắt nào?
A. Ctrl + L
B. Ctrl + R
C. Ctrl + E
D. Ctrl + J
Answer: A

9. MS Word 2013: Để tạo header cho tài liệu, ta vào tab nào?
A. Home
B. Insert
C. Design
D. References
Answer: B

10. MS Word 2013: Phím tắt để paste text là gì?
A. Ctrl + X
B. Ctrl + C
C. Ctrl + V
D. Ctrl + Z
Answer: C`;

  // Dữ liệu mẫu cho Excel 2013
  const excelData = `1. MS Excel 2013: Để tạo một chart từ dữ liệu, ta vào tab nào?
A. Home
B. Insert
C. Data
D. Review
Answer: B

2. MS Excel 2013: Hàm SUM được sử dụng để làm gì?
A. Tính trung bình
B. Tính tổng
C. Đếm số lượng
D. Tìm giá trị lớn nhất
Answer: B

3. MS Excel 2013: Để freeze panes, ta vào tab nào?
A. Home
B. Insert
C. View
D. Data
Answer: C

4. MS Excel 2013: Phím tắt để save file là gì?
A. Ctrl + S
B. Ctrl + O
C. Ctrl + N
D. Ctrl + P
Answer: A

5. MS Excel 2013: Để tạo pivot table, ta vào tab nào?
A. Home
B. Insert
C. Data
D. Review
Answer: B

6. MS Excel 2013: Hàm AVERAGE được sử dụng để làm gì?
A. Tính tổng
B. Tính trung bình
C. Đếm số lượng
D. Tìm giá trị nhỏ nhất
Answer: B

7. MS Excel 2013: Để sort dữ liệu, ta vào tab nào?
A. Home
B. Insert
C. Data
D. Review
Answer: C

8. MS Excel 2013: Phím tắt để copy cell là gì?
A. Ctrl + X
B. Ctrl + C
C. Ctrl + V
D. Ctrl + Z
Answer: B

9. MS Excel 2013: Để filter dữ liệu, ta sử dụng tính năng nào?
A. Sort
B. Filter
C. Find
D. Replace
Answer: B

10. MS Excel 2013: Hàm COUNT được sử dụng để làm gì?
A. Tính tổng
B. Tính trung bình
C. Đếm số lượng
D. Tìm giá trị lớn nhất
Answer: C`;

  // Dữ liệu mẫu cho PowerPoint 2013
  const powerpointData = `1. MS PowerPoint 2013: Để tạo slide mới, ta sử dụng phím tắt nào?
A. Ctrl + M
B. Ctrl + N
C. Ctrl + S
D. Ctrl + O
Answer: A

2. MS PowerPoint 2013: Để chèn hình ảnh vào slide, ta vào tab nào?
A. Home
B. Insert
C. Design
D. Transitions
Answer: B

3. MS PowerPoint 2013: Để thêm animation cho object, ta vào tab nào?
A. Home
B. Insert
C. Animations
D. Transitions
Answer: C

4. MS PowerPoint 2013: Để thay đổi theme của presentation, ta vào tab nào?
A. Home
B. Insert
C. Design
D. View
Answer: C

5. MS PowerPoint 2013: Phím tắt để start slideshow là gì?
A. F5
B. F1
C. F12
D. Ctrl + F5
Answer: A

6. MS PowerPoint 2013: Để duplicate slide, ta sử dụng phím tắt nào?
A. Ctrl + D
B. Ctrl + C
C. Ctrl + V
D. Ctrl + X
Answer: A

7. MS PowerPoint 2013: Để thêm transition giữa các slide, ta vào tab nào?
A. Home
B. Insert
C. Animations
D. Transitions
Answer: D

8. MS PowerPoint 2013: Để thêm text box vào slide, ta vào tab nào?
A. Home
B. Insert
C. Design
D. View
Answer: B

9. MS PowerPoint 2013: Phím tắt để end slideshow là gì?
A. Esc
B. F1
C. Enter
D. Space
Answer: A

10. MS PowerPoint 2013: Để thay đổi layout của slide, ta vào tab nào?
A. Home
B. Insert
C. Design
D. View
Answer: A`;

  // Parse và tạo các đề thi
  const wordQuestions = parseQuestionsFromText(additionalWordData);
  const excelQuestions = parseQuestionsFromText(excelData);
  const powerpointQuestions = parseQuestionsFromText(powerpointData);

  // Lưu vào localStorage
  saveQuestionsToStorage(wordQuestions, 'word_advanced');
  saveQuestionsToStorage(excelQuestions, 'excel_basic');
  saveQuestionsToStorage(powerpointQuestions, 'powerpoint_basic');

  console.log('Đã tạo thêm 3 đề thi mẫu!');
  
  return {
    word: wordQuestions,
    excel: excelQuestions,
    powerpoint: powerpointQuestions
  };
}

/**
 * Tạo dữ liệu đề thi từ text input
 * @param {string} textData - Dữ liệu text chứa câu hỏi
 * @param {string} examName - Tên đề thi
 * @param {string} description - Mô tả đề thi
 * @param {number} duration - Thời gian làm bài (phút)
 * @returns {Object} - Dữ liệu đề thi đã được tạo
 */
export function createExamFromText(textData, examName, description = '', duration = 30) {
  try {
    const questions = parseQuestionsFromText(textData);
    
    if (questions.length === 0) {
      throw new Error('Không tìm thấy câu hỏi hợp lệ trong dữ liệu');
    }

    const examData = {
      id: examName.toLowerCase().replace(/\s+/g, '_'),
      name: examName,
      description: description || `Đề thi trắc nghiệm ${examName}`,
      duration: duration,
      totalQuestions: questions.length,
      questions: questions
    };

    // Lưu vào localStorage
    const success = saveQuestionsToStorage(questions, examData.id);
    
    if (success) {
      console.log(`Đã tạo đề thi "${examName}" với ${questions.length} câu hỏi`);
      return examData;
    } else {
      throw new Error('Không thể lưu đề thi');
    }
  } catch (error) {
    console.error('Lỗi khi tạo đề thi:', error);
    throw error;
  }
}

/**
 * Import dữ liệu từ file JSON
 * @param {Object} jsonData - Dữ liệu JSON
 * @returns {boolean} - Thành công hay không
 */
export function importExamData(jsonData) {
  try {
    if (!jsonData.exams || !Array.isArray(jsonData.exams)) {
      throw new Error('Dữ liệu JSON không hợp lệ');
    }

    let importedCount = 0;
    
    jsonData.exams.forEach(exam => {
      if (exam.questions && Array.isArray(exam.questions)) {
        const success = saveQuestionsToStorage(exam.questions, exam.id);
        if (success) {
          importedCount++;
        }
      }
    });

    console.log(`Đã import ${importedCount} đề thi`);
    return importedCount > 0;
  } catch (error) {
    console.error('Lỗi khi import dữ liệu:', error);
    return false;
  }
}

/**
 * Export dữ liệu ra JSON
 * @returns {Object} - Dữ liệu JSON của tất cả đề thi
 */
export function exportAllExamData() {
  try {
    const examList = JSON.parse(localStorage.getItem('examList') || '[]');
    const exams = [];

    examList.forEach(examInfo => {
      const examData = localStorage.getItem(`exam_${examInfo.name}`);
      if (examData) {
        const exam = JSON.parse(examData);
        exams.push({
          id: examInfo.name,
          name: exam.name,
          description: exam.description || '',
          duration: exam.duration || 30,
          totalQuestions: exam.totalQuestions,
          questions: exam.questions
        });
      }
    });

    return {
      exams: exams,
      exportedAt: new Date().toISOString(),
      totalExams: exams.length
    };
  } catch (error) {
    console.error('Lỗi khi export dữ liệu:', error);
    return { exams: [], exportedAt: new Date().toISOString(), totalExams: 0 };
  }
}

/**
 * Xóa tất cả dữ liệu đề thi
 */
export function clearAllExamData() {
  try {
    const examList = JSON.parse(localStorage.getItem('examList') || '[]');
    
    examList.forEach(examInfo => {
      localStorage.removeItem(`exam_${examInfo.name}`);
    });
    
    localStorage.removeItem('examList');
    console.log('Đã xóa tất cả dữ liệu đề thi');
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu:', error);
    return false;
  }
}
