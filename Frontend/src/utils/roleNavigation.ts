export const getRoleHome = (roles: string[] = []): string => {
    if (roles.includes("ROLE_ADMIN")) {
        return "/admin";
    }

    if (roles.includes("ROLE_MENTOR")) {
        return "/mentor";
    }

    return "/dashboard";
};
