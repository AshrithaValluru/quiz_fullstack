package com.quizmaster.dto;

import com.quizmaster.entity.Answer;

public class AnswerDto {
    
    private Long id;
    private Long questionId;
    private String answer;
    private Integer confidenceLevel;
    private boolean usedHint;
    private Integer timeSpent;
    private Boolean isCorrect;
    private Double pointsEarned;
    
    // Constructors
    public AnswerDto() {}
    
    public AnswerDto(Answer answer) {
        this.id = answer.getId();
        this.questionId = answer.getQuestionId();
        this.answer = answer.getAnswer();
        this.confidenceLevel = answer.getConfidenceLevel();
        this.usedHint = answer.isUsedHint();
        this.timeSpent = answer.getTimeSpent();
        this.isCorrect = answer.getIsCorrect();
        this.pointsEarned = answer.getPointsEarned();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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