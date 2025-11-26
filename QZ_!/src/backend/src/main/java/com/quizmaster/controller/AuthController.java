package com.quizmaster.controller;

import com.quizmaster.dto.*;
import com.quizmaster.security.JwtUtils;
import com.quizmaster.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody UserLoginDto loginRequest) {
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserResponseDto userDetails = userService.getUserByEmail(loginRequest.getEmail());
        
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, userDetails, jwtUtils.getJwtExpirationMs()));
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDto signUpRequest) {
        
        // Validate password confirmation
        if (!signUpRequest.getPassword().equals(signUpRequest.getConfirmPassword())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Passwords do not match!"));
        }
        
        UserResponseDto user = userService.createUser(signUpRequest);
        
        // Generate JWT token for the new user
        String jwt = jwtUtils.generateTokenFromEmail(user.getEmail());
        
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, user, jwtUtils.getJwtExpirationMs()));
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7); // Remove "Bearer " prefix
        
        if (jwtUtils.validateJwtToken(jwt)) {
            String email = jwtUtils.getEmailFromJwtToken(jwt);
            String newToken = jwtUtils.generateTokenFromEmail(email);
            UserResponseDto userDetails = userService.getUserByEmail(email);
            
            return ResponseEntity.ok(new JwtAuthenticationResponse(newToken, userDetails, jwtUtils.getJwtExpirationMs()));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid token"));
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7); // Remove "Bearer " prefix
        
        if (jwtUtils.validateJwtToken(jwt)) {
            String email = jwtUtils.getEmailFromJwtToken(jwt);
            UserResponseDto userDetails = userService.getUserByEmail(email);
            return ResponseEntity.ok(userDetails);
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid token"));
        }
    }
    
    // Helper class for simple messages
    public static class MessageResponse {
        private String message;
        
        public MessageResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}