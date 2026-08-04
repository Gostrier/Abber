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

    void sendPasswordResetEmail(
            String recipientEmail,
            String recipientName,
            String resetLink
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