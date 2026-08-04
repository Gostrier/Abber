package com.abber.backend.service.interfaces;

import com.abber.backend.dto.request.ChangePasswordRequest;
import com.abber.backend.dto.request.ForgotPasswordRequest;
import com.abber.backend.dto.request.LoginRequest;
import com.abber.backend.dto.request.RegisterRequest;
import com.abber.backend.dto.request.ResetPasswordRequest;
import com.abber.backend.dto.response.AuthResponse;

public interface AuthenticationService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(String refreshToken);

    void logout(String refreshToken);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    void changePassword(Long userId, ChangePasswordRequest request);
}
