package com.abber.backend.controller;

import com.abber.backend.dto.response.MentorProfileResponse;
import com.abber.backend.service.interfaces.MentorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final MentorService mentorService;

    @GetMapping("/mentors")
    public ResponseEntity<List<MentorProfileResponse>> getPublicMentors() {

        return ResponseEntity.ok(mentorService.getPublicMentors());
    }

    @GetMapping("/mentors/{mentorId}")
    public ResponseEntity<MentorProfileResponse> getPublicMentor(
            @PathVariable Long mentorId
    ) {

        return ResponseEntity.ok(
                mentorService.getMyProfile(mentorId)
        );
    }
}
