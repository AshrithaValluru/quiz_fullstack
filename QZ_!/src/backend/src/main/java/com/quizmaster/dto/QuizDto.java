package com.quizmaster.dto;

import com.quizmaster.entity.Quiz;
import com.quizmaster.entity.QuizTheme;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class QuizDto {
    
    private Long id;
    private String title;
    private String description;
    private List<String> tags;
    private List<QuestionDto> questions;
    private boolean randomizeQuestions;
    private QuizTheme theme;
    private LocalDateTime createdAt;
    private Long creatorId;
    private String creatorName;
    
    // Constructors
    public QuizDto() {}
    
    public QuizDto(Quiz quiz) {
        this.id = quiz.getId();
        this.title = quiz.getTitle();
        this.description = quiz.getDescription();
        this.tags = quiz.getTags();
        this.questions = quiz.getQuestions().stream()
            .map(QuestionDto::new)
            .collect(Collectors.toList());
        this.randomizeQuestions = quiz.isRandomizeQuestions();
        this.theme = quiz.getTheme();
        this.createdAt = quiz.getCreatedAt();
        this.creatorId = quiz.getCreator().getId();
        this.creatorName = quiz.getCreator().getFirstName() + " " + quiz.getCreator().getLastName();
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
    
    public List<QuestionDto> getQuestions() {
        return questions;
    }
    
    public void setQuestions(List<QuestionDto> questions) {
        this.questions = questions;
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
    
    public Long getCreatorId() {
        return creatorId;
    }
    
    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }
    
    public String getCreatorName() {
        return creatorName;
    }
    
    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }
}