package com.abber.backend.service.interfaces;

import com.abber.backend.dto.response.DashboardSummaryResponse;

public interface DashboardService {

    DashboardSummaryResponse getSummary(Long userId);

}
