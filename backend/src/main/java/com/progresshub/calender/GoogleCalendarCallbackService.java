
package com.progresshub.calendar;

import com.fasterxml.jackson.databind.JsonNode;
import com.progresshub.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.security.MessageDigest;

@Service
public class GoogleCalendarCallbackService {

    private final GoogleCalendarOAuthStateRepository stateRepository;
    private final GoogleCalendarTokenService tokenService;
    private final GoogleCalendarConnectionRepository connectionRepository;
    private final CalendarTokenEncryptionService encryptionService;

    public GoogleCalendarCallbackService(
            GoogleCalendarOAuthStateRepository stateRepository,
            GoogleCalendarTokenService tokenService,
            GoogleCalendarConnectionRepository connectionRepository,
            CalendarTokenEncryptionService encryptionService
    ) {
        this.stateRepository = stateRepository;
        this.tokenService = tokenService;
        this.connectionRepository = connectionRepository;
        this.encryptionService = encryptionService;
    }

    @Transactional
    public void completeConnection(String code, String state, String cookieState) {

        if (code == null || code.isBlank()
                || state == null || cookieState == null
                || !MessageDigest.isEqual(
                state.getBytes(java.nio.charset.StandardCharsets.UTF_8),
                cookieState.getBytes(java.nio.charset.StandardCharsets.UTF_8)
        )) {
            throw new IllegalArgumentException("Invalid OAuth state.");
        }

        String stateHash = hashState(state);

    GoogleCalendarOAuthState savedState =
                stateRepository.findByStateHashAndExpiresAtAfter(
                        stateHash,
                        OffsetDateTime.now()
                ).orElseThrow(() ->
                        new IllegalArgumentException("OAuth state expired or invalid.")
                );

        User user = savedState.getUser();

        // Consume the state so it cannot be reused.
        stateRepository.delete(savedState);

        JsonNode tokenResponse = tokenService.exchangeCode(code);

        JsonNode refreshTokenNode = tokenResponse.get("refresh_token");

        if (refreshTokenNode != null && !refreshTokenNode.isNull()
                && !refreshTokenNode.asText().isBlank()) {

            String encryptedToken =
                    encryptionService.encrypt(refreshTokenNode.asText());

            com.progresshub.calendar.GoogleCalendarConnection connection =
                    connectionRepository.findByUserId(user.getId())
                            .orElseGet(GoogleCalendarConnection::new);

            connection.setUser(user);
            connection.setEncryptedRefreshToken(encryptedToken);

            connectionRepository.save(connection);

        } else if (!connectionRepository.existsByUserId(user.getId())) {
            throw new IllegalStateException(
                    "Google did not return a refresh token. Please reconnect with consent."
            );
        }
    }

    private String hashState(String state) {
        try {
            byte[] hash = java.security.MessageDigest
                    .getInstance("SHA-256")
                    .digest(state.getBytes(
                            java.nio.charset.StandardCharsets.UTF_8
                    ));

            return java.util.HexFormat.of().formatHex(hash);

        } catch (java.security.NoSuchAlgorithmException e) {
            throw new IllegalStateException("Unable to hash OAuth state.", e);
        }
    }
}
