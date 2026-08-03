package com.abber.backend.seed;

import com.abber.backend.entity.Role;
import com.abber.backend.entity.User;
import com.abber.backend.enums.RoleType;
import com.abber.backend.repository.RoleRepository;
import com.abber.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminUserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@abber.local}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) {

        String email = adminEmail.trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            return;
        }

        if (adminPassword == null || adminPassword.length() < 8) {

            log.warn(
                    "Skipping admin user seed. Set app.admin.password (min 8 chars) or ADMIN_PASSWORD to enable it."
            );

            return;
        }

        Role adminRole = roleRepository.findByRoleName(RoleType.ROLE_ADMIN)
                .orElseThrow(() ->
                        new IllegalStateException("ROLE_ADMIN role not found."));

        User admin = User.builder()
                .uuid(UUID.randomUUID())
                .firstName("Abber")
                .lastName("Admin")
                .email(email)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .isActive(true)
                .emailVerified(true)
                .build();

        admin.addRole(adminRole);

        userRepository.save(admin);

        log.info("Seeded default admin user: {}", email);
    }
}
