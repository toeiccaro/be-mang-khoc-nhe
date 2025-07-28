import React, { useState, useMemo } from 'react';
import Question from './Question';
import './ExamResult.css';

const ExamResult = ({ 
  examData,
  userAnswers,
  timeSpent,
  onRetakeExam,
  onBackToHome
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(5); // Số câu hỏi hiển thị mỗi trang
  const [viewMode, setViewMode] = useState('summary'); // 'summary' hoặc 'detailed'

  // Tính toán kết quả
  const results = useMemo(() => {
    if (!examData || !userAnswers) return null;

    const totalQuestions = examData.questions.length;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unanswered = 0;

    const questionResults = examData.questions.map(question => {
      const userAnswer = userAnswers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      const isAnswered = userAnswer !== null && userAnswer !== undefined;

      if (isAnswered) {
        if (isCorrect) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      } else {
        unanswered++;
      }

      return {
        ...question,
        userAnswer,
        isCorrect,
        isAnswered
      };
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const grade = getGrade(score);

    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      unanswered,
      score,
      grade,
      questionResults
    };
  }, [examData, userAnswers]);

  // Tính toán pagination
  const paginationData = useMemo(() => {
    if (!results) return null;

    const totalPages = Math.ceil(results.questionResults.length / questionsPerPage);
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const currentQuestions = results.questionResults.slice(startIndex, endIndex);

    return {
      totalPages,
      currentQuestions,
      startIndex,
      endIndex: Math.min(endIndex, results.questionResults.length)
    };
  }, [results, currentPage, questionsPerPage]);

  // Xác định grade dựa trên điểm số
  function getGrade(score) {
    if (score >= 90) return { letter: 'A', color: '#28a745', description: 'Xuất sắc' };
    if (score >= 80) return { letter: 'B', color: '#17a2b8', description: 'Giỏi' };
    if (score >= 70) return { letter: 'C', color: '#ffc107', description: 'Khá' };
    if (score >= 60) return { letter: 'D', color: '#fd7e14', description: 'Trung bình' };
    return { letter: 'F', color: '#dc3545', description: 'Yếu' };
  }

  // Format thời gian
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Render pagination
  const renderPagination = () => {
    if (!paginationData || paginationData.totalPages <= 1) return null;

    const pages = Array.from({ length: paginationData.totalPages }, (_, i) => i + 1);

    return (
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Trước
        </button>

        <div className="pagination-numbers">
          {pages.map(page => (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === paginationData.totalPages}
        >
          Sau →
        </button>
      </div>
    );
  };

  // Render summary view
  const renderSummary = () => (
    <div className="result-summary">
      <div className="score-display">
        <div className="score-circle" style={{ borderColor: results.grade.color }}>
          <span className="score-number" style={{ color: results.grade.color }}>
            {results.score}%
          </span>
          <span className="score-grade" style={{ color: results.grade.color }}>
            {results.grade.letter}
          </span>
        </div>
        <div className="score-description">
          <h3 style={{ color: results.grade.color }}>{results.grade.description}</h3>
          <p>Bạn đã hoàn thành bài thi với điểm số {results.score}%</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item correct">
          <div className="stat-number">{results.correctAnswers}</div>
          <div className="stat-label">Câu đúng</div>
        </div>
        <div className="stat-item incorrect">
          <div className="stat-number">{results.incorrectAnswers}</div>
          <div className="stat-label">Câu sai</div>
        </div>
        <div className="stat-item unanswered">
          <div className="stat-number">{results.unanswered}</div>
          <div className="stat-label">Chưa trả lời</div>
        </div>
        <div className="stat-item time">
          <div className="stat-number">{formatTime(timeSpent)}</div>
          <div className="stat-label">Thời gian</div>
        </div>
      </div>

      <div className="result-chart">
        <div className="chart-bar">
          <div 
            className="chart-segment correct"
            style={{ width: `${(results.correctAnswers / results.totalQuestions) * 100}%` }}
          />
          <div 
            className="chart-segment incorrect"
            style={{ width: `${(results.incorrectAnswers / results.totalQuestions) * 100}%` }}
          />
          <div 
            className="chart-segment unanswered"
            style={{ width: `${(results.unanswered / results.totalQuestions) * 100}%` }}
          />
        </div>
        <div className="chart-labels">
          <span className="chart-label correct">Đúng ({results.correctAnswers})</span>
          <span className="chart-label incorrect">Sai ({results.incorrectAnswers})</span>
          <span className="chart-label unanswered">Chưa trả lời ({results.unanswered})</span>
        </div>
      </div>
    </div>
  );

  // Render detailed view
  const renderDetailed = () => (
    <div className="result-detailed">
      <div className="detailed-header">
        <h3>
          Chi tiết câu hỏi {paginationData.startIndex + 1} - {paginationData.endIndex} 
          / {results.totalQuestions}
        </h3>
      </div>

      <div className="questions-list">
        {paginationData.currentQuestions.map((question, index) => (
          <div key={question.id} className="question-result-item">
            <Question
              question={question}
              questionNumber={paginationData.startIndex + index + 1}
              totalQuestions={results.totalQuestions}
              selectedAnswer={question.userAnswer}
              showResult={true}
              onAnswerSelect={() => {}} // Disabled in result view
            />
          </div>
        ))}
      </div>

      {renderPagination()}
    </div>
  );

  if (!results) {
    return (
      <div className="exam-result-container">
        <div className="result-error">
          <p>❌ Không thể tải kết quả bài thi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-result-container">
      <div className="result-header">
        <h1>Kết quả bài thi</h1>
        <p className="exam-name">{examData.name}</p>
        
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'summary' ? 'active' : ''}`}
            onClick={() => setViewMode('summary')}
          >
            📊 Tổng quan
          </button>
          <button
            className={`toggle-btn ${viewMode === 'detailed' ? 'active' : ''}`}
            onClick={() => setViewMode('detailed')}
          >
            📝 Chi tiết
          </button>
        </div>
      </div>

      <div className="result-content">
        {viewMode === 'summary' ? renderSummary() : renderDetailed()}
      </div>

      <div className="result-actions">
        <button className="action-btn secondary" onClick={onBackToHome}>
          🏠 Về trang chủ
        </button>
        <button className="action-btn primary" onClick={onRetakeExam}>
          🔄 Làm lại bài thi
        </button>
      </div>
    </div>
  );
};

export default ExamResult;
