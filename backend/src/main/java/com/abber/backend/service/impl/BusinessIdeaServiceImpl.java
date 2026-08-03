package com.abber.backend.service.impl;

import com.abber.backend.dto.request.CreateBusinessIdeaRequest;
import com.abber.backend.dto.response.BusinessIdeaResponse;
import com.abber.backend.entity.BusinessIdea;
import com.abber.backend.entity.User;
import com.abber.backend.exception.ResourceNotFoundException;
import com.abber.backend.repository.BusinessIdeaRepository;
import com.abber.backend.repository.UserRepository;
import com.abber.backend.service.interfaces.BusinessIdeaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BusinessIdeaServiceImpl implements BusinessIdeaService {

    private final BusinessIdeaRepository businessIdeaRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BusinessIdeaResponse> getMyIdeas(Long userId) {

        User mentee = requireUser(userId);

        return businessIdeaRepository
                .findByMenteeAndIsArchivedFalseOrderByCreatedAtDesc(mentee)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BusinessIdeaResponse getIdeaForUser(Long ideaId, Long userId) {

        User mentee = requireUser(userId);

        return toResponse(requireIdea(ideaId, mentee));
    }

    @Override
    public BusinessIdeaResponse createIdea(
            Long userId,
            CreateBusinessIdeaRequest request
    ) {

        User mentee = requireUser(userId);

        BusinessIdea idea = BusinessIdea.builder()
                .mentee(mentee)
                .title(request.getTitle().trim())
                .elevatorPitch(request.getElevatorPitch().trim())
                .detailedDescription(request.getDetailedDescription())
                .targetMarket(request.getTargetMarket())
                .uniqueValueProposition(request.getUniqueValueProposition())
                .executionStage(request.getExecutionStage())
                .estimatedStartupCost(request.getEstimatedStartupCost())
                .projectedMonthlyRevenue(request.getProjectedMonthlyRevenue())
                .projectedMonthlyExpenses(request.getProjectedMonthlyExpenses())
                .isPublicShowcase(Boolean.TRUE.equals(request.getIsPublicShowcase()))
                .isArchived(false)
                .build();

        return toResponse(businessIdeaRepository.save(idea));
    }

    @Override
    public BusinessIdeaResponse updateIdea(
            Long ideaId,
            Long userId,
            CreateBusinessIdeaRequest request
    ) {

        User mentee = requireUser(userId);

        BusinessIdea idea = requireIdea(ideaId, mentee);

        idea.setTitle(request.getTitle().trim());
        idea.setElevatorPitch(request.getElevatorPitch().trim());
        idea.setDetailedDescription(request.getDetailedDescription());
        idea.setTargetMarket(request.getTargetMarket());
        idea.setUniqueValueProposition(request.getUniqueValueProposition());
        idea.setExecutionStage(request.getExecutionStage());
        idea.setEstimatedStartupCost(request.getEstimatedStartupCost());
        idea.setProjectedMonthlyRevenue(request.getProjectedMonthlyRevenue());
        idea.setProjectedMonthlyExpenses(request.getProjectedMonthlyExpenses());

        if (request.getIsPublicShowcase() != null) {
            idea.setIsPublicShowcase(request.getIsPublicShowcase());
        }

        return toResponse(businessIdeaRepository.save(idea));
    }

    @Override
    public void archiveIdea(Long ideaId, Long userId) {

        User mentee = requireUser(userId);

        BusinessIdea idea = requireIdea(ideaId, mentee);

        idea.setIsArchived(true);

        businessIdeaRepository.save(idea);
    }

    private BusinessIdea requireIdea(Long ideaId, User mentee) {

        return businessIdeaRepository
                .findByIdAndMenteeAndIsArchivedFalse(ideaId, mentee)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Business idea not found with id: " + ideaId
                ));
    }

    private User requireUser(Long userId) {

        return userRepository
                .findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId
                ));
    }

    private BusinessIdeaResponse toResponse(BusinessIdea idea) {

        return BusinessIdeaResponse.builder()
                .id(idea.getId())
                .title(idea.getTitle())
                .elevatorPitch(idea.getElevatorPitch())
                .detailedDescription(idea.getDetailedDescription())
                .targetMarket(idea.getTargetMarket())
                .uniqueValueProposition(idea.getUniqueValueProposition())
                .executionStage(idea.getExecutionStage())
                .estimatedStartupCost(idea.getEstimatedStartupCost())
                .projectedMonthlyRevenue(idea.getProjectedMonthlyRevenue())
                .projectedMonthlyExpenses(idea.getProjectedMonthlyExpenses())
                .isPublicShowcase(idea.getIsPublicShowcase())
                .isArchived(idea.getIsArchived())
                .createdAt(idea.getCreatedAt())
                .updatedAt(idea.getUpdatedAt())
                .build();
    }

}
