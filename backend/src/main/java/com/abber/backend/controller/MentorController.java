package com.abber.backend.controller;

import com.abber.backend.dto.request.UpdateMilestoneNotesRequest;
import com.abber.backend.dto.response.AdminUserResponse;
import com.abber.backend.dto.response.MentorProfileResponse;
import com.abber.backend.dto.response.MilestoneResponse;
import com.abber.backend.dto.response.UserProgressResponse;
import com.abber.backend.security.CurrentUserService;
import com.abber.backend.service.interfaces.MentorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentor")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MENTOR','ADMIN')")
public class MentorController {

    private final MentorService mentorService;
    private final CurrentUserService currentUserService;

    @GetMapping("/profile")
    public ResponseEntity<MentorProfileResponse> getMyProfile() {

        return ResponseEntity.ok(mentorService.getMyProfile(currentUserService.getUserId()));
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getMyMentees() {

        return ResponseEntity.ok(mentorService.getMyMentees(currentUserService.getUserId()));
    }

    @GetMapping("/users/{userId}/progress")
    public ResponseEntity<UserProgressResponse> getMenteeProgress(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(mentorService.getMenteeProgress(
                currentUserService.getUserId(),
                userId
        ));
    }

    @PutMapping("/milestones/{milestoneId}/notes")
    public ResponseEntity<MilestoneResponse> addMilestoneNotes(
            @PathVariable Long milestoneId,
            @Valid @RequestBody UpdateMilestoneNotesRequest request
    ) {

        return ResponseEntity.ok(mentorService.addMilestoneNotes(
                milestoneId,
                currentUserService.getUserId(),
                request.getNotes()
        ));
    }

}
