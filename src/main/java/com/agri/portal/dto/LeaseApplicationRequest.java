package com.agri.portal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class LeaseApplicationRequest {

    @NotNull(message = "Land listing ID is required")
    private Long landListingId;

    @NotNull(message = "Requested acreage is required")
    @Positive(message = "Requested acreage must be greater than zero")
    private Double requestedAcreage;

    @NotNull(message = "Proposed duration is required")
    @Positive(message = "Duration must be greater than zero")
    private Integer proposedDurationMonths;

    @NotBlank(message = "Intended crop is required")
    private String intendedCrop;

    @NotNull(message = "Proposed start date is required")
    private LocalDate proposedStartDate;

    private Double offeredRentPerAcre;
    private String message;

    public LeaseApplicationRequest() {
    }

    public Long getLandListingId() {
        return landListingId;
    }

    public void setLandListingId(Long landListingId) {
        this.landListingId = landListingId;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

