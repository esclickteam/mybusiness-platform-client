import React from 'react';
import i18n from '../i18n/i18n';
import { getTextDirection } from '../i18n/localeUtils';

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
        <div dir={getTextDirection(i18n.language)} style={{ padding: "2rem", textAlign: "center" }}>
          <h1>{i18n.t("leftover.appError.title")}</h1>
          <p>{i18n.t("leftover.errors.refreshOrSupport")}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
