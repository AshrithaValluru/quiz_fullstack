package com.quizmaster.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
@EntityListeners(AuditingEntityListener.class)
public class QuizAttempt {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    @JsonIgnore
    private Quiz quiz;
    
    @NotBlank
    @Column(name = "participant_name", nullable = false)
    private String participantName;
    
    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>();
    
    @NotNull
    @Column(name = "total_score", nullable = false)
    private Double totalScore = 0.0;
    
    @CreatedDate
    @Column(name = "completed_at", nullable = false, updatable = false)
    private LocalDateTime completedAt;
    
    @Column(name = "time_taken") // Total time taken in seconds
    private Integer timeTaken;
    
    @Column(name = "confidence_average")
    private Double confidenceAverage;
    
    @Column(name = "hints_used")
    private Integer hintsUsed = 0;
    
    // Constructors
    public QuizAttempt() {}
    
    public QuizAttempt(Quiz quiz, String participantName) {
        this.quiz = quiz;
        this.participantName = participantName;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Quiz getQuiz() {
        return quiz;
    }
    
    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }
    
    public String getParticipantName() {
        return participantName;
    }
    
    public void setParticipantName(String participantName) {
        this.participantName = participantName;
    }
    
    public List<Answer> getAnswers() {
        return answers;
    }
    
    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
        // Set the attempt reference for each answer
        if (answers != null) {
            answers.forEach(answer -> answer.setAttempt(this));
        }
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
    
    // Helper method to add an answer
    public void addAnswer(Answer answer) {
        answers.add(answer);
        answer.setAttempt(this);
    }
    
    // Helper method to calculate and update statistics
    public void calculateStatistics() {
        if (answers.isEmpty()) return;
        
        // Calculate average confidence
        double totalConfidence = answers.stream()
            .mapToDouble(Answer::getConfidenceLevel)
            .sum();
        this.confidenceAverage = totalConfidence / answers.size();
        
        // Count hints used
        this.hintsUsed = (int) answers.stream()
            .mapToLong(answer -> answer.isUsedHint() ? 1 : 0)
            .sum();
        
        // Calculate total time taken
        this.timeTaken = answers.stream()
            .mapToInt(Answer::getTimeSpent)
            .sum();
    }
}