package com.agri.portal.controller;

import com.agri.portal.dto.*;
import com.agri.portal.entity.LandStatus;
import com.agri.portal.entity.ReportStatus;
import com.agri.portal.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardStatsResponse>> getDashboardStats() {
        AdminDashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard stats retrieved successfully", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        List<UserProfileResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("All users retrieved successfully", users));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateRequest request
    ) {
        UserProfileResponse user = adminService.updateUserStatus(id, request.getActive());
        return ResponseEntity.ok(ApiResponse.success("User account status updated successfully", user));
    }

    @GetMapping("/listings")
    public ResponseEntity<ApiResponse<List<LandListingResponse>>> getAllListings() {
        List<LandListingResponse> listings = adminService.getAllListings();
        return ResponseEntity.ok(ApiResponse.success("All listings retrieved for moderation", listings));
    }

    @PatchMapping("/listings/{id}/status")
    public ResponseEntity<ApiResponse<LandListingResponse>> updateListingStatus(
            @PathVariable Long id,
            @RequestParam LandStatus status
    ) {
        LandListingResponse updated = adminService.updateListingStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Listing status updated successfully", updated));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getAllReports() {
        List<ReportResponse> reports = adminService.getAllReports();
        return ResponseEntity.ok(ApiResponse.success("Reported listings retrieved successfully", reports));
    }

    @PatchMapping("/reports/{id}/status")
    public ResponseEntity<ApiResponse<ReportResponse>> updateReportStatus(
            @PathVariable Long id,
            @RequestParam ReportStatus status
    ) {
        ReportResponse report = adminService.updateReportStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Report status updated successfully", report));
    }
}

