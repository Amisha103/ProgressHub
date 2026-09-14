package com.progresshub.auth;

import com.progresshub.auth.dto.LoginRequest;
import com.progresshub.auth.dto.LoginResponse;
import com.progresshub.user.User;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request
    ) {

        User user = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                null
        );
    }
}