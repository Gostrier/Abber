package com.abber.backend.service.impl;

import com.abber.backend.entity.ActivityLog;
import com.abber.backend.entity.User;
import com.abber.backend.repository.ActivityLogRepository;
import com.abber.backend.repository.UserRepository;
import com.abber.backend.service.interfaces.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    private final UserRepository userRepository;

    @Override
    @Transactional
    public void record(String userEmail, String action, String detail) {

        Long userId = userRepository.findByEmailIgnoreCase(userEmail)
                .map(User::getId)
                .orElse(null);

        ActivityLog log = ActivityLog.builder()
                .userId(userId)
                .userEmail(userEmail)
                .action(action)
                .detail(detail)
                .createdAt(LocalDateTime.now())
                .build();

        activityLogRepository.save(log);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityLog> getRecentLogs(int limit) {

        if (limit <= 0) {
            return List.of();
        }

        if (limit < 100) {
            return activityLogRepository.findTop100ByOrderByCreatedAtDesc()
                    .stream()
                    .limit(limit)
                    .toList();
        }

        return activityLogRepository.findTop100ByOrderByCreatedAtDesc();
    }

}
