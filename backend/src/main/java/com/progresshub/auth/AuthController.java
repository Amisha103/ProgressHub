
package com.progresshub.auth;

import com.progresshub.auth.dto.LoginRequest;
import com.progresshub.auth.dto.LoginResponse;
import com.progresshub.auth.dto.RegisterRequest;
import com.progresshub.security.JwtService;
import com.progresshub.user.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String REFRESH_COOKIE_NAME = "progresshub-refresh";

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final boolean cookieSecure;

    public AuthController(
            AuthService authService,
            RefreshTokenService refreshTokenService,
            JwtService jwtService,
            @Value("${auth.refresh-cookie-secure:false}") boolean cookieSecure
    ) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
        this.jwtService = jwtService;
        this.cookieSecure = cookieSecure;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        AuthService.LoginResult result = authService.login(
                request.getEmail(),
                request.getPassword(),
                request.isRememberMe()
        );

        setRefreshCookie(
                response,
                result.refreshToken().token(),
                result.refreshToken().expiresAt()
        );

        User user = result.user();

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                result.token()
        );
    }

    @PostMapping("/register")
    public LoginResponse register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        AuthService.LoginResult result = authService.register(request);

        setRefreshCookie(
                response,
                result.refreshToken().token(),
                result.refreshToken().expiresAt()
        );

        User user = result.user();

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                result.token()
        );
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String oldToken = readRefreshCookie(request);

        if (oldToken == null) {
            clearRefreshCookie(response);
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Refresh session is missing"
            );
        }

        try {
            RefreshTokenService.CreatedRefreshToken refreshed =
                    refreshTokenService.rotate(oldToken);

            User user = refreshed.user();
            String accessToken = jwtService.generateToken(
                    user.getId(),
                    user.getEmail()
            );

            setRefreshCookie(
                    response,
                    refreshed.token(),
                    refreshed.expiresAt()
            );

            return new LoginResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    accessToken
            );
        } catch (IllegalArgumentException exception) {
            clearRefreshCookie(response);
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Refresh session is invalid or expired"
            );
        }
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String token = readRefreshCookie(request);
        refreshTokenService.revoke(token);
        clearRefreshCookie(response);
    }

    private String readRefreshCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        return Arrays.stream(cookies)
                .filter(cookie -> REFRESH_COOKIE_NAME.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private void setRefreshCookie(
            HttpServletResponse response,
            String token,
            OffsetDateTime expiresAt
    ) {
        Duration maxAge = Duration.between(
                OffsetDateTime.now(),
                expiresAt
        );

        ResponseCookie cookie = ResponseCookie
                .from(REFRESH_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("None")
                .path("/api/auth")
                .maxAge(maxAge.isNegative() ? Duration.ZERO : maxAge)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie
                .from(REFRESH_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(Duration.ZERO)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
