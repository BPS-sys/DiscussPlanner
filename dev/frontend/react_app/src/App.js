import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DiscussPage from './pages/DiscussPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
       */}
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<HomePage />} />
          <Route path={`/DiscussPage`} element={<DiscussPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
