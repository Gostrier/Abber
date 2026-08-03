package com.abber.backend.service.interfaces;

import com.abber.backend.entity.ActivityLog;

import java.util.List;

public interface ActivityLogService {

    void record(String userEmail, String action, String detail);

    List<ActivityLog> getRecentLogs(int limit);

}
