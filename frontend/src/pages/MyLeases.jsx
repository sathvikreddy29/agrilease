import React, { useState, useEffect } from 'react';
import { leaseApi } from '../api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export const MyLeases = () => {
  const { user } = useAuth();
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLease, setSelectedLease] = useState(null);

  useEffect(() => {
    const fetchLeases = async () => {
      try {
        const res = await leaseApi.getMyLeases();
        if (res.data?.success) {
          setLeases(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load leases:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeases();
  }, []);

  if (loading) return <LoadingSpinner text="Fetching your lease agreements..." />;

  return (
    <div className="container page-container">
      <div className="page-header">
        <h1 className="page-title">📑 Farmland Lease Agreements</h1>
        <p className="page-subtitle">
          Digital records of committed agricultural tenancies, active acreages, and agreed rental terms.
        </p>
      </div>

      {leases.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {leases.map((lease) => {
            const isOwner = user?.role === 'ROLE_LANDOWNER';
            const counterpartyName = isOwner ? lease.farmerName : lease.landownerName;
            const counterpartyLabel = isOwner ? 'Cultivator / Lessee' : 'Landowner / Lessor';

            return (
              <div key={lease.id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px', color: 'var(--primary)', textTransform: 'uppercase' }}>
                      Agreement #{lease.agreementNumber}
                    </span>
                    <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', marginTop: '2px' }}>
                      {lease.landTitle}
                    </h3>
                  </div>
                  <span className={`badge ${lease.status === 'ACTIVE' ? 'badge-success' : 'badge-info'}`}>
                    {lease.status}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  📍 {lease.landVillage}, {lease.landDistrict}, {lease.landState}
                </div>

                <div className="land-card-specs" style={{ marginBottom: '16px' }}>
                  <div className="spec-item">
                    <span className="spec-label">Leased Acreage</span>
                    <span className="spec-value">{lease.leasedAcreage} Acres</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Agreed Rent</span>
                    <span className="spec-value">₹{Number(lease.rentAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Start Date</span>
                    <span className="spec-value">{lease.startDate}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Duration</span>
                    <span className="spec-value">{lease.durationMonths} Months</span>
                  </div>
                </div>

                <div style={{
                  padding: '12px',
                  backgroundColor: '#f8faf8',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                    {counterpartyLabel}
                  </div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                    {counterpartyName}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    📞 {isOwner ? lease.farmerPhone : lease.landownerPhone || 'Provided in contract'}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLease(lease)}
                  className="btn btn-outline btn-block btn-sm"
                >
                  📄 View Full Agreement Details
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state card">
          <div className="empty-state-icon">📑</div>
          <h3 className="empty-state-title">No lease agreements yet</h3>
          <p className="empty-state-text">
            Lease records are automatically generated when a landowner approves a farmer's application.
          </p>
        </div>
      )}

      {/* Full Agreement Modal */}
      {selectedLease && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '680px' }}>
            <div className="card-header" style={{ backgroundColor: 'var(--primary-pale)' }}>
              <div>
                <span className="badge badge-primary">Record of Agreed Tenancy</span>
                <h3 className="card-title" style={{ marginTop: '4px' }}>
                  Agreement #{selectedLease.agreementNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLease(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>LESSOR (LANDOWNER)</div>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{selectedLease.landownerName}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selectedLease.landownerEmail}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selectedLease.landownerPhone}</div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>LESSEE (FARMER)</div>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{selectedLease.farmerName}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selectedLease.farmerEmail}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selectedLease.farmerPhone}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                  Property & Term Details
                </div>
                <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                  • <strong>Farmland:</strong> {selectedLease.landTitle} ({selectedLease.landAddress}, {selectedLease.landVillage}, {selectedLease.landDistrict})<br/>
                  • <strong>Leased Acreage:</strong> {selectedLease.leasedAcreage} Acres<br/>
                  • <strong>Total Agreed Consideration:</strong> ₹{Number(selectedLease.rentAmount).toLocaleString('en-IN')}<br/>
                  • <strong>Period:</strong> {selectedLease.startDate} to {selectedLease.endDate} ({selectedLease.durationMonths} Months)
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                  Agreed Terms & Conditions
                </div>
                <div style={{
                  backgroundColor: '#f8faf8',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-line'
                }}>
                  {selectedLease.termsAndConditions || 'Standard agricultural lease terms agreed between parties.'}
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#fffbeb',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                color: '#92400e',
                lineHeight: '1.5'
              }}>
                ⚖️ <strong>Legal Note:</strong> This digital lease record documents mutual parameters established through AgriLease. Statutory agricultural tenancy registration should be conducted before local revenue authorities in compliance with applicable State Land Leasing Acts.
              </div>
            </div>

            <div className="card-footer">
              <button onClick={() => setSelectedLease(null)} className="btn btn-outline btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeases;

