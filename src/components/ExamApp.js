import React, { useState, useEffect, useCallback } from "react";
import ExamList from "./ExamList";
import Timer from "./Timer";
import Question from "./Question";
import ExamResult from "./ExamResult";

import "./ExamApp.css";

const ExamApp = () => {
  // State management
  const [currentView, setCurrentView] = useState("home"); // 'home', 'exam', 'result'
  const [selectedExam, setSelectedExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [examStartTime, setExamStartTime] = useState(null);
  const [isExamActive, setIsExamActive] = useState(false);
  const [examData, setExamData] = useState(null);

  // Load exam data khi component mount
  useEffect(() => {
    const loadExamData = async () => {
      try {
        console.log("Đang tải dữ liệu từ /data.json...");

        // Thử fetch từ public folder với các đường dẫn khác nhau
        let response;
        const paths = [
          `${process.env.PUBLIC_URL}/data.json`,
          "/data.json",
          "./data.json",
          "data.json",
        ];

        let lastError;
        for (const path of paths) {
          try {
            console.log("Thử tải từ:", path);
            response = await fetch(path);
            console.log(`Response từ ${path}:`, response.status);
            if (response.ok) break;
          } catch (err) {
            console.log(`Lỗi với path ${path}:`, err.message);
            lastError = err;
          }
        }

        if (response && response.ok) {
          const text = await response.text();
          console.log("Raw response text:", text.substring(0, 200) + "...");

          try {
            const data = JSON.parse(text);
            console.log("Dữ liệu đã tải thành công:", data);
            console.log("Số lượng đề thi:", data.exams?.length);
            setExamData(data);
          } catch (parseError) {
            console.error("Lỗi parse JSON:", parseError);
            console.error("Text content:", text.substring(0, 500));
            throw new Error("Lỗi định dạng file data.json");
          }
        } else {
          console.error("Không thể tải data.json từ bất kỳ đường dẫn nào");
          console.error(
            "Response cuối cùng:",
            response?.status,
            response?.statusText
          );
          console.error("Lỗi cuối cùng:", lastError);
          throw new Error("Không thể tải data.json từ bất kỳ đường dẫn nào");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        // Hiển thị thông báo lỗi thay vì dùng sample data
        alert(
          "Không thể tải dữ liệu đề thi. Vui lòng kiểm tra kết nối mạng và thử lại."
        );
      }
    };

    loadExamData();
  }, []);

  // Xử lý chọn đề thi
  const handleExamSelect = useCallback((exam) => {
    setSelectedExam(exam);
  }, []);

  // Bắt đầu làm bài thi
  const handleStartExam = useCallback(() => {
    if (!selectedExam) return;

    setCurrentView("exam");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeSpent(0);
    setExamStartTime(Date.now());
    setIsExamActive(true);
  }, [selectedExam]);

  // Xử lý chọn đáp án
  const handleAnswerSelect = useCallback((questionId, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

  // Navigation giữa các câu hỏi
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < selectedExam.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, selectedExam]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleNavigateToQuestion = useCallback(
    (questionIndex) => {
      if (questionIndex >= 0 && questionIndex < selectedExam.questions.length) {
        setCurrentQuestionIndex(questionIndex);
      }
    },
    [selectedExam]
  );

  // Xử lý khi hết thời gian
  const handleTimeUp = useCallback(() => {
    setIsExamActive(false);
    setCurrentView("result");
    if (examStartTime) {
      setTimeSpent(Math.floor((Date.now() - examStartTime) / 1000));
    }
  }, [examStartTime]);

  // Cập nhật thời gian đã trôi qua
  const handleTimeUpdate = useCallback(
    (timeLeft) => {
      if (examStartTime && selectedExam) {
        const totalTime = selectedExam.duration * 60; // Convert to seconds
        const elapsed = totalTime - timeLeft;
        setTimeSpent(elapsed);
      }
    },
    [examStartTime, selectedExam]
  );

  // Nộp bài thi
  const handleSubmitExam = useCallback(() => {
    setIsExamActive(false);
    setCurrentView("result");
    if (examStartTime) {
      setTimeSpent(Math.floor((Date.now() - examStartTime) / 1000));
    }
  }, [examStartTime]);

  // Làm lại bài thi
  const handleRetakeExam = useCallback(() => {
    setCurrentView("home");
    setSelectedExam(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeSpent(0);
    setExamStartTime(null);
    setIsExamActive(false);
  }, []);

  // Về trang chủ
  const handleBackToHome = useCallback(() => {
    setCurrentView("home");
    setSelectedExam(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeSpent(0);
    setExamStartTime(null);
    setIsExamActive(false);
  }, []);

  // Tính toán các câu đã trả lời
  const answeredQuestions = Object.keys(userAnswers).map((id) => parseInt(id));

  // Render loading state
  if (!examData) {
    return (
      <div className="exam-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu đề thi...</p>
          <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
            Nếu tải quá lâu, vui lòng kiểm tra kết nối mạng và refresh trang
          </p>
        </div>
      </div>
    );
  }

  // Render home view
  if (currentView === "home") {
    return (
      <div className="exam-app">
        <div className="app-header">
          <h1>🎓 Hệ thống thi trắc nghiệm</h1>
          <p>Chọn đề thi và bắt đầu làm bài</p>
        </div>

        <ExamList
          exams={examData.exams}
          onExamSelect={handleExamSelect}
          selectedExamId={selectedExam?.id}
        />

        {selectedExam && (
          <div className="exam-preview">
            <div className="preview-content">
              <h3>📋 {selectedExam.name}</h3>
              <p>{selectedExam.description}</p>

              <div className="exam-details">
                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <span>Thời gian: {selectedExam.duration} phút</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📝</span>
                  <span>Số câu hỏi: {selectedExam.totalQuestions}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📊</span>
                  <span>Điểm tối đa: 100 điểm</span>
                </div>
              </div>

              <div className="exam-instructions">
                <h4>📋 Hướng dẫn làm bài:</h4>
                <ul>
                  <li>Thời gian làm bài: {selectedExam.duration} phút</li>
                  <li>Tổng số câu hỏi: {selectedExam.totalQuestions} câu</li>
                  <li>Mỗi câu hỏi có 4 lựa chọn A, B, C, D</li>
                  <li>
                    Bạn có thể xem lại và thay đổi đáp án trước khi nộp bài
                  </li>
                  <li>Khi hết thời gian, bài thi sẽ tự động được nộp</li>
                </ul>
              </div>

              <button className="start-exam-button" onClick={handleStartExam}>
                🚀 Bắt đầu làm bài
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render exam view
  if (currentView === "exam") {
    const currentQuestion = selectedExam.questions[currentQuestionIndex];

    return (
      <div className="exam-app exam-mode">
        {/* Fixed Header */}
        <div className="exam-header">
          <div className="exam-info">
            <h3 className="exam-title">{selectedExam.name}</h3>
            <div className="exam-progress">
              Câu {currentQuestionIndex + 1} / {selectedExam.questions.length}
            </div>
          </div>
        </div>

        {/* Fixed Timer */}
        <div className="timer-fixed">
          <Timer
            duration={selectedExam.duration}
            onTimeUp={handleTimeUp}
            isActive={isExamActive}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>

        {/* Main Content */}
        <div className="exam-content">
          <Question
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={selectedExam.questions.length}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={userAnswers[currentQuestion.id]}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            onNavigate={handleNavigateToQuestion}
            answeredQuestions={answeredQuestions}
          />
        </div>

        <div className="exam-actions">
          <div className="progress-info">
            <span>
              Đã trả lời: {answeredQuestions.length}/
              {selectedExam.questions.length}
            </span>
          </div>

          <button className="submit-exam-button" onClick={handleSubmitExam}>
            📤 Nộp bài thi
          </button>
        </div>
      </div>
    );
  }

  // Render result view
  if (currentView === "result") {
    return (
      <div className="exam-app">
        <ExamResult
          examData={selectedExam}
          userAnswers={userAnswers}
          timeSpent={timeSpent}
          onRetakeExam={handleRetakeExam}
          onBackToHome={handleBackToHome}
        />
      </div>
    );
  }

  return null;
};

export default ExamApp;
