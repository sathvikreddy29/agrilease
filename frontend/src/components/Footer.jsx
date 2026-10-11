import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#081c15',
      color: '#d8f3dc',
      paddingTop: '60px',
      paddingBottom: '30px',
      borderTop: '4px solid var(--primary-mint)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '24px' }}>🌱</span>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff' }}>
                Agri<span style={{ color: 'var(--primary-mint)' }}>Lease</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#95d5b2', lineHeight: '1.7', marginBottom: '20px' }}>
              Bridging the gap between agricultural landowners and progressive farmers. Ensuring fair, transparent, and digitally managed farmland leasing.
            </p>
            <div style={{ fontSize: '13px', color: '#74c69d' }}>
              📍 Supporting agricultural communities across India
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '16px', marginBottom: '20px', fontWeight: '700' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link to="/lands" style={{ color: '#b7e4c7' }}>Browse Available Farmlands</Link></li>
              <li><Link to="/register" style={{ color: '#b7e4c7' }}>Register as Landowner</Link></li>
              <li><Link to="/register" style={{ color: '#b7e4c7' }}>Register as Farmer</Link></li>
              <li><Link to="/login" style={{ color: '#b7e4c7' }}>Member Sign In</Link></li>
            </ul>
          </div>

          {/* Landowner Resources */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '16px', marginBottom: '20px', fontWeight: '700' }}>
              Farmland Resources
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li style={{ color: '#b7e4c7' }}>🌾 Soil Quality Assessment</li>
              <li style={{ color: '#b7e4c7' }}>💧 Irrigation & Borewell Standards</li>
              <li style={{ color: '#b7e4c7' }}>📑 Digital Lease Documentation</li>
              <li style={{ color: '#b7e4c7' }}>⚖️ Tenancy Guidelines & Compliance</li>
            </ul>
          </div>

          {/* Legal Advisory */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '16px', marginBottom: '20px', fontWeight: '700' }}>
              Statutory Advisory
            </h4>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '12px',
              lineHeight: '1.6',
              color: '#d8f3dc'
            }}>
              AgriLease facilitates direct communication and records mutually agreed lease parameters. Formal tenancy registrations must adhere to relevant State Agricultural Land Leasing & Revenue Acts.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          color: '#74c69d',
          gap: '12px'
        }}>
          <div>
            © {new Date().getFullYear()} AgriLease Management System. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Secure BCrypt Encryption</span>
            <span>•</span>
            <span>RESTful Microservices</span>
            <span>•</span>
            <span>Role-Based Access</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

