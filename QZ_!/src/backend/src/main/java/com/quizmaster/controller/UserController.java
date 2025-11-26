package com.quizmaster.controller;

import com.quizmaster.dto.UserRegistrationDto;
import com.quizmaster.dto.UserResponseDto;
import com.quizmaster.security.UserPrincipal;
import com.quizmaster.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserResponseDto> getCurrentUser(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        UserResponseDto user = userService.getUserById(userPrincipal.getId());
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserResponseDto> updateCurrentUser(
            @Valid @RequestBody UserRegistrationDto updateRequest,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        UserResponseDto updatedUser = userService.updateUser(userPrincipal.getId(), updateRequest);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteCurrentUser(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        userService.deleteUser(userPrincipal.getId());
        return ResponseEntity.ok().body(new MessageResponse("User account deleted successfully"));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        UserResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")  // Only admins can view all users
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<UserResponseDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")  // Only admins can create users
    public ResponseEntity<UserResponseDto> createUser(@Valid @RequestBody UserRegistrationDto registrationDto) {
        UserResponseDto user = userService.createUser(registrationDto);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")  // Only admins can update other users
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRegistrationDto updateRequest) {
        UserResponseDto updatedUser = userService.updateUser(id, updateRequest);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")  // Only admins can delete other users
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().body(new MessageResponse("User deleted successfully"));
    }
    
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsernameExists(@RequestParam String username) {
        boolean exists = userService.existsByUsername(username);
        return ResponseEntity.ok(exists);
    }
    
    // Profile endpoints
    @GetMapping("/profile/{id}")
    public ResponseEntity<UserProfileDto> getUserProfile(@PathVariable Long id) {
        UserResponseDto user = userService.getUserById(id);
        // Convert to public profile (excluding sensitive information)
        UserProfileDto profile = new UserProfileDto(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getCreatedAt()
        );
        return ResponseEntity.ok(profile);
    }
    
    // Helper classes
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
    
    public static class UserProfileDto {
        private Long id;
        private String username;
        private String firstName;
        private String lastName;
        private java.time.LocalDateTime createdAt;
        
        public UserProfileDto(Long id, String username, String firstName, String lastName, java.time.LocalDateTime createdAt) {
            this.id = id;
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
            this.createdAt = createdAt;
        }
        
        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}