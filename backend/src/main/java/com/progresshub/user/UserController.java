package com.progresshub.user;

import com.progresshub.user.dto.RegisterRequest;
import com.progresshub.user.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import com.progresshub.user.dto.UpdateProfileRequest;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {

        User user = userService.register(request);

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    @GetMapping("/email")
    public User getUserByEmail(@RequestParam String email) {
        return userService.findByEmail(email);
    }

    @PutMapping("/profile")
    public UserResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {

        String email = authentication.getName();

        User user = userService.updateProfile(email, request);

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}