
package com.progresshub.calendar;

import com.progresshub.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;
import java.time.OffsetDateTime;

@Service
public class GoogleCalendarOAuthService {

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.redirect-uri}")
    private String redirectUri;

    private static final String GOOGLE_AUTH_URL =
            "https://accounts.google.com/o/oauth2/v2/auth";

    private static final String CALENDAR_SCOPE =
            "https://www.googleapis.com/auth/calendar.events";

    private final SecureRandom secureRandom = new SecureRandom();

    private final GoogleCalendarOAuthStateRepository stateRepository;

    public GoogleCalendarOAuthService(
            GoogleCalendarOAuthStateRepository stateRepository
    ) {
        this.stateRepository = stateRepository;
    }

    public String generateState() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }

    public void saveState(String state, User user) {
        GoogleCalendarOAuthState oauthState =
                new GoogleCalendarOAuthState();

        oauthState.setStateHash(hashState(state));
        oauthState.setUser(user);
        oauthState.setExpiresAt(
                OffsetDateTime.now().plusMinutes(5)
        );

        stateRepository.save(oauthState);
    }

    public String hashState(String state) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    state.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "Unable to hash OAuth state", e
            );
        }
    }

    public String buildAuthorizationUrl(String state) {
        return GOOGLE_AUTH_URL
                + "?client_id=" + encode(clientId)
                + "&redirect_uri=" + encode(redirectUri)
                + "&response_type=code"
                + "&scope=" + encode(CALENDAR_SCOPE)
                + "&access_type=offline"
                + "&prompt=consent"
                + "&include_granted_scopes=true"
                + "&state=" + encode(state);
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
