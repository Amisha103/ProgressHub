
package com.progresshub.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@Component
public class AuthOriginFilter extends OncePerRequestFilter {

    private final Set<String> allowedOrigins;

    public AuthOriginFilter(
            @Value("${app.frontend-origin:http://localhost:5173}")
            String frontendOrigin
    ) {
        this.allowedOrigins = new HashSet<>();

        this.allowedOrigins.add(frontendOrigin.trim());
        this.allowedOrigins.add(
                "https://progresshub-frontend-one.vercel.app"
        );
        this.allowedOrigins.add("http://localhost:5173");
        this.allowedOrigins.add("http://localhost:5174");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        System.out.println(
                "AUTH ORIGIN FILTER REACHED: "
                        + request.getMethod()
                        + " "
                        + path
                        + " Origin=["
                        + request.getHeader("Origin")
                        + "]"
        );

        boolean cookieAuthEndpoint =
                path.equals("/api/auth/refresh")
                        || path.equals("/api/auth/logout");

        if (cookieAuthEndpoint
                && "POST".equalsIgnoreCase(request.getMethod())) {

            String origin = request.getHeader("Origin");

            if (origin == null || !allowedOrigins.contains(origin.trim())) {
                System.out.println("AUTH ORIGIN FILTER REJECTED REQUEST");
                System.out.println("Request path: " + path);
                System.out.println("Received origin: [" + origin + "]");
                System.out.println("Allowed origins: " + allowedOrigins);

                response.sendError(
                        HttpServletResponse.SC_FORBIDDEN,
                        "Request origin is not allowed"
                );
                return;
            }
        }

        filterChain.doFilter(request, response);

        if (path.equals("/api/auth/refresh")) {
            System.out.println(
                    "REFRESH RESPONSE AFTER SECURITY FILTERS: "
                            + response.getStatus()
            );
        }

    }
}
