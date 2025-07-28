import React, { useState, useEffect, useCallback } from 'react';
import './Timer.css';

const Timer = ({ 
  duration = 30, // thời gian thi tính bằng phút
  onTimeUp,
  isActive = false,
  onTimeUpdate
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // chuyển đổi sang giây
  const [isRunning, setIsRunning] = useState(false);

  // Format thời gian thành MM:SS
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Khởi động timer khi isActive = true
  useEffect(() => {
    if (isActive && !isRunning) {
      setIsRunning(true);
    }
  }, [isActive, isRunning]);

  // Đếm ngược
  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          
          // Gọi callback để cập nhật thời gian cho component cha
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }

          // Kiểm tra nếu hết thời gian
          if (newTime <= 0) {
            setIsRunning(false);
            if (onTimeUp) {
              onTimeUp();
            }
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else if (!isRunning) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp, onTimeUpdate]);

  // Tính toán màu sắc dựa trên thời gian còn lại
  const getTimerColor = () => {
    const totalSeconds = duration * 60;
    const percentage = (timeLeft / totalSeconds) * 100;
    
    if (percentage > 50) return '#4CAF50'; // Xanh lá
    if (percentage > 25) return '#FF9800'; // Cam
    return '#F44336'; // Đỏ
  };

  // Tính toán độ rộng của thanh progress
  const getProgressWidth = () => {
    const totalSeconds = duration * 60;
    return (timeLeft / totalSeconds) * 100;
  };

  // Kiểm tra nếu thời gian sắp hết (dưới 5 phút)
  const isTimeWarning = timeLeft <= 300; // 5 phút = 300 giây
  const isTimeCritical = timeLeft <= 60; // 1 phút = 60 giây

  return (
    <div className={`timer-container ${isTimeWarning ? 'warning' : ''} ${isTimeCritical ? 'critical' : ''}`}>
      <div className="timer-header">
        <h3>Thời gian còn lại</h3>
        <div className="timer-status">
          {isRunning ? (
            <span className="status-running">Đang thi</span>
          ) : timeLeft <= 0 ? (
            <span className="status-finished">Hết giờ</span>
          ) : (
            <span className="status-paused">Tạm dừng</span>
          )}
        </div>
      </div>
      
      <div className="timer-display">
        <div 
          className="timer-text"
          style={{ color: getTimerColor() }}
        >
          {formatTime(timeLeft)}
        </div>
        
        <div className="timer-progress-container">
          <div 
            className="timer-progress-bar"
            style={{ 
              width: `${getProgressWidth()}%`,
              backgroundColor: getTimerColor()
            }}
          />
        </div>
      </div>

      <div className="timer-info">
        <div className="time-info">
          <span>Tổng thời gian: {duration} phút</span>
        </div>
        
        {isTimeWarning && (
          <div className="time-warning">
            {isTimeCritical ? (
              <span className="critical-warning">⚠️ Chỉ còn dưới 1 phút!</span>
            ) : (
              <span className="normal-warning">⏰ Chỉ còn dưới 5 phút!</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;
