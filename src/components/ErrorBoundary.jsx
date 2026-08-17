import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div dir="rtl" style={{ padding: "2rem", textAlign: "center" }}>
          <h1>אירעה שגיאה זמנית</h1>
          <p>נסו לרענן את העמוד. אם הבעיה נמשכת, פנו לתמיכה.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
