package com.agri.portal.dto;

public class AdminDashboardStatsResponse {

    private long totalUsers;
    private long totalLandowners;
    private long totalFarmers;
    private long totalListings;
    private long availableListings;
    private long leasedListings;
    private long totalApplications;
    private long pendingApplications;
    private long approvedApplications;
    private long activeLeases;
    private long pendingReports;

    public AdminDashboardStatsResponse() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalLandowners() {
        return totalLandowners;
    }

    public void setTotalLandowners(long totalLandowners) {
        this.totalLandowners = totalLandowners;
    }

    public long getTotalFarmers() {
        return totalFarmers;
    }

    public void setTotalFarmers(long totalFarmers) {
        this.totalFarmers = totalFarmers;
    }

    public long getTotalListings() {
        return totalListings;
    }

    public void setTotalListings(long totalListings) {
        this.totalListings = totalListings;
    }

    public long getAvailableListings() {
        return availableListings;
    }

    public void setAvailableListings(long availableListings) {
        this.availableListings = availableListings;
    }

    public long getLeasedListings() {
        return leasedListings;
    }

    public void setLeasedListings(long leasedListings) {
        this.leasedListings = leasedListings;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getPendingApplications() {
        return pendingApplications;
    }

    public void setPendingApplications(long pendingApplications) {
        this.pendingApplications = pendingApplications;
    }

    public long getApprovedApplications() {
        return approvedApplications;
    }

    public void setApprovedApplications(long approvedApplications) {
        this.approvedApplications = approvedApplications;
    }

    public long getActiveLeases() {
        return activeLeases;
    }

    public void setActiveLeases(long activeLeases) {
        this.activeLeases = activeLeases;
    }

    public long getPendingReports() {
        return pendingReports;
    }

    public void setPendingReports(long pendingReports) {
        this.pendingReports = pendingReports;
    }
}

