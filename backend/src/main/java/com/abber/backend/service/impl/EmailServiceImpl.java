package com.abber.backend.service.impl;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.abber.backend.service.interfaces.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Override
    @Async
    public void sendEmail(String to,
                          String subject,
                          String body) {

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            log.info("Email sent to {}", to);
        } catch (MailException ex) {
            log.warn("Failed to send email to {}: {}", to, ex.getMessage());
        }
    }

    @Override
    @Async
    public void sendHtmlEmail(String to,
                              String subject,
                              String htmlContent) {

        try {

            MimeMessage mimeMessage = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);

            log.info("HTML email sent to {}", to);

        } catch (MessagingException ex) {

            log.warn("Failed to build email to {}: {}", to, ex.getMessage());

        } catch (MailException ex) {

            log.warn("Failed to send email to {}: {}", to, ex.getMessage());
        }
    }

    @Override
    @Async
    public void sendVerificationEmail(
            String recipientEmail,
            String recipientName,
            String verificationLink
    ) {

        String html = """
                <html>
                <body style="font-family:Arial">

                    <h2>Welcome to Abber</h2>

                    <p>Hello %s,</p>

                    <p>
                        Thank you for joining Abber.
                        Please verify your email by clicking
                        the button below.
                    </p>

                    <a href="%s"
                       style="
                            background:#2563eb;
                            color:white;
                            padding:12px 20px;
                            text-decoration:none;
                            border-radius:6px;">
                        Verify Email
                    </a>

                    <p>
                        If you didn't register,
                        simply ignore this email.
                    </p>

                </body>
                </html>
                """.formatted(recipientName, verificationLink);

        sendHtmlEmail(
                recipientEmail,
                "Verify your Abber account",
                html
        );
    }

    @Override
    @Async
    public void sendPasswordResetEmail(
            String recipientEmail,
            String recipientName,
            String resetLink
    ) {

        String html = """
                <h2>Password Reset</h2>
                <p>Hello %s,</p>
                <p>Click below to reset your password.</p>

                <a href="%s">
                    Reset Password
                </a>
                """.formatted(recipientName, resetLink);

        sendHtmlEmail(
                recipientEmail,
                "Reset Password",
                html
        );
    }

    @Override
    @Async
    public void sendWelcomeEmail(
            String recipientEmail,
            String recipientName
    ) {

        String html = """
                <h2>Welcome to Abber</h2>

                <p>Hello %s,</p>

                <p>
                    Your email has been verified successfully.
                    Welcome to the Abber community.
                </p>
                """.formatted(recipientName);

        sendHtmlEmail(
                recipientEmail,
                "Welcome to Abber",
                html
        );
    }

    @Override
    @Async
    public void sendMentorInvitation(
            String recipientEmail,
            String inviterName,
            String invitationLink
    ) {

        String html = """
                <h2>Mentor Invitation</h2>

                <p>%s invited you to become a mentor.</p>

                <a href="%s">
                    Accept Invitation
                </a>
                """.formatted(inviterName, invitationLink);

        sendHtmlEmail(
                recipientEmail,
                "Mentor Invitation",
                html
        );
    }

    @Override
    public void sendNotification(
            String recipientEmail,
            String subject,
            String message
    ) {

        sendHtmlEmail(
                recipientEmail,
                subject,
                "<p>" + message + "</p>"
        );
    }

}
