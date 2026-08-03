package com.abber.backend.mapper;

import com.abber.backend.dto.response.UserResponse;
import com.abber.backend.entity.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .uuid(user.getUuid())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .isActive(user.getIsActive())
                .emailVerified(user.getEmailVerified())
                .phoneNumber(user.getPhoneNumber())
                .county(user.getCounty())
                .town(user.getTown())
                .skills(user.getSkills())
                .createdAt(user.getCreatedAt())
                .roles(
                        user.getRoles()
                                .stream()
                                .map(role -> role.getRoleName().name())
                                .collect(Collectors.toSet())
                )
                .build();
    }
}
