package com.abber.backend.controller;

import com.abber.backend.dto.response.AdminUserResponse;
import com.abber.backend.dto.response.UserProgressResponse;
import com.abber.backend.service.interfaces.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mentor")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MENTOR','ADMIN')")
public class MentorController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getMenteesProgress() {

        return ResponseEntity.ok(adminService.getUsersWithProgress());
    }

    @GetMapping("/users/{userId}/progress")
    public ResponseEntity<UserProgressResponse> getUserProgress(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(adminService.getUserProgress(userId));
    }

}
