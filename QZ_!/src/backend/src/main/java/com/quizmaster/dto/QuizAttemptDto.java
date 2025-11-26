package com.quizmaster.dto;

import com.quizmaster.entity.QuizAttempt;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class QuizAttemptDto {
    
    private Long id;
    private Long quizId;
    private String quizTitle;
    private String participantName;
    private List<AnswerDto> answers;
    private Double totalScore;
    private LocalDateTime completedAt;
    private Integer timeTaken;
    private Double confidenceAverage;
    private Integer hintsUsed;
    
    // Constructors
    public QuizAttemptDto() {}
    
    public QuizAttemptDto(QuizAttempt attempt) {
        this.id = attempt.getId();
        this.quizId = attempt.getQuiz().getId();
        this.quizTitle = attempt.getQuiz().getTitle();
        this.participantName = attempt.getParticipantName();
        this.answers = attempt.getAnswers().stream()
            .map(AnswerDto::new)
            .collect(Collectors.toList());
        this.totalScore = attempt.getTotalScore();
        this.completedAt = attempt.getCompletedAt();
        this.timeTaken = attempt.getTimeTaken();
        this.confidenceAverage = attempt.getConfidenceAverage();
        this.hintsUsed = attempt.getHintsUsed();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getQuizId() {
        return quizId;
    }
    
    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }
    
    public String getQuizTitle() {
        return quizTitle;
    }
    
    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
    }
    
    public String getParticipantName() {
        return participantName;
    }
    
    public void setParticipantName(String participantName) {
        this.participantName = participantName;
    }
    
    public List<AnswerDto> getAnswers() {
        return answers;
    }
    
    public void setAnswers(List<AnswerDto> answers) {
        this.answers = answers;
    }
    
    public Double getTotalScore() {
        return totalScore;
    }
    
    public void setTotalScore(Double totalScore) {
        this.totalScore = totalScore;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
    
    public Integer getTimeTaken() {
        return timeTaken;
    }
    
    public void setTimeTaken(Integer timeTaken) {
        this.timeTaken = timeTaken;
    }
    
    public Double getConfidenceAverage() {
        return confidenceAverage;
    }
    
    public void setConfidenceAverage(Double confidenceAverage) {
        this.confidenceAverage = confidenceAverage;
    }
    
    public Integer getHintsUsed() {
        return hintsUsed;
    }
    
    public void setHintsUsed(Integer hintsUsed) {
        this.hintsUsed = hintsUsed;
    }
}