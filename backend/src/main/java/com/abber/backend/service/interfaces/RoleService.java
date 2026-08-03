package com.abber.backend.service.interfaces;

import com.abber.backend.entity.Role;
import com.abber.backend.enums.RoleType;

import java.util.List;

public interface RoleService {

    Role createRole(RoleType roleName);

    List<Role> getAllRoles();

    Role getRoleById(Integer id);

    Role getRoleByName(RoleType roleName);

}