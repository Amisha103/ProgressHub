
package com.progresshub.auth;

import com.progresshub.auth.dto.RegisterRequest;
import com.progresshub.common.exception.EmailAlreadyExistsException;
import com.progresshub.common.exception.InvalidCredentialsException;
import com.progresshub.security.JwtService;
import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResult login(String email, String password) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElse(null);

        if (user == null ||
                !passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail()
        );

        return new LoginResult(user, token);
    }

    @Transactional
    public LoginResult register(RegisterRequest request) {
        String normalizedEmail =
                request.getEmail().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyExistsException(
                    "An account with this email already exists"
            );
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.saveAndFlush(user);

        String token = jwtService.generateToken(
                savedUser.getId(),
                savedUser.getEmail()
        );

        return new LoginResult(savedUser, token);
    }

    public record LoginResult(User user, String token) {
    }
}
