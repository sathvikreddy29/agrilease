package com.agri.portal.dto;

public class ApplicationActionRequest {

    private String reason;

    public ApplicationActionRequest() {
    }

    public ApplicationActionRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}

