package com.abber.backend.entity;

import com.abber.backend.enums.ExecutionStage;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "business_ideas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessIdea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mentee_id", nullable = false)
    private User mentee;

    @Column(nullable = false)
    private String title;

    @Column(name = "elevator_pitch", nullable = false)
    private String elevatorPitch;

    @Column(name = "detailed_description")
    private String detailedDescription;

    @Column(name = "target_market")
    private String targetMarket;

    @Column(name = "unique_value_proposition")
    private String uniqueValueProposition;

    @Enumerated(EnumType.STRING)
    @Column(name = "execution_stage", nullable = false)
    private ExecutionStage executionStage;

    @Column(name = "estimated_startup_cost")
    private BigDecimal estimatedStartupCost;

    @Column(name = "projected_monthly_revenue")
    private BigDecimal projectedMonthlyRevenue;

    @Column(name = "projected_monthly_expenses")
    private BigDecimal projectedMonthlyExpenses;

    @Column(name = "is_public_showcase", nullable = false)
    @Builder.Default
    private Boolean isPublicShowcase = false;

    @Column(name = "is_archived", nullable = false)
    @Builder.Default
    private Boolean isArchived = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (executionStage == null) {
            executionStage = ExecutionStage.IDEATION;
        }

        if (isPublicShowcase == null) {
            isPublicShowcase = false;
        }

        if (isArchived == null) {
            isArchived = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
