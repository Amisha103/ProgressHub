
package com.progresshub.auth;

import com.progresshub.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;

@Service
public class RefreshTokenService {

    private static final int TOKEN_BYTES = 32;

    private final RefreshSessionRepository refreshSessionRepository;
    private final SecureRandom secureRandom = new SecureRandom();
    private final long normalSessionDays;
    private final long rememberedSessionDays;

    public RefreshTokenService(
            RefreshSessionRepository refreshSessionRepository,
            @Value("${auth.refresh-session-days:30}") long normalSessionDays,
            @Value("${auth.remember-me-session-days:90}") long rememberedSessionDays
    ) {
        if (normalSessionDays <= 0 || rememberedSessionDays <= 0) {
            throw new IllegalArgumentException(
                    "Refresh session durations must be positive"
            );
        }

        this.refreshSessionRepository = refreshSessionRepository;
        this.normalSessionDays = normalSessionDays;
        this.rememberedSessionDays = rememberedSessionDays;
    }

    @Transactional
    public CreatedRefreshToken createSession(User user, boolean rememberMe) {
        String rawToken = generateRawToken();

        RefreshSession session = new RefreshSession();
        session.setUser(user);
        session.setTokenHash(hashToken(rawToken));
        session.setRememberMe(rememberMe);
        session.setExpiresAt(expiryFor(rememberMe));

        refreshSessionRepository.save(session);

        return new CreatedRefreshToken(
                rawToken,
                session.getExpiresAt(),
                rememberMe,
                user
        );
    }

    @Transactional
    public CreatedRefreshToken rotate(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is required");
        }

        OffsetDateTime now = OffsetDateTime.now();

        RefreshSession current = refreshSessionRepository
                .findByTokenHashAndRevokedAtIsNullAndExpiresAtAfter(
                        hashToken(rawToken),
                        now
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Refresh session is invalid or expired"
                        )
                );

        current.setRevokedAt(now);

        User user = current.getUser();
        boolean rememberMe = current.isRememberMe();

        String newRawToken = generateRawToken();

        RefreshSession replacement = new RefreshSession();
        replacement.setUser(user);
        replacement.setTokenHash(hashToken(newRawToken));
        replacement.setRememberMe(rememberMe);
        replacement.setExpiresAt(expiryFor(rememberMe));

        refreshSessionRepository.save(replacement);

        return new CreatedRefreshToken(
                newRawToken,
                replacement.getExpiresAt(),
                rememberMe,
                user
        );
    }

    @Transactional
    public void revoke(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return;
        }

        refreshSessionRepository
                .findByTokenHashAndRevokedAtIsNullAndExpiresAtAfter(
                        hashToken(rawToken),
                        OffsetDateTime.now()
                )
                .ifPresent(session ->
                        session.setRevokedAt(OffsetDateTime.now())
                );
    }

    private String generateRawToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(
                    rawToken.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 is not available",
                    exception
            );
        }
    }

    private OffsetDateTime expiryFor(boolean rememberMe) {
        long days = rememberMe
                ? rememberedSessionDays
                : normalSessionDays;

        return OffsetDateTime.now().plusDays(days);
    }

    public record CreatedRefreshToken(
            String token,
            OffsetDateTime expiresAt,
            boolean rememberMe,
            User user
    ) {
    }
}
