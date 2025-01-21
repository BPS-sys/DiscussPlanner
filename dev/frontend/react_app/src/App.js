import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// components
import DiscussPage from './pages/DiscussPage';
import HomePage from './pages/HomePage';
import NotionCallbackHandler from './pages/auth/notion/Callback';
import NotionSuccess from './pages/auth/notion/Success';
import ProjectPage from './pages/ProjectPage';
import LoginPage from './pages/LoginPage';

import { MicProvider } from './components/MicContext';
import { DrawerProvider } from './components/DrawerContext';
import { FastAPIProvider } from './components/FastAPIContext';

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
      <MicProvider>
        <DrawerProvider>
          <FastAPIProvider>
            <BrowserRouter>
              <Routes>
                <Route path={`/`} element={<HomePage />} />
                <Route path={`/LoginPage`} element={<LoginPage />} />
                <Route path={`/ProjectPage`} element={<ProjectPage />} />
                <Route path={`/DiscussPage`} element={<DiscussPage />} />
                <Route path="/auth/notion/callback" element={<NotionCallbackHandler />} />
                <Route path="/auth/notion/success" element={<NotionSuccess />} />
              </Routes>
            </BrowserRouter>
          </FastAPIProvider>
        </DrawerProvider>
      </MicProvider>
    </div>
  );
}

export default App;
