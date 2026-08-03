package com.abber.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.abber.backend.dto.request.RegisterRequest;
import com.abber.backend.entity.Role;
import com.abber.backend.entity.User;
import com.abber.backend.enums.RoleType;
import com.abber.backend.exception.DuplicateResourceException;
import com.abber.backend.exception.ResourceNotFoundException;
import com.abber.backend.repository.RoleRepository;
import com.abber.backend.repository.UserRepository;
import com.abber.backend.service.interfaces.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User register(RegisterRequest request) {

        if (request.getEmail() == null) {
            throw new IllegalArgumentException("Email cannot be null.");
        }
        if (request.getPassword() == null) {
            throw new IllegalArgumentException("Password cannot be null.");
        }

        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email is already registered."
            );
        }

        Role menteeRole = roleRepository.findByRoleName(RoleType.ROLE_MENTEE)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Default role ROLE_MENTEE not found."
                        )
                );

        User user = User.builder()
                .uuid(UUID.randomUUID())
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .isActive(true)
                .emailVerified(false)
                .lastLoginAt(null)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        user.addRole(menteeRole);

        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User with ID " + id + " not found."
                        )
                );
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserByUuid(UUID uuid) {
        return userRepository.findByUuid(uuid)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        )
                );
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        )
                );
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User activateUser(UUID uuid) {
        User user = getUserByUuid(uuid);
        user.setIsActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public User deactivateUser(UUID uuid) {
        User user = getUserByUuid(uuid);
        user.setIsActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}
