package com.quizmaster.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "answers")
public class Answer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    @JsonIgnore
    private QuizAttempt attempt;
    
    @NotNull
    @Column(name = "question_id", nullable = false)
    private Long questionId;
    
    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answer;
    
    @Min(1)
    @Max(5)
    @Column(name = "confidence_level")
    private Integer confidenceLevel = 3;
    
    @Column(name = "used_hint")
    private boolean usedHint = false;
    
    @Column(name = "time_spent") // Time spent on this question in seconds
    private Integer timeSpent = 0;
    
    @Column(name = "is_correct")
    private Boolean isCorrect;
    
    @Column(name = "points_earned")
    private Double pointsEarned = 0.0;
    
    // Constructors
    public Answer() {}
    
    public Answer(Long questionId, String answer, Integer confidenceLevel) {
        this.questionId = questionId;
        this.answer = answer;
        this.confidenceLevel = confidenceLevel;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public QuizAttempt getAttempt() {
        return attempt;
    }
    
    public void setAttempt(QuizAttempt attempt) {
        this.attempt = attempt;
    }
    
    public Long getQuestionId() {
        return questionId;
    }
    
    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }
    
    public String getAnswer() {
        return answer;
    }
    
    public void setAnswer(String answer) {
        this.answer = answer;
    }
    
    public Integer getConfidenceLevel() {
        return confidenceLevel;
    }
    
    public void setConfidenceLevel(Integer confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }
    
    public boolean isUsedHint() {
        return usedHint;
    }
    
    public void setUsedHint(boolean usedHint) {
        this.usedHint = usedHint;
    }
    
    public Integer getTimeSpent() {
        return timeSpent;
    }
    
    public void setTimeSpent(Integer timeSpent) {
        this.timeSpent = timeSpent;
    }
    
    public Boolean getIsCorrect() {
        return isCorrect;
    }
    
    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
    
    public Double getPointsEarned() {
        return pointsEarned;
    }
    
    public void setPointsEarned(Double pointsEarned) {
        this.pointsEarned = pointsEarned;
    }
}