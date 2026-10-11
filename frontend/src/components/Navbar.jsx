import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, isLandowner, isFarmer, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            backgroundColor: 'var(--primary)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '20px'
          }}>
            🌱
          </div>
          <div>
            <div style={{
              fontSize: '20px',
              fontWeight: '800',
              color: 'var(--primary-dark)',
              lineHeight: '1.1'
            }}>
              Agri<span style={{ color: 'var(--primary-mint)' }}>Lease</span>
            </div>
            <div style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              Farmland Portal
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <Link to="/" style={{
            fontWeight: '600',
            fontSize: '14px',
            color: isActive('/') ? 'var(--primary)' : 'var(--text-body)'
          }}>
            Home
          </Link>

          <Link to="/lands" style={{
            fontWeight: '600',
            fontSize: '14px',
            color: isActive('/lands') ? 'var(--primary)' : 'var(--text-body)'
          }}>
            Browse Lands
          </Link>

          {/* Role specific links */}
          {isAuthenticated && (
            <>
              {isFarmer && (
                <>
                  <Link to="/farmer-dashboard" style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: isActive('/farmer-dashboard') ? 'var(--primary)' : 'var(--text-body)'
                  }}>
                    Dashboard
                  </Link>
                  <Link to="/my-applications" style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: isActive('/my-applications') ? 'var(--primary)' : 'var(--text-body)'
                  }}>
                    My Applications
                  </Link>
                  <Link to="/my-leases" style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: isActive('/my-leases') ? 'var(--primary)' : 'var(--text-body)'
                  }}>
                    My Leases
                  </Link>
                </>
              )}

              {isLandowner && (
                <>
                  <Link to="/landowner-dashboard" style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: isActive('/landowner-dashboard') ? 'var(--primary)' : 'var(--text-body)'
                  }}>
                    Dashboard
                  </Link>
                  <Link to="/my-listings" style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: isActive('/my-listings') ? 'var(--primary)' : 'var(--text-body)'
                  }}>
                    My Listings
                  </Link>
                  <Link to="/received-applications" style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: isActive('/received-applications') ? 'var(--primary)' : 'var(--text-body)'
                  }}>
                    Received Apps
                  </Link>
                  <Link to="/my-leases" style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: isActive('/my-leases') ? 'var(--primary)' : 'var(--text-body)'
                  }}>
                    My Leases
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link to="/admin-dashboard" style={{
                  fontWeight: '600',
                  fontSize: '14px',
                  color: isActive('/admin-dashboard') ? 'var(--primary)' : 'var(--text-body)'
                }}>
                  Admin Portal
                </Link>
              )}
            </>
          )}
        </div>

        {/* Auth Actions / Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <>
              {isLandowner && (
                <Link to="/add-land" className="btn btn-primary btn-sm">
                  + Add Land
                </Link>
              )}

              <Link to="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: 'var(--primary-pale)',
                borderRadius: 'var(--radius-full)',
                textDecoration: 'none'
              }}>
                <span style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  {user?.fullName?.charAt(0) || 'U'}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary-dark)' }}>
                  {user?.fullName?.split(' ')[0]}
                </span>
                <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                  {user?.role === 'ROLE_LANDOWNER' ? 'Owner' : user?.role === 'ROLE_FARMER' ? 'Farmer' : 'Admin'}
                </span>
              </Link>

              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

