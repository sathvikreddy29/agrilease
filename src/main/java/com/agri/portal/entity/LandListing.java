package com.agri.portal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Entity
@Table(name = "land_listings")
public class LandListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @NotBlank
    @Column(nullable = false)
    private String state;

    @NotBlank
    @Column(nullable = false)
    private String district;

    @NotBlank
    @Column(nullable = false)
    private String village;

    @NotBlank
    @Column(nullable = false)
    private String address;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Double totalAcreage;

    @NotNull
    @Column(nullable = false)
    private Double availableAcreage;

    private String soilType;

    private String waterAvailability;

    private Boolean electricityAvailability = true;

    private String availableFacilities;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Double rentPerAcrePerYear;

    private Double totalExpectedRent;

    private Integer minLeaseDurationMonths = 6;

    private Integer maxLeaseDurationMonths = 60;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LandStatus status = LandStatus.AVAILABLE;

    private String imageUrl;

    private String contactPhone;

    private String contactEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public LandListing() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.availableAcreage == null) {
            this.availableAcreage = this.totalAcreage;
        }
        if (this.totalExpectedRent == null && this.totalAcreage != null && this.rentPerAcrePerYear != null) {
            this.totalExpectedRent = this.totalAcreage * this.rentPerAcrePerYear;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.totalAcreage != null && this.rentPerAcrePerYear != null) {
            this.totalExpectedRent = this.totalAcreage * this.rentPerAcrePerYear;
        }
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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
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

