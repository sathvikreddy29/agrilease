package com.agri.portal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lease_applications")
public class LeaseApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "land_listing_id", nullable = false)
    private LandListing landListing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Double requestedAcreage;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer proposedDurationMonths;

    @NotBlank
    @Column(nullable = false)
    private String intendedCrop;

    @NotNull
    @Column(nullable = false)
    private LocalDate proposedStartDate;

    private Double offeredRentPerAcre;

    private Double totalOfferedRent;

    @Column(length = 1000)
    private String message;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    private String rejectionReason;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public LeaseApplication() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.totalOfferedRent == null && this.requestedAcreage != null && this.offeredRentPerAcre != null) {
            this.totalOfferedRent = this.requestedAcreage * this.offeredRentPerAcre;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.requestedAcreage != null && this.offeredRentPerAcre != null) {
            this.totalOfferedRent = this.requestedAcreage * this.offeredRentPerAcre;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LandListing getLandListing() {
        return landListing;
    }

    public void setLandListing(LandListing landListing) {
        this.landListing = landListing;
    }

    public User getFarmer() {
        return farmer;
    }

    public void setFarmer(User farmer) {
        this.farmer = farmer;
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

