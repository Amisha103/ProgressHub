
package com.progresshub.calendar;

import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/calendar")
public class GoogleCalendarController {

    private final GoogleCalendarOAuthService oauthService;
    private final GoogleCalendarCallbackService callbackService;
    private final GoogleCalendarConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    @Value("${google.redirect-uri}")
    private String redirectUri;

    @Value("${app.frontend-origin}")
    private String frontendOrigin;

    public GoogleCalendarController(
            GoogleCalendarOAuthService oauthService,
            GoogleCalendarCallbackService callbackService,
            GoogleCalendarConnectionRepository connectionRepository,
            UserRepository userRepository
    ) {
        this.oauthService = oauthService;
        this.callbackService = callbackService;
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
    }

    // Start Google Calendar connection
    @PostMapping("/connect")
    public ResponseEntity<Map<String, String>> connect(
            Authentication authentication
    ) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new IllegalStateException("User not found"));

        String state = oauthService.generateState();
        oauthService.saveState(state, user);

        boolean production = redirectUri.startsWith("https://");

        ResponseCookie stateCookie = ResponseCookie
                .from("PH_GOOGLE_CALENDAR_STATE", state)
                .httpOnly(true)
                .secure(production)
                .sameSite(production ? "None" : "Lax")
                .path("/api/calendar/oauth/callback")
                .maxAge(Duration.ofMinutes(5))
                .build();

        String authorizationUrl =
                oauthService.buildAuthorizationUrl(state);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, stateCookie.toString())
                .body(Map.of("authorizationUrl", authorizationUrl));
    }

    // Google OAuth callback
    @GetMapping("/oauth/callback")
    public ResponseEntity<Void> callback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error,
            @CookieValue(
                    name = "PH_GOOGLE_CALENDAR_STATE",
                    required = false
            ) String cookieState
    ) {
        boolean production = redirectUri.startsWith("https://");

        ResponseCookie clearCookie = ResponseCookie
                .from("PH_GOOGLE_CALENDAR_STATE", "")
                .httpOnly(true)
                .secure(production)
                .sameSite(production ? "None" : "Lax")
                .path("/api/calendar/oauth/callback")
                .maxAge(Duration.ZERO)
                .build();

        String destination;

        try {
            if (error != null) {
                throw new IllegalStateException(
                        "Google Calendar authorization was cancelled."
                );
            }

            callbackService.completeConnection(
                    code,
                    state,
                    cookieState
            );

            destination = frontendOrigin + "/settings?calendar=connected";

        } catch (Exception exception) {
            destination = frontendOrigin + "/settings?calendar=error";
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .header(
                        HttpHeaders.LOCATION,
                        URI.create(destination).toString()
                )
                .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                .build();
    }

    // Check Google Calendar connection status
    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> getConnectionStatus(
            Authentication authentication
    ) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new IllegalStateException("User not found"));

        boolean connected =
                connectionRepository.existsByUserId(user.getId());

        return ResponseEntity.ok(
                Map.of("connected", connected)
        );
    }
}
