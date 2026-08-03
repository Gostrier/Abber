package com.abber.backend.mapper;

import com.abber.backend.dto.response.RoleResponse;
import com.abber.backend.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    public RoleResponse toResponse(Role role) {

        return RoleResponse.builder()
                .id(role.getId())
                .roleName(role.getRoleName())
                .build();
    }
}