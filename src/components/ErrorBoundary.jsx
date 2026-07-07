import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { Card, CardContent } from './Card';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Ground telemetry logger if available
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <Card className="max-w-md w-full border-red-100 shadow-lg">
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-12 w-12 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto border border-red-100">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">Application Error</h3>
                <p className="text-xs text-gray-500">
                  An unexpected error occurred while rendering this page segment.
                </p>
              </div>
              {this.state.error && (
                <pre className="p-3 bg-gray-50 border border-gray-150 rounded-lg text-[10px] text-gray-600 text-left overflow-auto max-h-32 font-mono">
                  {this.state.error.toString()}
                </pre>
              )}
              <Button
                variant="primary"
                onClick={this.handleReload}
                className="w-full text-xs font-semibold"
                leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              >
                Reload Application
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
