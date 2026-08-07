import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0A0B0D', color: '#00E5FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'monospace' }}>
          <div style={{ maxWidth: '600px', width: '100%', padding: '32px', background: 'rgba(13, 17, 26, 0.95)', border: '1px solid rgba(0, 229, 255, 0.4)', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 0 30px rgba(0, 229, 255, 0.2)' }}>
            <h1 style={{ fontSize: '1.6rem', color: '#00E5FF', margin: 0 }}>[SYSTEM RECOVERY // SKILLSYNC AI]</h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              SkillSync AI detected a local session state mismatch.
            </p>
            <div style={{ padding: '12px', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.3)', color: '#ec4899', fontSize: '0.8rem', borderRadius: '8px', textAlign: 'left', wordBreak: 'break-word' }}>
              Error: {this.state.error ? this.state.error.toString() : 'State Mismatch'}
            </div>
            <button
              onClick={this.handleReset}
              style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #00E5FF 0%, #3b82f6 100%)', color: '#000', fontWeight: 800, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '1px' }}
            >
              RESET LOCAL STORAGE & RELAUNCH PLATFORM ↗
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
