package com.agri.portal.service;

import com.agri.portal.dto.*;
import com.agri.portal.entity.*;
import com.agri.portal.exception.BadRequestException;
import com.agri.portal.exception.ResourceNotFoundException;
import com.agri.portal.exception.UnauthorizedException;
import com.agri.portal.repository.LandListingRepository;
import com.agri.portal.repository.ReportedListingRepository;
import com.agri.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LandListingService {

    @Autowired
    private LandListingRepository landListingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReportedListingRepository reportedListingRepository;

    @Transactional
    public LandListingResponse createListing(String ownerEmail, LandListingRequest request) {
        User owner = userRepository.findByEmail(ownerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Owner account not found"));

        if (owner.getRole() != Role.ROLE_LANDOWNER && owner.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("Only registered landowners can publish agricultural land listings");
        }

        LandListing land = new LandListing();
        mapRequestToEntity(request, land);
        land.setOwner(owner);
        land.setAvailableAcreage(request.getTotalAcreage());
        land.setStatus(LandStatus.AVAILABLE);

        land = landListingRepository.save(land);
        return convertToResponse(land);
    }

    @Transactional
    public LandListingResponse updateListing(Long id, String userEmail, LandListingRequest request) {
        LandListing land = landListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Land listing not found with ID: " + id));

        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!land.getOwner().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not authorized to edit this land listing");
        }

        double acreageDifference = request.getTotalAcreage() - land.getTotalAcreage();
        double updatedAvailableAcreage = land.getAvailableAcreage() + acreageDifference;
        if (updatedAvailableAcreage < 0) {
            throw new BadRequestException("Cannot reduce total acreage below currently leased acreage");
        }

        mapRequestToEntity(request, land);
        land.setAvailableAcreage(updatedAvailableAcreage);

        if (land.getAvailableAcreage() == 0) {
            land.setStatus(LandStatus.FULLY_LEASED);
        } else if (land.getAvailableAcreage() < land.getTotalAcreage()) {
            land.setStatus(LandStatus.PARTIALLY_LEASED);
        } else {
            land.setStatus(LandStatus.AVAILABLE);
        }

        land = landListingRepository.save(land);
        return convertToResponse(land);
    }

    @Transactional
    public void deleteListing(Long id, String userEmail) {
        LandListing land = landListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Land listing not found with ID: " + id));

        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!land.getOwner().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not authorized to delete this land listing");
        }

        land.setStatus(LandStatus.INACTIVE);
        landListingRepository.save(land);
    }

    @Transactional(readOnly = true)
    public LandListingResponse getListingById(Long id) {
        LandListing land = landListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Land listing not found with ID: " + id));
        return convertToResponse(land);
    }

    @Transactional(readOnly = true)
    public Page<LandListingResponse> searchLands(
            String state,
            String district,
            String village,
            String soilType,
            String waterAvailability,
            Double minAcreage,
            Double maxAcreage,
            Double maxBudget,
            LandStatus status,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<LandListing> resultPage = landListingRepository.searchLands(
                status,
                state,
                district,
                village,
                soilType,
                waterAvailability,
                minAcreage,
                maxAcreage,
                maxBudget,
                pageable
        );

        return resultPage.map(this::convertToResponse);
    }

    @Transactional(readOnly = true)
    public List<LandListingResponse> getMyListings(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        return landListingRepository.findByOwnerId(owner.getId()).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReportResponse reportListing(Long landId, String reporterEmail, ReportListingRequest request) {
        LandListing land = landListingRepository.findById(landId)
                .orElseThrow(() -> new ResourceNotFoundException("Land listing not found with ID: " + landId));

        User reporter = userRepository.findByEmail(reporterEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ReportedListing report = new ReportedListing();
        report.setLandListing(land);
        report.setReportedBy(reporter);
        report.setReason(request.getReason());
        report.setDetails(request.getDetails());
        report.setStatus(ReportStatus.PENDING);

        report = reportedListingRepository.save(report);

        ReportResponse response = new ReportResponse();
        response.setId(report.getId());
        response.setLandListingId(land.getId());
        response.setLandTitle(land.getTitle());
        response.setReportedById(reporter.getId());
        response.setReportedByName(reporter.getFullName());
        response.setReason(report.getReason());
        response.setDetails(report.getDetails());
        response.setStatus(report.getStatus());
        response.setCreatedAt(report.getCreatedAt());

        return response;
    }

    private void mapRequestToEntity(LandListingRequest request, LandListing land) {
        land.setTitle(request.getTitle().trim());
        land.setDescription(request.getDescription());
        land.setState(request.getState().trim());
        land.setDistrict(request.getDistrict().trim());
        land.setVillage(request.getVillage().trim());
        land.setAddress(request.getAddress().trim());
        land.setTotalAcreage(request.getTotalAcreage());
        land.setSoilType(request.getSoilType());
        land.setWaterAvailability(request.getWaterAvailability());
        land.setElectricityAvailability(request.getElectricityAvailability() != null ? request.getElectricityAvailability() : true);
        land.setAvailableFacilities(request.getAvailableFacilities());
        land.setRentPerAcrePerYear(request.getRentPerAcrePerYear());
        land.setTotalExpectedRent(request.getTotalAcreage() * request.getRentPerAcrePerYear());
        land.setMinLeaseDurationMonths(request.getMinLeaseDurationMonths() != null ? request.getMinLeaseDurationMonths() : 6);
        land.setMaxLeaseDurationMonths(request.getMaxLeaseDurationMonths() != null ? request.getMaxLeaseDurationMonths() : 60);
        land.setImageUrl(request.getImageUrl());
        land.setContactPhone(request.getContactPhone());
        land.setContactEmail(request.getContactEmail());
    }

    public LandListingResponse convertToResponse(LandListing land) {
        LandListingResponse dto = new LandListingResponse();
        dto.setId(land.getId());
        dto.setTitle(land.getTitle());
        dto.setDescription(land.getDescription());
        dto.setState(land.getState());
        dto.setDistrict(land.getDistrict());
        dto.setVillage(land.getVillage());
        dto.setAddress(land.getAddress());
        dto.setTotalAcreage(land.getTotalAcreage());
        dto.setAvailableAcreage(land.getAvailableAcreage());
        dto.setSoilType(land.getSoilType());
        dto.setWaterAvailability(land.getWaterAvailability());
        dto.setElectricityAvailability(land.getElectricityAvailability());
        dto.setAvailableFacilities(land.getAvailableFacilities());
        dto.setRentPerAcrePerYear(land.getRentPerAcrePerYear());
        dto.setTotalExpectedRent(land.getTotalExpectedRent());
        dto.setMinLeaseDurationMonths(land.getMinLeaseDurationMonths());
        dto.setMaxLeaseDurationMonths(land.getMaxLeaseDurationMonths());
        dto.setStatus(land.getStatus());
        dto.setImageUrl(land.getImageUrl());
        dto.setContactPhone(land.getContactPhone());
        dto.setContactEmail(land.getContactEmail());
        if (land.getOwner() != null) {
            dto.setOwnerId(land.getOwner().getId());
            dto.setOwnerName(land.getOwner().getFullName());
        }
        dto.setCreatedAt(land.getCreatedAt());
        dto.setUpdatedAt(land.getUpdatedAt());
        return dto;
    }
}

