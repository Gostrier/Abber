package com.abber.backend.dto.response;

import com.abber.backend.enums.RoleType;
import lombok.Builder;

@Builder
public record RoleResponse(

        Integer id,

        RoleType roleName

) {}