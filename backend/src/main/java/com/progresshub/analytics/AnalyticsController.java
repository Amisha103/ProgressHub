
package com.progresshub.analytics;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/weekly")
    public WeeklyAnalyticsResponse getWeeklyAnalytics(
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        return analyticsService.getWeeklyAnalytics(userEmail);
    }


    @GetMapping("/monthly")
    public MonthlyAnalyticsResponse getMonthlyAnalytics(
            Authentication authentication) {

        String userEmail = authentication.getName();

        return analyticsService.getMonthlyAnalytics(userEmail);
    }

}
