package com.abber.backend.controller;

import com.abber.backend.dto.response.RoleResponse;
import com.abber.backend.mapper.RoleMapper;
import com.abber.backend.service.interfaces.RoleService;
import com.abber.backend.util.ApiResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService service;
    private final RoleMapper mapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getRoles() {

        List<RoleResponse> response = service.getAllRoles()
                .stream()
                .map(mapper::toResponse)
                .toList();

        return ResponseEntity.ok(

                ApiResponse.<List<RoleResponse>>builder()

                        .success(true)

                        .message("Roles retrieved successfully.")

                        .data(response)

                        .build()

        );
    }

}
