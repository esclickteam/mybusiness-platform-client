import React from 'react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  // תופס את השגיאה ומעדכן את ה-state
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // תופס את פרטי השגיאה
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // הצג הודעה מותאמת אישית במקרה של שגיאה
      return (
        <div>
          <h1>התרחשה שגיאה במהלך השמירה</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    // אם אין שגיאה, הצג את הרכיב הפנימי
    return this.props.children;
  }
}

export default ErrorBoundary;
