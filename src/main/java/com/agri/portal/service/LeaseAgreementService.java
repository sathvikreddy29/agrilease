package com.agri.portal.service;

import com.agri.portal.dto.LeaseAgreementResponse;
import com.agri.portal.entity.LeaseAgreement;
import com.agri.portal.entity.Role;
import com.agri.portal.entity.User;
import com.agri.portal.exception.ResourceNotFoundException;
import com.agri.portal.exception.UnauthorizedException;
import com.agri.portal.repository.LeaseAgreementRepository;
import com.agri.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaseAgreementService {

    @Autowired
    private LeaseAgreementRepository leaseAgreementRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<LeaseAgreementResponse> getMyLeases(String userEmail) {
        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<LeaseAgreement> agreements;
        if (user.getRole() == Role.ROLE_LANDOWNER) {
            agreements = leaseAgreementRepository.findByLandownerIdOrderByCreatedAtDesc(user.getId());
        } else if (user.getRole() == Role.ROLE_FARMER) {
            agreements = leaseAgreementRepository.findByFarmerIdOrderByCreatedAtDesc(user.getId());
        } else {
            // ADMIN: all agreements
            agreements = leaseAgreementRepository.findAll();
        }

        return agreements.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LeaseAgreementResponse getLeaseById(Long leaseId, String userEmail) {
        LeaseAgreement agreement = leaseAgreementRepository.findById(leaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Lease agreement not found with ID: " + leaseId));

        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAuthorized = user.getRole() == Role.ROLE_ADMIN ||
                agreement.getLandowner().getId().equals(user.getId()) ||
                agreement.getFarmer().getId().equals(user.getId());

        if (!isAuthorized) {
            throw new UnauthorizedException("You are not authorized to view this lease agreement");
        }

        return convertToResponse(agreement);
    }

    public LeaseAgreementResponse convertToResponse(LeaseAgreement agreement) {
        LeaseAgreementResponse dto = new LeaseAgreementResponse();
        dto.setId(agreement.getId());
        dto.setAgreementNumber(agreement.getAgreementNumber());
        dto.setLandListingId(agreement.getLandListing().getId());
        dto.setLandTitle(agreement.getLandListing().getTitle());
        dto.setLandAddress(agreement.getLandListing().getAddress());
        dto.setLandState(agreement.getLandListing().getState());
        dto.setLandDistrict(agreement.getLandListing().getDistrict());
        dto.setLandVillage(agreement.getLandListing().getVillage());
        if (agreement.getApplication() != null) {
            dto.setApplicationId(agreement.getApplication().getId());
        }
        dto.setLandownerId(agreement.getLandowner().getId());
        dto.setLandownerName(agreement.getLandowner().getFullName());
        dto.setLandownerEmail(agreement.getLandowner().getEmail());
        dto.setLandownerPhone(agreement.getLandowner().getPhone());

        dto.setFarmerId(agreement.getFarmer().getId());
        dto.setFarmerName(agreement.getFarmer().getFullName());
        dto.setFarmerEmail(agreement.getFarmer().getEmail());
        dto.setFarmerPhone(agreement.getFarmer().getPhone());

        dto.setLeasedAcreage(agreement.getLeasedAcreage());
        dto.setRentAmount(agreement.getRentAmount());
        dto.setStartDate(agreement.getStartDate());
        dto.setEndDate(agreement.getEndDate());
        dto.setDurationMonths(agreement.getDurationMonths());
        dto.setStatus(agreement.getStatus());
        dto.setTermsAndConditions(agreement.getTermsAndConditions());
        dto.setCreatedAt(agreement.getCreatedAt());
        return dto;
    }
}

