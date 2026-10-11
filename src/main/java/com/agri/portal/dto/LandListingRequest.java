package com.agri.portal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class LandListingRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "Village is required")
    private String village;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Total acreage is required")
    @Positive(message = "Total acreage must be greater than zero")
    private Double totalAcreage;

    private String soilType;
    private String waterAvailability;
    private Boolean electricityAvailability = true;
    private String availableFacilities;

    @NotNull(message = "Rent per acre per year is required")
    @Positive(message = "Rent per acre per year must be greater than zero")
    private Double rentPerAcrePerYear;

    private Integer minLeaseDurationMonths = 6;
    private Integer maxLeaseDurationMonths = 60;
    private String imageUrl;
    private String contactPhone;
    private String contactEmail;

    public LandListingRequest() {
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
}

