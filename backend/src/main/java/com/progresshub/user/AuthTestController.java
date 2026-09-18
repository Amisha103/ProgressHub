package com.progresshub.user;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthTestController {

    @GetMapping("/api/test/protected")
    public String protectedEndpoint(Authentication authentication) {

        return "Authenticated as: " + authentication.getName();
    }
}