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

  // Captures the error details
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Display a custom message when an error occurs
      return (
        <div>
          <h1>An error occurred while saving.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    // If no error, render the child components
    return this.props.children;
  }
}

export default ErrorBoundary;
