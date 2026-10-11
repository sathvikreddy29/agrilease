package com.agri.portal.service;

import com.agri.portal.dto.*;
import com.agri.portal.entity.*;
import com.agri.portal.exception.ResourceNotFoundException;
import com.agri.portal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LandListingRepository landListingRepository;

    @Autowired
    private LeaseApplicationRepository leaseApplicationRepository;

    @Autowired
    private LeaseAgreementRepository leaseAgreementRepository;

    @Autowired
    private ReportedListingRepository reportedListingRepository;

    @Autowired
    private LandListingService landListingService;

    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse getDashboardStats() {
        AdminDashboardStatsResponse stats = new AdminDashboardStatsResponse();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalLandowners(userRepository.countByRole(Role.ROLE_LANDOWNER));
        stats.setTotalFarmers(userRepository.countByRole(Role.ROLE_FARMER));

        stats.setTotalListings(landListingRepository.count());
        stats.setAvailableListings(landListingRepository.countByStatus(LandStatus.AVAILABLE));
        stats.setLeasedListings(landListingRepository.countByStatus(LandStatus.FULLY_LEASED) +
                landListingRepository.countByStatus(LandStatus.PARTIALLY_LEASED));

        stats.setTotalApplications(leaseApplicationRepository.count());
        stats.setPendingApplications(leaseApplicationRepository.countByStatus(ApplicationStatus.PENDING));
        stats.setApprovedApplications(leaseApplicationRepository.countByStatus(ApplicationStatus.APPROVED));

        stats.setActiveLeases(leaseAgreementRepository.countByStatus(LeaseStatus.ACTIVE));
        stats.setPendingReports(reportedListingRepository.countByStatus(ReportStatus.PENDING));

        return stats;
    }

    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserProfileResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole(),
                        user.getAddress(),
                        user.getState(),
                        user.getDistrict(),
                        user.isActive(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public UserProfileResponse updateUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setActive(active);
        user = userRepository.save(user);

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getAddress(),
                user.getState(),
                user.getDistrict(),
                user.isActive(),
                user.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<LandListingResponse> getAllListings() {
        return landListingRepository.findAll().stream()
                .map(landListingService::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LandListingResponse updateListingStatus(Long listingId, LandStatus status) {
        LandListing land = landListingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Land listing not found with ID: " + listingId));

        land.setStatus(status);
        land = landListingRepository.save(land);
        return landListingService.convertToResponse(land);
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getAllReports() {
        return reportedListingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(report -> {
                    ReportResponse dto = new ReportResponse();
                    dto.setId(report.getId());
                    dto.setLandListingId(report.getLandListing().getId());
                    dto.setLandTitle(report.getLandListing().getTitle());
                    dto.setReportedById(report.getReportedBy().getId());
                    dto.setReportedByName(report.getReportedBy().getFullName());
                    dto.setReason(report.getReason());
                    dto.setDetails(report.getDetails());
                    dto.setStatus(report.getStatus());
                    dto.setCreatedAt(report.getCreatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ReportResponse updateReportStatus(Long reportId, ReportStatus status) {
        ReportedListing report = reportedListingRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with ID: " + reportId));

        report.setStatus(status);
        report = reportedListingRepository.save(report);

        ReportResponse dto = new ReportResponse();
        dto.setId(report.getId());
        dto.setLandListingId(report.getLandListing().getId());
        dto.setLandTitle(report.getLandListing().getTitle());
        dto.setReportedById(report.getReportedBy().getId());
        dto.setReportedByName(report.getReportedBy().getFullName());
        dto.setReason(report.getReason());
        dto.setDetails(report.getDetails());
        dto.setStatus(report.getStatus());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }
}

