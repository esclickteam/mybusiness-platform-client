import React from 'react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  // Catches the error and updates the state
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Catches the error details
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Display a custom message in case of an error
      return (
        <div>
          <h1>An error occurred during saving</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    // If there is no error, display the inner component
    return this.props.children;
  }
}

export default ErrorBoundary;
