
package com.progresshub.calendar;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class GoogleCalendarTokenService {

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private String clientSecret;

    @Value("${google.redirect-uri}")
    private String redirectUri;

    private final HttpClient httpClient =
            HttpClient.newHttpClient();

    private final ObjectMapper objectMapper;

    public GoogleCalendarTokenService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public JsonNode exchangeCode(String code) {
        try {
            String body =
                    "code=" + encode(code)
                            + "&client_id=" + encode(clientId)
                            + "&client_secret=" + encode(clientSecret)
                            + "&redirect_uri=" + encode(redirectUri)
                            + "&grant_type=authorization_code";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(
                            "https://oauth2.googleapis.com/token"
                    ))
                    .header(
                            "Content-Type",
                            "application/x-www-form-urlencoded"
                    )
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            JsonNode result =
                    objectMapper.readTree(response.body());

            if (response.statusCode() != 200) {
                throw new IllegalStateException(
                        "Google token exchange failed."
                );
            }

            return result;

        } catch (Exception e) {
            throw new IllegalStateException(
                    "Unable to exchange Google authorization code.",
                    e
            );
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(
                value,
                StandardCharsets.UTF_8
        );
    }
}
