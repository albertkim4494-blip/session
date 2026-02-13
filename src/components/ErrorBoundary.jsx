import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info?.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ fontSize: 32 }}>:(</div>
          <div style={styles.title}>Something went wrong</div>
          <div style={styles.subtitle}>
            The app hit an unexpected error. Your data is safe.
          </div>
          {this.state.error && (
            <div style={styles.errorBox}>
              {String(this.state.error.message || this.state.error).slice(0, 200)}
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button style={styles.primaryBtn} onClick={this.handleReload}>
              Reload App
            </button>
            <button style={styles.secondaryBtn} onClick={this.handleReset}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d1117",
    color: "#e8eef7",
    padding: 20,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 12,
    maxWidth: 360,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    lineHeight: 1.5,
  },
  errorBox: {
    fontSize: 12,
    fontFamily: "monospace",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    padding: "8px 12px",
    maxWidth: "100%",
    wordBreak: "break-word",
    opacity: 0.5,
  },
  primaryBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    border: "none",
    background: "#1a2744",
    color: "#e8eef7",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent",
    color: "#e8eef7",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
};
