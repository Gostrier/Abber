package com.abber.backend.service.impl;

import com.abber.backend.dto.request.CreateMilestoneRequest;
import com.abber.backend.dto.request.UpdateMilestoneStatusRequest;
import com.abber.backend.dto.response.BusinessRoadmapResponse;
import com.abber.backend.dto.response.MilestoneResponse;
import com.abber.backend.entity.BusinessIdea;
import com.abber.backend.entity.BusinessRoadmap;
import com.abber.backend.entity.MilestoneInstance;
import com.abber.backend.entity.User;
import com.abber.backend.enums.MilestoneStatus;
import com.abber.backend.exception.ResourceNotFoundException;
import com.abber.backend.repository.BusinessIdeaRepository;
import com.abber.backend.repository.MilestoneInstanceRepository;
import com.abber.backend.repository.RoadmapRepository;
import com.abber.backend.repository.UserRepository;
import com.abber.backend.service.interfaces.ActivityLogService;
import com.abber.backend.service.interfaces.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoadmapServiceImpl implements RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final MilestoneInstanceRepository milestoneRepository;
    private final BusinessIdeaRepository businessIdeaRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    @Override
    @Transactional(readOnly = true)
    public BusinessRoadmapResponse getRoadmapForIdea(Long ideaId, Long userId) {

        requireUser(userId);

        BusinessRoadmap roadmap = roadmapRepository
                .findByBusinessIdeaId(ideaId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Roadmap not found for idea id: " + ideaId
                ));

        ensureOwnership(roadmap, userId);

        return toRoadmapResponse(roadmap);
    }

    @Override
    public BusinessRoadmapResponse createRoadmapForIdea(Long ideaId, Long userId) {

        requireUser(userId);

        return roadmapRepository.findByBusinessIdeaId(ideaId)
                .map(this::toRoadmapResponse)
                .orElseGet(() -> {

                    BusinessIdea idea = businessIdeaRepository.findById(ideaId)
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Business idea not found with id: " + ideaId
                            ));

                    if (!idea.getMentee().getId().equals(userId)) {
                        throw new ResourceNotFoundException(
                                "Business idea not found with id: " + ideaId
                        );
                    }

                    BusinessRoadmap roadmap = BusinessRoadmap.builder()
                            .businessIdea(idea)
                            .currentPhase(idea.getExecutionStage())
                            .startedAt(LocalDateTime.now())
                            .milestones(new ArrayList<>())
                            .build();

                    return toRoadmapResponse(roadmapRepository.save(roadmap));
                });
    }

    @Override
    @Transactional(readOnly = true)
    public List<MilestoneResponse> getMilestones(Long roadmapId, Long userId) {

        requireUser(userId);

        BusinessRoadmap roadmap = requireRoadmap(roadmapId);

        ensureOwnership(roadmap, userId);

        return milestoneRepository
                .findByRoadmapIdOrderBySequenceOrderAsc(roadmapId)
                .stream()
                .map(this::toMilestoneResponse)
                .toList();
    }

    @Override
    public MilestoneResponse addMilestone(
            Long roadmapId,
            Long userId,
            CreateMilestoneRequest request
    ) {

        requireUser(userId);

        BusinessRoadmap roadmap = requireRoadmap(roadmapId);

        ensureOwnership(roadmap, userId);

        MilestoneInstance milestone = MilestoneInstance.builder()
                .roadmap(roadmap)
                .sequenceOrder(request.getSequenceOrder())
                .taskTitle(request.getTaskTitle().trim())
                .taskDescription(request.getTaskDescription() == null
                        ? ""
                        : request.getTaskDescription().trim())
                .dueDate(request.getDueDate())
                .status(MilestoneStatus.LOCKED)
                .build();

        milestoneRepository.save(milestone);

        roadmap.setLastActivityAt(LocalDateTime.now());

        roadmapRepository.save(roadmap);

        return toMilestoneResponse(milestone);
    }

    @Override
    public MilestoneResponse updateMilestoneStatus(
            Long milestoneId,
            Long userId,
            UpdateMilestoneStatusRequest request
    ) {

        requireUser(userId);

        MilestoneInstance milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Milestone not found with id: " + milestoneId
                ));

        ensureOwnership(milestone.getRoadmap(), userId);

        milestone.setStatus(request.getStatus());

        if (request.getStatus() == MilestoneStatus.COMPLETED) {
            milestone.setCompletedAt(LocalDateTime.now());

            activityLogService.record(
                    milestone.getRoadmap().getBusinessIdea().getMentee().getEmail(),
                    "Milestone completed",
                    "Completed the milestone \"" + milestone.getTaskTitle() + "\"."
            );
        } else {
            milestone.setCompletedAt(null);
        }

        milestoneRepository.save(milestone);

        recomputeProgress(milestone.getRoadmap());

        return toMilestoneResponse(milestone);
    }

    private void recomputeProgress(BusinessRoadmap roadmap) {

        long total = milestoneRepository.countByRoadmapId(roadmap.getId());
        long completed = milestoneRepository.countByRoadmapIdAndStatus(
                roadmap.getId(),
                MilestoneStatus.COMPLETED
        );

        BigDecimal progress = total == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(completed)
                        .multiply(BigDecimal.valueOf(100))
                        .divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);

        roadmap.setOverallCompletionPercentage(progress);
        roadmap.setLastActivityAt(LocalDateTime.now());

        roadmapRepository.save(roadmap);
    }

    private void ensureOwnership(BusinessRoadmap roadmap, Long userId) {

        if (!roadmap.getBusinessIdea().getMentee().getId().equals(userId)) {
            throw new ResourceNotFoundException(
                    "Roadmap not found for user"
            );
        }
    }

    private BusinessRoadmap requireRoadmap(Long roadmapId) {

        return roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Roadmap not found with id: " + roadmapId
                ));
    }

    private User requireUser(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId
                ));
    }

    private BusinessRoadmapResponse toRoadmapResponse(BusinessRoadmap roadmap) {

        return BusinessRoadmapResponse.builder()
                .id(roadmap.getId())
                .businessIdeaId(roadmap.getBusinessIdea().getId())
                .overallCompletionPercentage(roadmap.getOverallCompletionPercentage())
                .currentPhase(roadmap.getCurrentPhase())
                .startedAt(roadmap.getStartedAt())
                .expectedCompletionDate(roadmap.getExpectedCompletionDate())
                .completedAt(roadmap.getCompletedAt())
                .lastActivityAt(roadmap.getLastActivityAt())
                .milestones(roadmap.getMilestones()
                        .stream()
                        .map(this::toMilestoneResponse)
                        .toList())
                .build();
    }

    private MilestoneResponse toMilestoneResponse(MilestoneInstance milestone) {

        return MilestoneResponse.builder()
                .id(milestone.getId())
                .sequenceOrder(milestone.getSequenceOrder())
                .taskTitle(milestone.getTaskTitle())
                .taskDescription(milestone.getTaskDescription())
                .status(milestone.getStatus())
                .mentorNotes(milestone.getMentorNotes())
                .dueDate(milestone.getDueDate())
                .completedAt(milestone.getCompletedAt())
                .build();
    }

}
