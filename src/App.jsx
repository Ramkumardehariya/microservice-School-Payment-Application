// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import SchoolTransactions from './pages/SchoolTransactions';
import CheckStatus from './pages/CheckStatus';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/UI/LoadingSpinner';
import CreatePayment from './pages/CreatePayment';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route
                path="/create-payment"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreatePayment />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Transactions />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/school-transactions"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SchoolTransactions />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/check-status"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CheckStatus />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;