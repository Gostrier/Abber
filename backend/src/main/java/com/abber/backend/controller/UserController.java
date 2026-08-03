package com.abber.backend.controller;

import com.abber.backend.dto.response.UserResponse;
import com.abber.backend.mapper.UserMapper;
import com.abber.backend.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final CurrentUserService currentUserService;
    private final UserMapper userMapper;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUser() {

        return ResponseEntity.ok(
                userMapper.toResponse(currentUserService.getUser())
        );
    }
}
