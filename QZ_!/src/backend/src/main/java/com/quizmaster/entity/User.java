package com.quizmaster.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email"),
    @UniqueConstraint(columnNames = "username")
})
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 100)
    @Email
    @Column(nullable = false, unique = true)
    private String email;
    
    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, unique = true)
    private String username;
    
    @NotBlank
    @Size(max = 100)
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @NotBlank
    @Size(max = 100)
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @JsonIgnore
    @NotBlank
    @Size(max = 120)
    @Column(nullable = false)
    private String password;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Quiz> createdQuizzes = new ArrayList<>();
    
    // Constructors
    public User() {}
    
    public User(String email, String username, String firstName, String lastName, String password) {
        this.email = email;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<Quiz> getCreatedQuizzes() {
        return createdQuizzes;
    }
    
    public void setCreatedQuizzes(List<Quiz> createdQuizzes) {
        this.createdQuizzes = createdQuizzes;
    }
}