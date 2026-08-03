package com.abber.backend.controller;

import com.abber.backend.dto.response.DashboardSummaryResponse;
import com.abber.backend.security.CurrentUserService;
import com.abber.backend.service.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MENTEE','MENTOR','ADMIN')")
public class DashboardController {

    private final DashboardService dashboardService;
    private final CurrentUserService currentUserService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {

        return ResponseEntity.ok(
                dashboardService.getSummary(currentUserService.getUserId())
        );
    }

}
