
package com.progresshub.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record GoogleLoginRequest(
        @NotBlank(message = "Google ID token is required")
        String credential,

        boolean rememberMe
) {}
