package com.agri.portal.controller;

import com.agri.portal.dto.*;
import com.agri.portal.entity.LandStatus;
import com.agri.portal.service.LandListingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lands")
public class LandListingController {

    @Autowired
    private LandListingService landListingService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<LandListingResponse>>> getAllLands(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String village,
            @RequestParam(required = false) String soilType,
            @RequestParam(required = false) String waterAvailability,
            @RequestParam(required = false) Double minAcreage,
            @RequestParam(required = false) Double maxAcreage,
            @RequestParam(required = false) Double maxBudget,
            @RequestParam(required = false) LandStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Page<LandListingResponse> lands = landListingService.searchLands(
                state, district, village, soilType, waterAvailability,
                minAcreage, maxAcreage, maxBudget, status, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.success("Land listings retrieved successfully", lands));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LandListingResponse>> getLandById(@PathVariable Long id) {
        LandListingResponse land = landListingService.getListingById(id);
        return ResponseEntity.ok(ApiResponse.success("Land listing details retrieved", land));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_LANDOWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<LandListingResponse>> createLand(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody LandListingRequest request
    ) {
        LandListingResponse created = landListingService.createListing(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Land listing created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_LANDOWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<LandListingResponse>> updateLand(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody LandListingRequest request
    ) {
        LandListingResponse updated = landListingService.updateListing(id, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Land listing updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_LANDOWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteLand(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        landListingService.deleteListing(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Land listing deleted successfully", "Listing status set to INACTIVE"));
    }

    @GetMapping("/my-listings")
    @PreAuthorize("hasAnyAuthority('ROLE_LANDOWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<LandListingResponse>>> getMyListings(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<LandListingResponse> myListings = landListingService.getMyListings(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("My listings retrieved successfully", myListings));
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<ApiResponse<ReportResponse>> reportListing(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReportListingRequest request
    ) {
        ReportResponse report = landListingService.reportListing(id, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Report submitted successfully for admin review", report));
    }
}

