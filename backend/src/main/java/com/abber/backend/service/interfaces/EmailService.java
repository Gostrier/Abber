package com.abber.backend.service.interfaces;

public interface EmailService {

    void sendEmail(
            String to,
            String subject,
            String body
    );

    void sendHtmlEmail(
            String to,
            String subject,
            String htmlContent
    );

    void sendVerificationEmail(
            String recipientEmail,
            String recipientName,
            String verificationLink
    );

    void sendPasswordResetEmail(
            String recipientEmail,
            String recipientName,
            String resetLink
    );

    void sendWelcomeEmail(
            String recipientEmail,
            String recipientName
    );

    void sendMentorInvitation(
            String recipientEmail,
            String inviterName,
            String invitationLink
    );

    void sendNotification(
            String recipientEmail,
            String subject,
            String message
    );
}