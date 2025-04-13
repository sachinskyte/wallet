
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import BugBounty from "./pages/BugBounty";
import SubmitReport from "./pages/SubmitReport";
import MyReports from "./pages/MyReports";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import ZeroDayDashboard from "./pages/ZeroDayDashboard";
import MainLayout from "./components/Layout/MainLayout";
import { useAuth } from "./context/AuthContext";

// Create query client for React Query
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
      <div className="animate-spin h-8 w-8 border-4 border-cyber-teal border-t-transparent rounded-full"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin route component - only accessible to admin users
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
      <div className="animate-spin h-8 w-8 border-4 border-cyber-teal border-t-transparent rounded-full"></div>
    </div>;
  }
  
  if (!user || user.id !== 'admin-id') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

// Auth route component - redirects to dashboard if already logged in
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
      <div className="animate-spin h-8 w-8 border-4 border-cyber-teal border-t-transparent rounded-full"></div>
    </div>;
  }
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public pages without sidebar */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } />
            <Route path="/signup" element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            } />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            
            {/* Protected pages with sidebar layout */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bug-bounty" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <BugBounty />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/submit-report" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SubmitReport />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-reports" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <MyReports />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <MainLayout>
                    <Admin />
                  </MainLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/zero-day-dashboard" 
              element={
                <AdminRoute>
                  <MainLayout>
                    <ZeroDayDashboard />
                  </MainLayout>
                </AdminRoute>
              } 
            />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
