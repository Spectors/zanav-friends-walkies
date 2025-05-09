
import { createRoot } from 'react-dom/client';
import React, { StrictMode } from 'react';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");

// Basic error boundary to catch and display errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">שגיאה בטעינת האפליקציה</h2>
            <p className="mb-4">אירעה שגיאה בזמן טעינת האפליקציה. ייתכן שהדבר נובע מחוסר בהגדרת פרטי התחברות ל-Supabase.</p>
            <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-40">
              <pre className="text-sm">{this.state.error?.toString()}</pre>
            </div>
            <p className="text-sm text-gray-600">
              יש להגדיר את משתני הסביבה VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
              onClick={() => window.location.reload()}
            >
              נסה שוב
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error handling wrapper component
const AppWithErrorHandling = () => {
  return (
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
};

if (rootElement) {
  createRoot(rootElement).render(<AppWithErrorHandling />);
} else {
  console.error("Root element not found!");
}
