package com.abber.backend.controller;

import com.abber.backend.dto.request.AssignMentorRequest;
import com.abber.backend.dto.request.CreateMentorRequest;
import com.abber.backend.dto.request.RoleUpdateRequest;
import com.abber.backend.dto.response.ActivityLogResponse;
import com.abber.backend.dto.response.AdminStatsResponse;
import com.abber.backend.dto.response.AdminUserResponse;
import com.abber.backend.dto.response.MentorProfileResponse;
import com.abber.backend.dto.response.UserProgressResponse;
import com.abber.backend.enums.RoleType;
import com.abber.backend.service.interfaces.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {

        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/activity-logs")
    public ResponseEntity<List<ActivityLogResponse>> getActivityLogs() {

        return ResponseEntity.ok(adminService.getActivityLogs());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getUsers() {

        return ResponseEntity.ok(adminService.getUsersWithProgress());
    }

    @GetMapping("/users/{userId}/progress")
    public ResponseEntity<UserProgressResponse> getUserProgress(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(adminService.getUserProgress(userId));
    }

    @PostMapping("/users/{userId}/roles")
    public ResponseEntity<Void> updateUserRole(
            @PathVariable Long userId,
            @Valid @RequestBody RoleUpdateRequest request
    ) {

        RoleType roleName = parseRoleName(request.getRoleName());

        boolean grant = parseAction(request.getAction());

        adminService.updateUserRole(userId, roleName, grant);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/mentors")
    public ResponseEntity<MentorProfileResponse> createMentor(
            @Valid @RequestBody CreateMentorRequest request
    ) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminService.createMentor(request));
    }

    @GetMapping("/mentors")
    public ResponseEntity<List<MentorProfileResponse>> getMentors() {

        return ResponseEntity.ok(adminService.getMentors());
    }

    @GetMapping("/mentors/{mentorId}/mentees")
    public ResponseEntity<List<AdminUserResponse>> getMenteesForMentor(
            @PathVariable Long mentorId
    ) {

        return ResponseEntity.ok(adminService.getMenteesForMentor(mentorId));
    }

    @PostMapping("/assignments")
    public ResponseEntity<Void> assignMentor(
            @Valid @RequestBody AssignMentorRequest request
    ) {

        adminService.assignMentor(request.getMentorId(), request.getMenteeId());

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/assignments")
    public ResponseEntity<Void> unassignMentor(
            @Valid @RequestBody AssignMentorRequest request
    ) {

        adminService.unassignMentor(request.getMentorId(), request.getMenteeId());

        return ResponseEntity.noContent().build();
    }

    private RoleType parseRoleName(String roleName) {

        String normalized = roleName.trim().toUpperCase(Locale.ROOT);

        if (!normalized.startsWith("ROLE_")) {
            normalized = "ROLE_" + normalized;
        }

        try {
            return RoleType.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                    "Unknown role name: " + roleName
            );
        }
    }

    private boolean parseAction(String action) {

        String normalized = action.trim().toUpperCase(Locale.ROOT);

        return switch (normalized) {
            case "GRANT", "ADD" -> true;
            case "REVOKE", "REMOVE" -> false;
            default -> throw new IllegalArgumentException(
                    "Action must be GRANT or REVOKE."
            );
        };
    }

}
