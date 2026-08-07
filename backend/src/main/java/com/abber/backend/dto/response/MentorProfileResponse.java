package com.abber.backend.dto.response;

import lombok.Builder;

@Builder
public record MentorProfileResponse(

        Long mentorId,

        String firstName,

        String lastName,

        String email,

        String specialty,

        String bio,

        Integer yearsOfExperience,

        String company,

        String location,

        Boolean isAvailable,

        Boolean isFeatured,

        long menteeCount,

        long ideasMentored

) {

    public String fullName() {
        return (firstName == null ? "" : firstName) + " " + (lastName == null ? "" : lastName);
    }

    public String initials() {
        StringBuilder sb = new StringBuilder();
        if (firstName != null && !firstName.isBlank()) {
            sb.append(firstName.trim().charAt(0));
        }
        if (lastName != null && !lastName.isBlank()) {
            sb.append(lastName.trim().charAt(0));
        }
        return sb.length() > 0 ? sb.toString().toUpperCase() : "?";
    }
}
