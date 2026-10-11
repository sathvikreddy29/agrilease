package com.agri.portal.dto;

import com.agri.portal.entity.LandStatus;
import java.time.LocalDateTime;

public class LandListingResponse {

    private Long id;
    private String title;
    private String description;
    private String state;
    private String district;
    private String village;
    private String address;
    private Double totalAcreage;
    private Double availableAcreage;
    private String soilType;
    private String waterAvailability;
    private Boolean electricityAvailability;
    private String availableFacilities;
    private Double rentPerAcrePerYear;
    private Double totalExpectedRent;
    private Integer minLeaseDurationMonths;
    private Integer maxLeaseDurationMonths;
    private LandStatus status;
    private String imageUrl;
    private String contactPhone;
    private String contactEmail;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LandListingResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getTotalAcreage() {
        return totalAcreage;
    }

    public void setTotalAcreage(Double totalAcreage) {
        this.totalAcreage = totalAcreage;
    }

    public Double getAvailableAcreage() {
        return availableAcreage;
    }

    public void setAvailableAcreage(Double availableAcreage) {
        this.availableAcreage = availableAcreage;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public String getWaterAvailability() {
        return waterAvailability;
    }

    public void setWaterAvailability(String waterAvailability) {
        this.waterAvailability = waterAvailability;
    }

    public Boolean getElectricityAvailability() {
        return electricityAvailability;
    }

    public void setElectricityAvailability(Boolean electricityAvailability) {
        this.electricityAvailability = electricityAvailability;
    }

    public String getAvailableFacilities() {
        return availableFacilities;
    }

    public void setAvailableFacilities(String availableFacilities) {
        this.availableFacilities = availableFacilities;
    }

    public Double getRentPerAcrePerYear() {
        return rentPerAcrePerYear;
    }

    public void setRentPerAcrePerYear(Double rentPerAcrePerYear) {
        this.rentPerAcrePerYear = rentPerAcrePerYear;
    }

    public Double getTotalExpectedRent() {
        return totalExpectedRent;
    }

    public void setTotalExpectedRent(Double totalExpectedRent) {
        this.totalExpectedRent = totalExpectedRent;
    }

    public Integer getMinLeaseDurationMonths() {
        return minLeaseDurationMonths;
    }

    public void setMinLeaseDurationMonths(Integer minLeaseDurationMonths) {
        this.minLeaseDurationMonths = minLeaseDurationMonths;
    }

    public Integer getMaxLeaseDurationMonths() {
        return maxLeaseDurationMonths;
    }

    public void setMaxLeaseDurationMonths(Integer maxLeaseDurationMonths) {
        this.maxLeaseDurationMonths = maxLeaseDurationMonths;
    }

    public LandStatus getStatus() {
        return status;
    }

    public void setStatus(LandStatus status) {
        this.status = status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

