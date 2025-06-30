interface ErrorLogData {
  error: Error;
  errorInfo: ErrorInfo;
  errorId: string;
  context: string;
  componentStack: string;
  timestamp: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
}

interface ErrorCategory {
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recovery?: 'retry' | 'refresh' | 'navigate' | 'contact-support';
}

class ErrorLogger {
  private errorCount = 0;
  private errorHistory: ErrorLogData[] = [];
  private readonly maxHistorySize = 100;

  // Error categories for better organization
  private errorCategories: Record<string, ErrorCategory> = {
    'authentication': {
      name: 'Authentication Error',
      description: 'User authentication or authorization issues',
      severity: 'high',
      recovery: 'navigate'
    },
    'api-network': {
      name: 'API/Network Error',
      description: 'Failed API calls or network connectivity issues',
      severity: 'medium',
      recovery: 'retry'
    },
    'component-render': {
      name: 'Component Rendering Error',
      description: 'React component rendering or lifecycle issues',
      severity: 'medium',
      recovery: 'refresh'
    },
    'data-loading': {
      name: 'Data Loading Error',
      description: 'Issues with data fetching or processing',
      severity: 'medium',
      recovery: 'retry'
    },
    'form-validation': {
      name: 'Form Validation Error',
      description: 'Form input validation or submission issues',
      severity: 'low',
      recovery: 'retry'
    },
    'unknown': {
      name: 'Unknown Error',
      description: 'Uncategorized or unexpected errors',
      severity: 'medium',
      recovery: 'contact-support'
    }
  };

  logError(data: ErrorLogData): void {
    this.errorCount++;
    
    // Add additional context
    const enrichedData = {
      ...data,
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorCount: this.errorCount,
      category: this.categorizeError(data.error)
    };

    // Store in history
    this.errorHistory.push(enrichedData);
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error #${this.errorCount} - ${enrichedData.category.name}`);
      console.error('Error:', data.error);
      console.error('Component Stack:', data.componentStack);
      console.error('Context:', data.context);
      console.error('Error ID:', data.errorId);
      console.error('Timestamp:', data.timestamp);
      console.groupEnd();
    }

    // In production, you would send to your error tracking service
    // this.sendToErrorService(enrichedData);
  }

  private categorizeError(error: Error): ErrorCategory {
    const errorMessage = error.message.toLowerCase();
    const errorName = error.name.toLowerCase();

    // Authentication errors
    if (errorMessage.includes('auth') || errorMessage.includes('unauthorized') || 
        errorMessage.includes('forbidden') || errorName.includes('auth')) {
      return this.errorCategories.authentication;
    }

    // API/Network errors
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || 
        errorMessage.includes('api') || errorMessage.includes('http') ||
        errorName.includes('network') || errorName.includes('fetch')) {
      return this.errorCategories['api-network'];
    }

    // Component rendering errors
    if (errorMessage.includes('render') || errorMessage.includes('component') ||
        errorName.includes('react')) {
      return this.errorCategories['component-render'];
    }

    // Data loading errors
    if (errorMessage.includes('data') || errorMessage.includes('load') ||
        errorMessage.includes('parse') || errorMessage.includes('json')) {
      return this.errorCategories['data-loading'];
    }

    // Form validation errors
    if (errorMessage.includes('validation') || errorMessage.includes('form') ||
        errorMessage.includes('input') || errorMessage.includes('required')) {
      return this.errorCategories['form-validation'];
    }

    // Default to unknown
    return this.errorCategories.unknown;
  }

  getErrorHistory(): ErrorLogData[] {
    return [...this.errorHistory];
  }

  getErrorCount(): number {
    return this.errorCount;
  }

  getErrorStats(): {
    total: number;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
    recentErrors: ErrorLogData[];
  } {
    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    const recentErrors = this.errorHistory.slice(-10); // Last 10 errors

    this.errorHistory.forEach(error => {
      const category = this.categorizeError(error.error);
      
      // Count by category
      byCategory[category.name] = (byCategory[category.name] || 0) + 1;
      
      // Count by severity
      bySeverity[category.severity] = (bySeverity[category.severity] || 0) + 1;
    });

    return {
      total: this.errorCount,
      byCategory,
      bySeverity,
      recentErrors
    };
  }

  clearHistory(): void {
    this.errorHistory = [];
    this.errorCount = 0;
  }

  // Method to send errors to external service (implement as needed)
  private sendToErrorService(data: ErrorLogData): void {
    // In production, implement your error tracking service here
    // Examples: Sentry, LogRocket, Bugsnag, etc.
    
    // For now, we'll just log to console in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Error logged:', {
        id: data.errorId,
        message: data.error.message,
        context: data.context,
        timestamp: data.timestamp
      });
    }
  }
}

export const errorLogger = new ErrorLogger(); 