import React, { useState, useEffect } from 'react';
import './TimerTest_01.css';
import './TimerTest_02.css';

export function TimerTest() {
  const [mode, setMode] = useState('pomo');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [circleDashOffset, setCircleDashOffset] = useState(0);

  const totalTime = mode === 'pomo' ? 25 * 60 : mode === 'short' ? 5 * 60 : 15 * 60;

  const toggleTimer = () => {
    setIsTimerRunning(prevState => !prevState);
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
    if (event.target.value === 'pomo') setTimeLeft(25 * 60);
    if (event.target.value === 'short') setTimeLeft(5 * 60);
    if (event.target.value === 'long') setTimeLeft(15 * 60);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    const offset = (1 - timeLeft / totalTime) * 301.593;
    setCircleDashOffset(offset);
  }, [timeLeft]);

  return (
    <div className="pomodoro-app">
      <form className="controls">
        <input
          type="radio"
          id="pomo"
          name="mode"
          value="pomo"
          checked={mode === 'pomo'}
          onChange={handleModeChange}
        />
        <label htmlFor="pomo" className="controls__button">Discussion</label>

        <input
          type="radio"
          id="short"
          name="mode"
          value="short"
          checked={mode === 'short'}
          onChange={handleModeChange}
        />
        <label htmlFor="short" className="controls__button">Short Break</label>

        <input
          type="radio"
          id="long"
          name="mode"
          value="long"
          checked={mode === 'long'}
          onChange={handleModeChange}
        />
        <label htmlFor="long" className="controls__button">Long Break</label>
      </form>

      <div className="timer" onClick={toggleTimer}>
        <div className="timer__display">
          <div data-test-id="CircularProgressbarWithChildren">
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <svg
                className="CircularProgressbar"
                viewBox="0 0 100 100"
                data-test-id="CircularProgressbar"
              >
                <path
                  className="CircularProgressbar-trail"
                  d="M 50,50 m 0,-48 a 48,48 0 1 1 0,96 a 48,48 0 1 1 0,-96"
                  strokeWidth="4"
                  fillOpacity="0"
                  style={{
                    stroke: 'none',
                    strokeDasharray: '301.593px, 301.593px',
                    strokeDashoffset: '0px',
                  }}
                />
                <path
                  className="CircularProgressbar-path"
                  d="M 50,50 m 0,-48 a 48,48 0 1 1 0,96 a 48,48 0 1 1 0,-96"
                  strokeWidth="4"
                  fillOpacity="0"
                  style={{
                    stroke: '#41b3ec',
                    transitionDuration: '0.5s',
                    strokeDasharray: '301.593px, 301.593px',
                    strokeDashoffset: circleDashOffset,
                  }}
                />
                <text
                  className="CircularProgressbar-text"
                  x="50"
                  y="50"
                  style={{ fill:'#000000' , fontSize: '28px' }}
                >
                  {formatTime(timeLeft)}
                </text>
              </svg>

              <div
                data-test-id="CircularProgressbarWithChildren__children"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  marginTop: '-100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <button
                  className="display__mute"
                  id="muteButton"
                  title="mute button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </button>

                <button className="display__start-pause">
                  {isTimerRunning ? 'PAUSE' : 'START'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimerTest;