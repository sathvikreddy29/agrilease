package com.agri.portal.dto;

import com.agri.portal.entity.ApplicationStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaseApplicationResponse {

    private Long id;
    private Long landListingId;
    private String landTitle;
    private String landState;
    private String landDistrict;
    private String landVillage;
    private Long farmerId;
    private String farmerName;
    private String farmerEmail;
    private String farmerPhone;
    private Double requestedAcreage;
    private Integer proposedDurationMonths;
    private String intendedCrop;
    private LocalDate proposedStartDate;
    private Double offeredRentPerAcre;
    private Double totalOfferedRent;
    private String message;
    private ApplicationStatus status;
    private String rejectionReason;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;

    public LeaseApplicationResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLandListingId() {
        return landListingId;
    }

    public void setLandListingId(Long landListingId) {
        this.landListingId = landListingId;
    }

    public String getLandTitle() {
        return landTitle;
    }

    public void setLandTitle(String landTitle) {
        this.landTitle = landTitle;
    }

    public String getLandState() {
        return landState;
    }

    public void setLandState(String landState) {
        this.landState = landState;
    }

    public String getLandDistrict() {
        return landDistrict;
    }

    public void setLandDistrict(String landDistrict) {
        this.landDistrict = landDistrict;
    }

    public String getLandVillage() {
        return landVillage;
    }

    public void setLandVillage(String landVillage) {
        this.landVillage = landVillage;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public String getFarmerEmail() {
        return farmerEmail;
    }

    public void setFarmerEmail(String farmerEmail) {
        this.farmerEmail = farmerEmail;
    }

    public String getFarmerPhone() {
        return farmerPhone;
    }

    public void setFarmerPhone(String farmerPhone) {
        this.farmerPhone = farmerPhone;
    }

    public Double getRequestedAcreage() {
        return requestedAcreage;
    }

    public void setRequestedAcreage(Double requestedAcreage) {
        this.requestedAcreage = requestedAcreage;
    }

    public Integer getProposedDurationMonths() {
        return proposedDurationMonths;
    }

    public void setProposedDurationMonths(Integer proposedDurationMonths) {
        this.proposedDurationMonths = proposedDurationMonths;
    }

    public String getIntendedCrop() {
        return intendedCrop;
    }

    public void setIntendedCrop(String intendedCrop) {
        this.intendedCrop = intendedCrop;
    }

    public LocalDate getProposedStartDate() {
        return proposedStartDate;
    }

    public void setProposedStartDate(LocalDate proposedStartDate) {
        this.proposedStartDate = proposedStartDate;
    }

    public Double getOfferedRentPerAcre() {
        return offeredRentPerAcre;
    }

    public void setOfferedRentPerAcre(Double offeredRentPerAcre) {
        this.offeredRentPerAcre = offeredRentPerAcre;
    }

    public Double getTotalOfferedRent() {
        return totalOfferedRent;
    }

    public void setTotalOfferedRent(Double totalOfferedRent) {
        this.totalOfferedRent = totalOfferedRent;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

