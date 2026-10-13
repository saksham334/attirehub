import { Component } from "react";

// Catches rendering crashes in any child so the user never sees a blank page.
// Error boundaries must be class components.
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("UI crash:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="container py-5 text-center" role="alert">
        <h1 className="h3">Something went wrong</h1>
        <p className="text-muted">Please reload the page. If it keeps happening, try again later.</p>
        <button className="btn-attire" onClick={() => window.location.assign("/")}>
          Back to home
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;