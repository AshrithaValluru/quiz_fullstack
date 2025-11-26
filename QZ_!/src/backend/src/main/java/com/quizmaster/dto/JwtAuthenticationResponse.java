package com.quizmaster.dto;

public class JwtAuthenticationResponse {
    
    private String token;
    private String type = "Bearer";
    private UserResponseDto user;
    private Long expiresIn;
    
    // Constructors
    public JwtAuthenticationResponse() {}
    
    public JwtAuthenticationResponse(String token, UserResponseDto user, Long expiresIn) {
        this.token = token;
        this.user = user;
        this.expiresIn = expiresIn;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public UserResponseDto getUser() {
        return user;
    }
    
    public void setUser(UserResponseDto user) {
        this.user = user;
    }
    
    public Long getExpiresIn() {
        return expiresIn;
    }
    
    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }
}