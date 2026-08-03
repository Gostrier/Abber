package com.abber.backend.controller;

import com.abber.backend.dto.request.CreateMilestoneRequest;
import com.abber.backend.dto.request.UpdateMilestoneStatusRequest;
import com.abber.backend.dto.response.BusinessRoadmapResponse;
import com.abber.backend.dto.response.MilestoneResponse;
import com.abber.backend.security.CurrentUserService;
import com.abber.backend.service.interfaces.RoadmapService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MENTEE','MENTOR','ADMIN')")
public class RoadmapController {

    private final RoadmapService roadmapService;
    private final CurrentUserService currentUserService;

    @GetMapping("/ideas/{ideaId}/roadmap")
    public ResponseEntity<BusinessRoadmapResponse> getRoadmap(
            @PathVariable Long ideaId
    ) {

        return ResponseEntity.ok(
                roadmapService.getRoadmapForIdea(
                        ideaId,
                        currentUserService.getUserId()
                )
        );
    }

    @PostMapping("/ideas/{ideaId}/roadmap")
    public ResponseEntity<BusinessRoadmapResponse> createRoadmap(
            @PathVariable Long ideaId
    ) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                roadmapService.createRoadmapForIdea(
                        ideaId,
                        currentUserService.getUserId()
                )
        );
    }

    @GetMapping("/roadmaps/{roadmapId}/milestones")
    public ResponseEntity<List<MilestoneResponse>> getMilestones(
            @PathVariable Long roadmapId
    ) {

        return ResponseEntity.ok(
                roadmapService.getMilestones(
                        roadmapId,
                        currentUserService.getUserId()
                )
        );
    }

    @PostMapping("/roadmaps/{roadmapId}/milestones")
    public ResponseEntity<MilestoneResponse> addMilestone(
            @PathVariable Long roadmapId,
            @Valid @RequestBody CreateMilestoneRequest request
    ) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                roadmapService.addMilestone(
                        roadmapId,
                        currentUserService.getUserId(),
                        request
                )
        );
    }

    @PatchMapping("/milestones/{milestoneId}/status")
    public ResponseEntity<MilestoneResponse> updateMilestoneStatus(
            @PathVariable Long milestoneId,
            @Valid @RequestBody UpdateMilestoneStatusRequest request
    ) {

        return ResponseEntity.ok(
                roadmapService.updateMilestoneStatus(
                        milestoneId,
                        currentUserService.getUserId(),
                        request
                )
        );
    }

}
