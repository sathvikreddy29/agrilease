package com.agri.portal.service;

import com.agri.portal.dto.LeaseApplicationRequest;
import com.agri.portal.dto.LeaseApplicationResponse;
import com.agri.portal.entity.*;
import com.agri.portal.exception.BadRequestException;
import com.agri.portal.exception.ResourceNotFoundException;
import com.agri.portal.exception.UnauthorizedException;
import com.agri.portal.repository.LandListingRepository;
import com.agri.portal.repository.LeaseAgreementRepository;
import com.agri.portal.repository.LeaseApplicationRepository;
import com.agri.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LeaseApplicationService {

    @Autowired
    private LeaseApplicationRepository leaseApplicationRepository;

    @Autowired
    private LandListingRepository landListingRepository;

    @Autowired
    private LeaseAgreementRepository leaseAgreementRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public LeaseApplicationResponse createApplication(String farmerEmail, LeaseApplicationRequest request) {
        User farmer = userRepository.findByEmail(farmerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Farmer account not found"));

        if (farmer.getRole() != Role.ROLE_FARMER && farmer.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("Only registered farmers can submit lease applications");
        }

        LandListing land = landListingRepository.findById(request.getLandListingId())
                .orElseThrow(() -> new ResourceNotFoundException("Land listing not found with ID: " + request.getLandListingId()));

        if (land.getStatus() != LandStatus.AVAILABLE && land.getStatus() != LandStatus.PARTIALLY_LEASED) {
            throw new BadRequestException("This land listing is currently not available for lease");
        }

        // Rule: Cannot apply to own land
        if (land.getOwner().getId().equals(farmer.getId())) {
            throw new BadRequestException("You cannot apply to lease your own land listing");
        }

        // Rule: Acreage validation
        if (request.getRequestedAcreage() > land.getAvailableAcreage()) {
            throw new BadRequestException("Requested acreage (" + request.getRequestedAcreage() +
                    " acres) exceeds available acreage (" + land.getAvailableAcreage() + " acres)");
        }

        // Rule: Duration check
        if (request.getProposedDurationMonths() < land.getMinLeaseDurationMonths() ||
            request.getProposedDurationMonths() > land.getMaxLeaseDurationMonths()) {
            throw new BadRequestException("Proposed duration must be between " +
                    land.getMinLeaseDurationMonths() + " and " + land.getMaxLeaseDurationMonths() + " months");
        }

        // Rule: Date validation
        if (request.getProposedStartDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Proposed start date cannot be in the past");
        }

        // Rule: Prevent duplicate pending applications
        boolean hasActiveApplication = leaseApplicationRepository
                .existsByFarmerIdAndLandListingIdAndStatus(farmer.getId(), land.getId(), ApplicationStatus.PENDING);
        if (hasActiveApplication) {
            throw new BadRequestException("You already have an active pending application for this land listing");
        }

        double offeredRent = request.getOfferedRentPerAcre() != null && request.getOfferedRentPerAcre() > 0
                ? request.getOfferedRentPerAcre()
                : land.getRentPerAcrePerYear();

        LeaseApplication app = new LeaseApplication();
        app.setLandListing(land);
        app.setFarmer(farmer);
        app.setRequestedAcreage(request.getRequestedAcreage());
        app.setProposedDurationMonths(request.getProposedDurationMonths());
        app.setIntendedCrop(request.getIntendedCrop().trim());
        app.setProposedStartDate(request.getProposedStartDate());
        app.setOfferedRentPerAcre(offeredRent);
        app.setTotalOfferedRent(request.getRequestedAcreage() * offeredRent);
        app.setMessage(request.getMessage());
        app.setStatus(ApplicationStatus.PENDING);

        app = leaseApplicationRepository.save(app);
        return convertToResponse(app);
    }

    @Transactional(readOnly = true)
    public List<LeaseApplicationResponse> getMyApplications(String farmerEmail) {
        User farmer = userRepository.findByEmail(farmerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Farmer account not found"));

        return leaseApplicationRepository.findByFarmerIdOrderByCreatedAtDesc(farmer.getId()).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaseApplicationResponse> getReceivedApplications(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Owner account not found"));

        return leaseApplicationRepository.findByLandListingOwnerIdOrderByCreatedAtDesc(owner.getId()).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaseApplicationResponse approveApplication(Long applicationId, String ownerEmail) {
        LeaseApplication app = leaseApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        User owner = userRepository.findByEmail(ownerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LandListing land = app.getLandListing();

        if (!land.getOwner().getId().equals(owner.getId()) && owner.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not authorized to approve applications for this land");
        }

        if (app.getStatus() != ApplicationStatus.PENDING) {
            throw new BadRequestException("Only PENDING applications can be approved. Current status: " + app.getStatus());
        }

        if (app.getRequestedAcreage() > land.getAvailableAcreage()) {
            throw new BadRequestException("Requested acreage (" + app.getRequestedAcreage() +
                    " acres) exceeds remaining available acreage (" + land.getAvailableAcreage() + " acres)");
        }

        // 1. Update LandListing acreage and status
        double remainingAcreage = land.getAvailableAcreage() - app.getRequestedAcreage();
        land.setAvailableAcreage(remainingAcreage);
        if (remainingAcreage <= 0) {
            land.setStatus(LandStatus.FULLY_LEASED);
        } else {
            land.setStatus(LandStatus.PARTIALLY_LEASED);
        }
        landListingRepository.save(land);

        // 2. Update Application Status
        app.setStatus(ApplicationStatus.APPROVED);
        app = leaseApplicationRepository.save(app);

        // 3. Create LeaseAgreement transactionally
        LeaseAgreement agreement = new LeaseAgreement();
        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        agreement.setAgreementNumber("LEA-" + LocalDate.now().getYear() + "-" + uniqueSuffix);
        agreement.setLandListing(land);
        agreement.setApplication(app);
        agreement.setLandowner(land.getOwner());
        agreement.setFarmer(app.getFarmer());
        agreement.setLeasedAcreage(app.getRequestedAcreage());
        agreement.setRentAmount(app.getTotalOfferedRent());
        agreement.setStartDate(app.getProposedStartDate());
        agreement.setEndDate(app.getProposedStartDate().plusMonths(app.getProposedDurationMonths()));
        agreement.setDurationMonths(app.getProposedDurationMonths());
        agreement.setStatus(LeaseStatus.ACTIVE);
        agreement.setTermsAndConditions(
                "Digital Lease Summary:\n" +
                "- Land: " + land.getTitle() + "\n" +
                "- Lessee: " + app.getFarmer().getFullName() + " | Lessor: " + land.getOwner().getFullName() + "\n" +
                "- Leased Acreage: " + app.getRequestedAcreage() + " Acres | Intended Crop: " + app.getIntendedCrop() + "\n" +
                "- Agreed Rent: INR " + app.getTotalOfferedRent() + " (" + app.getOfferedRentPerAcre() + "/acre/yr)\n" +
                "Note: Both parties must abide by local tenancy regulations and mutual farming agreements."
        );
        leaseAgreementRepository.save(agreement);

        return convertToResponse(app);
    }

    @Transactional
    public LeaseApplicationResponse rejectApplication(Long applicationId, String ownerEmail, String reason) {
        LeaseApplication app = leaseApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        User owner = userRepository.findByEmail(ownerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LandListing land = app.getLandListing();

        if (!land.getOwner().getId().equals(owner.getId()) && owner.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not authorized to reject applications for this land");
        }

        if (app.getStatus() != ApplicationStatus.PENDING) {
            throw new BadRequestException("Only PENDING applications can be rejected. Current status: " + app.getStatus());
        }

        app.setStatus(ApplicationStatus.REJECTED);
        app.setRejectionReason(reason != null && !reason.isBlank() ? reason : "Application rejected by landowner");
        app = leaseApplicationRepository.save(app);

        return convertToResponse(app);
    }

    @Transactional
    public LeaseApplicationResponse cancelApplication(Long applicationId, String farmerEmail) {
        LeaseApplication app = leaseApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        User farmer = userRepository.findByEmail(farmerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!app.getFarmer().getId().equals(farmer.getId()) && farmer.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not authorized to cancel this application");
        }

        if (app.getStatus() != ApplicationStatus.PENDING) {
            throw new BadRequestException("Only PENDING applications can be cancelled. Current status: " + app.getStatus());
        }

        app.setStatus(ApplicationStatus.CANCELLED);
        app = leaseApplicationRepository.save(app);

        return convertToResponse(app);
    }

    public LeaseApplicationResponse convertToResponse(LeaseApplication app) {
        LeaseApplicationResponse dto = new LeaseApplicationResponse();
        dto.setId(app.getId());
        dto.setLandListingId(app.getLandListing().getId());
        dto.setLandTitle(app.getLandListing().getTitle());
        dto.setLandState(app.getLandListing().getState());
        dto.setLandDistrict(app.getLandListing().getDistrict());
        dto.setLandVillage(app.getLandListing().getVillage());
        dto.setFarmerId(app.getFarmer().getId());
        dto.setFarmerName(app.getFarmer().getFullName());
        dto.setFarmerEmail(app.getFarmer().getEmail());
        dto.setFarmerPhone(app.getFarmer().getPhone());
        dto.setRequestedAcreage(app.getRequestedAcreage());
        dto.setProposedDurationMonths(app.getProposedDurationMonths());
        dto.setIntendedCrop(app.getIntendedCrop());
        dto.setProposedStartDate(app.getProposedStartDate());
        dto.setOfferedRentPerAcre(app.getOfferedRentPerAcre());
        dto.setTotalOfferedRent(app.getTotalOfferedRent());
        dto.setMessage(app.getMessage());
        dto.setStatus(app.getStatus());
        dto.setRejectionReason(app.getRejectionReason());
        if (app.getLandListing().getOwner() != null) {
            dto.setOwnerId(app.getLandListing().getOwner().getId());
            dto.setOwnerName(app.getLandListing().getOwner().getFullName());
        }
        dto.setCreatedAt(app.getCreatedAt());
        return dto;
    }
}

