import TunerInterface from './components/TunerInterface';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Pro Tuner <span className="highlight">AI</span></h1>
        <div className="header-controls">
          {/* Settings/Menu placeholder */}
        </div>
      </header>

      <main className="main-content">
        <div className="tuner-wrapper">
          <TunerInterface />
        </div>
      </main>

      <footer className="app-footer">
        <p>Professional Guitar Tuner</p>
      </footer>
    </div>
  );
}

export default App;
