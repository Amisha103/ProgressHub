
package com.progresshub.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

@Component
public class AuthOriginFilter extends OncePerRequestFilter {

    private final Set<String> allowedOrigins;

    public AuthOriginFilter(
            @Value("${app.frontend-origin:http://localhost:5173}")
            String frontendOrigin
    ) {
        this.allowedOrigins = Set.of(frontendOrigin);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        boolean cookieAuthEndpoint =
                path.equals("/api/auth/refresh")
                        || path.equals("/api/auth/logout");

        if (cookieAuthEndpoint && "POST".equalsIgnoreCase(request.getMethod())) {
            String origin = request.getHeader("Origin");

            if (origin == null || !allowedOrigins.contains(origin)) {
                response.sendError(
                        HttpServletResponse.SC_FORBIDDEN,
                        "Request origin is not allowed"
                );
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
