package com.agri.portal.dto;

import com.agri.portal.entity.LeaseStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaseAgreementResponse {

    private Long id;
    private String agreementNumber;
    private Long landListingId;
    private String landTitle;
    private String landAddress;
    private String landState;
    private String landDistrict;
    private String landVillage;
    private Long applicationId;
    private Long landownerId;
    private String landownerName;
    private String landownerEmail;
    private String landownerPhone;
    private Long farmerId;
    private String farmerName;
    private String farmerEmail;
    private String farmerPhone;
    private Double leasedAcreage;
    private Double rentAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer durationMonths;
    private LeaseStatus status;
    private String termsAndConditions;
    private LocalDateTime createdAt;

    public LeaseAgreementResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAgreementNumber() {
        return agreementNumber;
    }

    public void setAgreementNumber(String agreementNumber) {
        this.agreementNumber = agreementNumber;
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

    public String getLandAddress() {
        return landAddress;
    }

    public void setLandAddress(String landAddress) {
        this.landAddress = landAddress;
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

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Long getLandownerId() {
        return landownerId;
    }

    public void setLandownerId(Long landownerId) {
        this.landownerId = landownerId;
    }

    public String getLandownerName() {
        return landownerName;
    }

    public void setLandownerName(String landownerName) {
        this.landownerName = landownerName;
    }

    public String getLandownerEmail() {
        return landownerEmail;
    }

    public void setLandownerEmail(String landownerEmail) {
        this.landownerEmail = landownerEmail;
    }

    public String getLandownerPhone() {
        return landownerPhone;
    }

    public void setLandownerPhone(String landownerPhone) {
        this.landownerPhone = landownerPhone;
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

    public Double getLeasedAcreage() {
        return leasedAcreage;
    }

    public void setLeasedAcreage(Double leasedAcreage) {
        this.leasedAcreage = leasedAcreage;
    }

    public Double getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(Double rentAmount) {
        this.rentAmount = rentAmount;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getDurationMonths() {
        return durationMonths;
    }

    public void setDurationMonths(Integer durationMonths) {
        this.durationMonths = durationMonths;
    }

    public LeaseStatus getStatus() {
        return status;
    }

    public void setStatus(LeaseStatus status) {
        this.status = status;
    }

    public String getTermsAndConditions() {
        return termsAndConditions;
    }

    public void setTermsAndConditions(String termsAndConditions) {
        this.termsAndConditions = termsAndConditions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
