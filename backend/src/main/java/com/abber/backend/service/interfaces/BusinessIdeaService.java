package com.abber.backend.service.interfaces;

import com.abber.backend.dto.request.CreateBusinessIdeaRequest;
import com.abber.backend.dto.response.BusinessIdeaResponse;

import java.util.List;

public interface BusinessIdeaService {

    List<BusinessIdeaResponse> getMyIdeas(Long userId);

    BusinessIdeaResponse getIdeaForUser(Long ideaId, Long userId);

    BusinessIdeaResponse createIdea(Long userId, CreateBusinessIdeaRequest request);

    BusinessIdeaResponse updateIdea(Long ideaId, Long userId, CreateBusinessIdeaRequest request);

    void archiveIdea(Long ideaId, Long userId);

}
