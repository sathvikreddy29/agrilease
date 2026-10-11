import api from './client';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const landApi = {
  getLands: (params) => api.get('/lands', { params }),
  getLandById: (id) => api.get(`/lands/${id}`),
  createLand: (data) => api.post('/lands', data),
  updateLand: (id, data) => api.put(`/lands/${id}`, data),
  deleteLand: (id) => api.delete(`/lands/${id}`),
  getMyListings: () => api.get('/lands/my-listings'),
  reportLand: (id, data) => api.post(`/lands/${id}/report`, data)
};

export const applicationApi = {
  applyForLease: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my-applications'),
  getReceivedApplications: () => api.get('/applications/received'),
  approveApplication: (id) => api.patch(`/applications/${id}/approve`),
  rejectApplication: (id, reason) => api.patch(`/applications/${id}/reject`, { reason }),
  cancelApplication: (id) => api.patch(`/applications/${id}/cancel`)
};

export const leaseApi = {
  getMyLeases: () => api.get('/leases/my-leases'),
  getLeaseById: (id) => api.get(`/leases/${id}`)
};

export const adminApi = {
  getStats: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  updateUserStatus: (id, active) => api.patch(`/admin/users/${id}/status`, { active }),
  getListings: () => api.get('/admin/listings'),
  updateListingStatus: (id, status) => api.patch(`/admin/listings/${id}/status`, null, { params: { status } }),
  getReports: () => api.get('/admin/reports'),
  updateReportStatus: (id, status) => api.patch(`/admin/reports/${id}/status`, null, { params: { status } })
};

