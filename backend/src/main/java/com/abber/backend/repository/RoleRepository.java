package com.abber.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abber.backend.entity.Role;
import com.abber.backend.enums.RoleType;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByRoleName(RoleType roleName);

    boolean existsByRoleName(RoleType roleName);

}
