package com.abber.backend.controller;

import com.abber.backend.dto.request.CreateBusinessIdeaRequest;
import com.abber.backend.dto.response.BusinessIdeaResponse;
import com.abber.backend.security.CurrentUserService;
import com.abber.backend.service.interfaces.BusinessIdeaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ideas")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MENTEE','MENTOR','ADMIN')")
public class BusinessIdeaController {

    private final BusinessIdeaService businessIdeaService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public ResponseEntity<List<BusinessIdeaResponse>> getMyIdeas() {

        return ResponseEntity.ok(
                businessIdeaService.getMyIdeas(currentUserService.getUserId())
        );
    }

    @GetMapping("/{ideaId}")
    public ResponseEntity<BusinessIdeaResponse> getIdea(
            @PathVariable Long ideaId
    ) {

        return ResponseEntity.ok(
                businessIdeaService.getIdeaForUser(
                        ideaId,
                        currentUserService.getUserId()
                )
        );
    }

    @PostMapping
    public ResponseEntity<BusinessIdeaResponse> createIdea(
            @Valid @RequestBody CreateBusinessIdeaRequest request
    ) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                businessIdeaService.createIdea(
                        currentUserService.getUserId(),
                        request
                )
        );
    }

    @PutMapping("/{ideaId}")
    public ResponseEntity<BusinessIdeaResponse> updateIdea(
            @PathVariable Long ideaId,
            @Valid @RequestBody CreateBusinessIdeaRequest request
    ) {

        return ResponseEntity.ok(
                businessIdeaService.updateIdea(
                        ideaId,
                        currentUserService.getUserId(),
                        request
                )
        );
    }

    @DeleteMapping("/{ideaId}")
    public ResponseEntity<Void> archiveIdea(
            @PathVariable Long ideaId
    ) {

        businessIdeaService.archiveIdea(
                ideaId,
                currentUserService.getUserId()
        );

        return ResponseEntity.noContent().build();
    }

}
