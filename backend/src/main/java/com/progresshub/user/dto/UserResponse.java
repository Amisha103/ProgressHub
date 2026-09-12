package com.progresshub.user.dto;

import java.time.OffsetDateTime;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public UserResponse() {
    }

    public UserResponse(
            Long id,
            String name,
            String email,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}