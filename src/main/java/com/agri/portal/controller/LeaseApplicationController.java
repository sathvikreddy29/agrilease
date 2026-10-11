package com.agri.portal.controller;

import com.agri.portal.dto.ApiResponse;
import com.agri.portal.dto.ApplicationActionRequest;
import com.agri.portal.dto.LeaseApplicationRequest;
import com.agri.portal.dto.LeaseApplicationResponse;
import com.agri.portal.service.LeaseApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class LeaseApplicationController {

    @Autowired
    private LeaseApplicationService leaseApplicationService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_FARMER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<LeaseApplicationResponse>> createApplication(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody LeaseApplicationRequest request
    ) {
        LeaseApplicationResponse app = leaseApplicationService.createApplication(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Lease application submitted successfully", app));
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasAnyAuthority('ROLE_FARMER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<LeaseApplicationResponse>>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<LeaseApplicationResponse> applications = leaseApplicationService.getMyApplications(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("My applications retrieved successfully", applications));
    }

    @GetMapping("/received")
    @PreAuthorize("hasAnyAuthority('ROLE_LANDOWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<LeaseApplicationResponse>>> getReceivedApplications(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<LeaseApplicationResponse> applications = leaseApplicationService.getReceivedApplications(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Received applications retrieved successfully", applications));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyAuthority('ROLE_LANDOWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<LeaseApplicationResponse>> approveApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        LeaseApplicationResponse app = leaseApplicationService.approveApplication(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Application approved and lease agreement created successfully", app));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyAuthority('ROLE_LANDOWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<LeaseApplicationResponse>> rejectApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(required = false) ApplicationActionRequest request
    ) {
        String reason = (request != null) ? request.getReason() : null;
        LeaseApplicationResponse app = leaseApplicationService.rejectApplication(id, userDetails.getUsername(), reason);
        return ResponseEntity.ok(ApiResponse.success("Application rejected", app));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyAuthority('ROLE_FARMER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<LeaseApplicationResponse>> cancelApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        LeaseApplicationResponse app = leaseApplicationService.cancelApplication(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Application cancelled successfully", app));
    }
}

