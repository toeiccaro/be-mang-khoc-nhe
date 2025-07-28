import React, { useState, useEffect } from 'react';
import './Question.css';

const Question = ({ 
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  selectedAnswer = null,
  showResult = false,
  onNext,
  onPrevious,
  onNavigate,
  answeredQuestions = []
}) => {
  const [currentAnswer, setCurrentAnswer] = useState(selectedAnswer);
  const [isAnimating, setIsAnimating] = useState(false);

  // Cập nhật answer khi question thay đổi
  useEffect(() => {
    setCurrentAnswer(selectedAnswer);
  }, [selectedAnswer, question.id]);

  // Xử lý khi chọn đáp án
  const handleAnswerSelect = (optionKey) => {
    if (showResult) return; // Không cho phép thay đổi khi đang xem kết quả

    setCurrentAnswer(optionKey);
    if (onAnswerSelect) {
      onAnswerSelect(question.id, optionKey);
    }
  };

  // Xử lý navigation với animation
  const handleNavigation = (direction) => {
    setIsAnimating(true);
    setTimeout(() => {
      if (direction === 'next' && onNext) {
        onNext();
      } else if (direction === 'previous' && onPrevious) {
        onPrevious();
      }
      setIsAnimating(false);
    }, 150);
  };

  // Xử lý jump to question
  const handleQuestionJump = (questionIndex) => {
    if (onNavigate) {
      setIsAnimating(true);
      setTimeout(() => {
        onNavigate(questionIndex);
        setIsAnimating(false);
      }, 150);
    }
  };

  // Kiểm tra đáp án đúng/sai khi show result
  const getOptionClass = (optionKey) => {
    let classes = 'option';
    
    if (currentAnswer === optionKey) {
      classes += ' selected';
    }
    
    if (showResult) {
      if (optionKey === question.correctAnswer) {
        classes += ' correct';
      } else if (currentAnswer === optionKey && optionKey !== question.correctAnswer) {
        classes += ' incorrect';
      }
    }
    
    return classes;
  };

  // Tạo danh sách câu hỏi để navigation
  const renderQuestionNavigation = () => {
    const questions = Array.from({ length: totalQuestions }, (_, index) => index + 1);
    
    return (
      <div className="question-navigation">
        <h4>Câu hỏi:</h4>
        <div className="question-grid">
          {questions.map((num) => {
            const isAnswered = answeredQuestions.includes(num);
            const isCurrent = num === questionNumber;
            
            return (
              <button
                key={num}
                className={`nav-question ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                onClick={() => handleQuestionJump(num - 1)}
                disabled={showResult}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!question) {
    return (
      <div className="question-container">
        <div className="question-error">
          <p>❌ Không tìm thấy câu hỏi</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`question-container ${isAnimating ? 'animating' : ''}`}>
      {/* Header với thông tin câu hỏi */}
      <div className="question-header">
        <div className="question-info">
          <span className="question-number">
            Câu {questionNumber} / {totalQuestions}
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        
        {showResult && (
          <div className="result-indicator">
            {currentAnswer === question.correctAnswer ? (
              <span className="correct-badge">✅ Đúng</span>
            ) : (
              <span className="incorrect-badge">❌ Sai</span>
            )}
          </div>
        )}
      </div>

      {/* Nội dung câu hỏi */}
      <div className="question-content">
        <div className="question-text">
          <h3>{question.question}</h3>
        </div>

        <div className="options-container">
          {Object.entries(question.options).map(([key, value]) => (
            <div
              key={key}
              className={getOptionClass(key)}
              onClick={() => handleAnswerSelect(key)}
            >
              <div className="option-marker">
                <span className="option-letter">{key}</span>
              </div>
              <div className="option-text">
                {value}
              </div>
              {showResult && key === question.correctAnswer && (
                <div className="correct-icon">✓</div>
              )}
            </div>
          ))}
        </div>

        {showResult && (
          <div className="answer-explanation">
            <p><strong>Đáp án đúng:</strong> {question.correctAnswer} - {question.options[question.correctAnswer]}</p>
            {currentAnswer && currentAnswer !== question.correctAnswer && (
              <p><strong>Bạn đã chọn:</strong> {currentAnswer} - {question.options[currentAnswer]}</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="question-navigation-buttons">
        <button
          className="nav-btn prev-btn"
          onClick={() => handleNavigation('previous')}
          disabled={questionNumber === 1}
        >
          ← Câu trước
        </button>
        
        <span className="question-status">
          {currentAnswer ? '✅ Đã trả lời' : '⏳ Chưa trả lời'}
        </span>
        
        <button
          className="nav-btn next-btn"
          onClick={() => handleNavigation('next')}
          disabled={questionNumber === totalQuestions}
        >
          Câu sau →
        </button>
      </div>

      {/* Question navigation grid */}
      {renderQuestionNavigation()}
    </div>
  );
};

export default Question;
