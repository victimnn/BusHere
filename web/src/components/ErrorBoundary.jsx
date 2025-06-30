import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container p-5 text-center">
          <h1 className="text-danger mb-3">Algo deu errado.</h1>
          <p className="text-muted">Pedimos desculpas pelo inconveniente. Por favor, tente recarregar a página.</p>
          {/* Optionally, display error details in development mode */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="text-start mt-4 p-3 bg-light border rounded">
              <summary>Detalhes do Erro</summary>
              <pre className="mt-2 p-2 bg-white border rounded overflow-auto" style={{ maxHeight: '300px' }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>Recarregar Página</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
