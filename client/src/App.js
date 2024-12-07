import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';
import AddCase from './pages/addCase';
import AdminDashboard from './pages/adminDashboard';
import Bookmark from './pages/bookmark';
import CaseDetails from './pages/caseDetails';
import EditCase from './pages/editCase';
import Error404 from './pages/error404';
import SearchResults from './pages/searchResults';
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProtectedRoute from './components/ProtectedRoutes';
import PublicRoute from './components/PublicRoutes';
import RequestCase from './pages/requestCase';
import MyCases from './pages/MyCases'; // Import MyCases component

function App() {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* User-Specific Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookmark"
              element={
                <ProtectedRoute>
                  <Bookmark />
                </ProtectedRoute>
              }
            />
            <Route
              path="/case/:id"
              element={
                <ProtectedRoute>
                  <CaseDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/request-case"
              element={
                <ProtectedRoute>
                  <RequestCase />
                </ProtectedRoute>
              }
            />

            {/* Lawyer-Specific Route */}
            <Route
              path="/my-cases"
              element={
                <ProtectedRoute>
                  <MyCases />
                </ProtectedRoute>
              }
            />

            {/* Admin-Specific Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Add Case Route without :id */}
            <Route
              path="/add-case"
              element={
                <ProtectedRoute>
                  <AddCase />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-case/:id"
              element={
                <ProtectedRoute>
                  <EditCase />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
