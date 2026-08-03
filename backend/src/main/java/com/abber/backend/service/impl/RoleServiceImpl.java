package com.abber.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.abber.backend.entity.Role;
import com.abber.backend.enums.RoleType;
import com.abber.backend.exception.DuplicateResourceException;
import com.abber.backend.exception.ResourceNotFoundException;
import com.abber.backend.repository.RoleRepository;
import com.abber.backend.service.interfaces.RoleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository repository;

    @Override
    public Role createRole(RoleType roleName) {

        if (repository.existsByRoleName(roleName)) {
            throw new DuplicateResourceException(
                    "Role '" + roleName + "' already exists."
            );
        }

        Role role = Role.builder()
                .roleName(roleName)
                .build();

        return repository.save(role);
    }

    @Override
    public List<Role> getAllRoles() {
        return repository.findAll();
    }

    @Override
    public Role getRoleById(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role with ID " + id + " was not found."
                        )
                );
    }

    @Override
    public Role getRoleByName(RoleType roleName) {

        return repository.findByRoleName(roleName)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role '" + roleName + "' was not found."
                        )
                );
    }
}