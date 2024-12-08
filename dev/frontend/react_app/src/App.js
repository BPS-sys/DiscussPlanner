import logo from './logo.svg';
import './App.css';
import { DescriptionDP } from './components/DescriptionDP';
import MainAppBar from './components/MainAppBar';
import { DetailDescriptionDP } from './components/DetailDescriptionDP';

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
      <MainAppBar></MainAppBar>
      <DescriptionDP></DescriptionDP>
      <DetailDescriptionDP></DetailDescriptionDP>
      
    </div>
  );
}

export default App;
