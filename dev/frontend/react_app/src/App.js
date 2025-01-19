import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DiscussPage from './pages/DiscussPage';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';

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
                <Route path={`/DiscussPage`} element={<DiscussPage />} />
                <Route path={`/ProjectPage`} element={<ProjectPage />} />
              </Routes>
            </BrowserRouter>
          </FastAPIProvider>
        </DrawerProvider>
      </MicProvider>
    </div>
  );
}

export default App;
