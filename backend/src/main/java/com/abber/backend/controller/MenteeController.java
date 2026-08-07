package com.abber.backend.controller;

import com.abber.backend.dto.response.MenteeProfileResponse;
import com.abber.backend.dto.response.MentorProfileResponse;
import com.abber.backend.security.CurrentUserService;
import com.abber.backend.service.interfaces.MenteeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mentee")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MENTEE','MENTOR','ADMIN')")
public class MenteeController {

    private final MenteeService menteeService;
    private final CurrentUserService currentUserService;

    @GetMapping("/assigned-mentor")
    public ResponseEntity<MentorProfileResponse> getAssignedMentor() {

        return ResponseEntity.ok(
                menteeService.getAssignedMentor(currentUserService.getUserId())
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<MenteeProfileResponse> getMyProfile() {

        return ResponseEntity.ok(
                menteeService.getMyProfile(currentUserService.getUserId())
        );
    }
}
