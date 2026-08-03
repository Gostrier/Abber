package com.abber.backend.service.interfaces;

import com.abber.backend.dto.request.RegisterRequest;
import com.abber.backend.entity.User;

import java.util.List;
import java.util.UUID;

public interface UserService {

    User register(RegisterRequest request);

    User getUserById(Long id);

    User getUserByUuid(UUID uuid);

    User getUserByEmail(String email);

    List<User> getAllUsers();

    User activateUser(UUID uuid);

    User deactivateUser(UUID uuid);

    void deleteUser(Long id);

}