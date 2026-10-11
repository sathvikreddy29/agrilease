import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import LandownerDashboard from './pages/LandownerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BrowseLand from './pages/BrowseLand';
import LandDetails from './pages/LandDetails';
import AddLand from './pages/AddLand';
import EditLand from './pages/EditLand';
import MyListings from './pages/MyListings';
import ApplyLease from './pages/ApplyLease';
import MyApplications from './pages/MyApplications';
import ReceivedApplications from './pages/ReceivedApplications';
import MyLeases from './pages/MyLeases';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/lands" element={<BrowseLand />} />
              <Route path="/lands/:id" element={<LandDetails />} />

              {/* Farmer Routes */}
              <Route
                path="/farmer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_FARMER']}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/apply/:id"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_FARMER']}>
                    <ApplyLease />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_FARMER']}>
                    <MyApplications />
                  </ProtectedRoute>
                }
              />

              {/* Landowner Routes */}
              <Route
                path="/landowner-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_LANDOWNER', 'ROLE_ADMIN']}>
                    <LandownerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-land"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_LANDOWNER', 'ROLE_ADMIN']}>
                    <AddLand />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-land/:id"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_LANDOWNER', 'ROLE_ADMIN']}>
                    <EditLand />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-listings"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_LANDOWNER', 'ROLE_ADMIN']}>
                    <MyListings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/received-applications"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_LANDOWNER', 'ROLE_ADMIN']}>
                    <ReceivedApplications />
                  </ProtectedRoute>
                }
              />

              {/* Shared Authenticated Routes */}
              <Route
                path="/my-leases"
                element={
                  <ProtectedRoute>
                    <MyLeases />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Administrator Routes */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
