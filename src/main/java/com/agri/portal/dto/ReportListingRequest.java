package com.agri.portal.dto;

import jakarta.validation.constraints.NotBlank;

public class ReportListingRequest {

    @NotBlank(message = "Reason is required")
    private String reason;

    private String details;

    public ReportListingRequest() {
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}

