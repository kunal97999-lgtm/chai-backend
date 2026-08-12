import { Component } from "react";

/*
  Error boundaries MUST be class components — React doesn't support this
  as a hook yet. Wrap your whole app with it in App.jsx (or main.jsx):

    <ErrorBoundary>
      <App />
    </ErrorBoundary>

  This only catches errors thrown during render, not inside event handlers
  or async code (those need their own try/catch, which we already added
  around API calls).
*/

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0B0F] text-[#F5F3EE] font-sans flex flex-col items-center justify-center px-4 text-center">
          <span className="text-5xl mb-4">⚠️</span>
          <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-sm text-[#8B8D98] max-w-sm mb-6">
            An unexpected error crashed this page. Try reloading — if it keeps
            happening, check the browser console for details.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-full bg-[#6C5CE7] hover:bg-[#5b4bd6] text-sm font-medium transition-colors"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
