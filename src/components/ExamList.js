import React, { useState, useEffect } from "react";
import "./ExamList.css";

const ExamList = ({ onExamSelect, selectedExamId = null, exams = [] }) => {
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dữ liệu đề thi
  useEffect(() => {
    const loadExams = async () => {
      try {
        setLoading(true);

        // Nếu có exams được truyền vào từ props, sử dụng nó
        if (exams && exams.length > 0) {
          setExamData(exams);
        } else {
          // Nếu không, load từ file JSON
          const response = await fetch("/data.json");
          if (!response.ok) {
            throw new Error("Không thể tải dữ liệu đề thi");
          }
          const data = await response.json();
          setExamData(data.exams || []);
        }

        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải đề thi:", err);
        setError(err.message);
        setExamData([]);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [exams]);

  // Xử lý khi click chọn đề thi
  const handleExamClick = (exam) => {
    if (onExamSelect) {
      onExamSelect(exam);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="exam-list-container">
        <div className="exam-list-header">
          <h2>Danh sách đề thi</h2>
        </div>
        <div className="exam-list-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách đề thi...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="exam-list-container">
        <div className="exam-list-header">
          <h2>Danh sách đề thi</h2>
        </div>
        <div className="exam-list-error">
          <p>❌ {error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (examData.length === 0) {
    return (
      <div className="exam-list-container">
        <div className="exam-list-header">
          <h2>Danh sách đề thi</h2>
        </div>
        <div className="exam-list-empty">
          <p>📝 Chưa có đề thi nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-list-container">
      <div className="exam-list-header">
        <h2>Danh sách đề thi</h2>
        <p className="exam-count">Có {examData.length} đề thi</p>
      </div>

      <div className="exam-list-scroll">
        <div className="exam-list">
          {examData.map((exam) => (
            <div
              key={exam.id}
              className={`exam-card ${
                selectedExamId === exam.id ? "selected" : ""
              }`}
              onClick={() => handleExamClick(exam)}
            >
              <div className="exam-card-header">
                <h3 className="exam-title">{exam.name}</h3>
                <div className="exam-badge">{exam.totalQuestions} câu</div>
              </div>

              <div className="exam-card-body">
                <p className="exam-description">
                  {exam.description || "Đề thi trắc nghiệm"}
                </p>

                <div className="exam-info">
                  <div className="info-item">
                    <span className="info-icon">⏱️</span>
                    <span>{exam.duration} phút</span>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">📋</span>
                    <span>{exam.totalQuestions} câu hỏi</span>
                  </div>
                </div>
              </div>

              <div className="exam-card-footer">
                <button className="start-exam-btn">
                  {selectedExamId === exam.id ? "Đã chọn" : "Chọn đề thi"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="exam-list-footer">
        <p className="scroll-hint">← Vuốt để xem thêm đề thi →</p>
      </div>
    </div>
  );
};

export default ExamList;
