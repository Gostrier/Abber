package com.abber.backend.entity;

import com.abber.backend.enums.ExecutionStage;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "business_roadmaps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "business_idea_id", nullable = false)
    private BusinessIdea businessIdea;

    @Column(name = "overall_completion_percentage", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal overallCompletionPercentage = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_phase", nullable = false)
    @Builder.Default
    private ExecutionStage currentPhase = ExecutionStage.IDEATION;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "expected_completion_date")
    private LocalDate expectedCompletionDate;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "last_activity_at", nullable = false)
    private LocalDateTime lastActivityAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "roadmap", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceOrder ASC")
    @Builder.Default
    private List<MilestoneInstance> milestones = new ArrayList<>();

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (lastActivityAt == null) {
            lastActivityAt = now;
        }

        if (overallCompletionPercentage == null) {
            overallCompletionPercentage = BigDecimal.ZERO;
        }

        if (currentPhase == null) {
            currentPhase = ExecutionStage.IDEATION;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
