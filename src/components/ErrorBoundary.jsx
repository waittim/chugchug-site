import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled render error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            <h1 className="error-boundary-title">吨吨吨 · ChugChug</h1>
            <p className="error-boundary-subtitle">
              页面加载遇到了一点小状况 / Something went wrong
            </p>
            <button
              type="button"
              className="error-boundary-button"
              onClick={this.handleReload}
            >
              刷新页面 / Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
