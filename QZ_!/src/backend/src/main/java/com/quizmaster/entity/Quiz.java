package com.quizmaster.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
@EntityListeners(AuditingEntityListener.class)
public class Quiz {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String title;
    
    @Size(max = 1000)
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ElementCollection
    @CollectionTable(name = "quiz_tags", joinColumns = @JoinColumn(name = "quiz_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();
    
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();
    
    @Column(name = "randomize_questions")
    private boolean randomizeQuestions = false;
    
    @Embedded
    private QuizTheme theme;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    @JsonIgnore
    private User creator;
    
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuizAttempt> attempts = new ArrayList<>();
    
    // Constructors
    public Quiz() {}
    
    public Quiz(String title, String description, User creator) {
        this.title = title;
        this.description = description;
        this.creator = creator;
        this.theme = new QuizTheme();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    
    public List<Question> getQuestions() {
        return questions;
    }
    
    public void setQuestions(List<Question> questions) {
        this.questions = questions;
        // Set the quiz reference for each question
        if (questions != null) {
            questions.forEach(question -> question.setQuiz(this));
        }
    }
    
    public boolean isRandomizeQuestions() {
        return randomizeQuestions;
    }
    
    public void setRandomizeQuestions(boolean randomizeQuestions) {
        this.randomizeQuestions = randomizeQuestions;
    }
    
    public QuizTheme getTheme() {
        return theme;
    }
    
    public void setTheme(QuizTheme theme) {
        this.theme = theme;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public User getCreator() {
        return creator;
    }
    
    public void setCreator(User creator) {
        this.creator = creator;
    }
    
    public List<QuizAttempt> getAttempts() {
        return attempts;
    }
    
    public void setAttempts(List<QuizAttempt> attempts) {
        this.attempts = attempts;
    }
    
    // Helper method to add a question
    public void addQuestion(Question question) {
        questions.add(question);
        question.setQuiz(this);
    }
    
    // Helper method to remove a question
    public void removeQuestion(Question question) {
        questions.remove(question);
        question.setQuiz(null);
    }
}