import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
if (process.env.NODE_ENV === "development") {
    // 開発環境ではStrictModeを無効化
    root.render(
        <App />
    );
  } else {
    // 本番環境ではStrictModeを有効化
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
