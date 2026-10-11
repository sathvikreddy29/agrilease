package com.agri.portal.controller;

import com.agri.portal.dto.ApiResponse;
import com.agri.portal.dto.LeaseAgreementResponse;
import com.agri.portal.service.LeaseAgreementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leases")
public class LeaseAgreementController {

    @Autowired
    private LeaseAgreementService leaseAgreementService;

    @GetMapping("/my-leases")
    public ResponseEntity<ApiResponse<List<LeaseAgreementResponse>>> getMyLeases(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<LeaseAgreementResponse> leases = leaseAgreementService.getMyLeases(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Leases retrieved successfully", leases));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeaseAgreementResponse>> getLeaseById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        LeaseAgreementResponse lease = leaseAgreementService.getLeaseById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Lease agreement retrieved successfully", lease));
    }
}

