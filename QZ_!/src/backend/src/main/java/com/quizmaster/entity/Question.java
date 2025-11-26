package com.quizmaster.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;
    
    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;
    
    @ElementCollection
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text")
    private List<String> options = new ArrayList<>();
    
    @NotBlank
    @Column(name = "correct_answer", nullable = false)
    private String correctAnswer;
    
    @Column(columnDefinition = "TEXT")
    private String hint;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty = Difficulty.MEDIUM;
    
    @Column(name = "time_limit")
    private int timeLimit = 30; // seconds
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    @JsonIgnore
    private Quiz quiz;
    
    @Column(name = "question_order")
    private int questionOrder = 0;
    
    // Constructors
    public Question() {}
    
    public Question(QuestionType type, String question, String correctAnswer, Difficulty difficulty) {
        this.type = type;
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.difficulty = difficulty;
    }
    
    // Enums
    public enum QuestionType {
        MULTIPLE_CHOICE("multiple-choice"),
        TRUE_FALSE("true-false"),
        OPEN_ENDED("open-ended");
        
        private final String value;
        
        QuestionType(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
    
    public enum Difficulty {
        EASY("easy"),
        MEDIUM("medium"),
        HARD("hard");
        
        private final String value;
        
        Difficulty(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public QuestionType getType() {
        return type;
    }
    
    public void setType(QuestionType type) {
        this.type = type;
    }
    
    public String getQuestion() {
        return question;
    }
    
    public void setQuestion(String question) {
        this.question = question;
    }
    
    public List<String> getOptions() {
        return options;
    }
    
    public void setOptions(List<String> options) {
        this.options = options;
    }
    
    public String getCorrectAnswer() {
        return correctAnswer;
    }
    
    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
    
    public String getHint() {
        return hint;
    }
    
    public void setHint(String hint) {
        this.hint = hint;
    }
    
    public Difficulty getDifficulty() {
        return difficulty;
    }
    
    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }
    
    public int getTimeLimit() {
        return timeLimit;
    }
    
    public void setTimeLimit(int timeLimit) {
        this.timeLimit = timeLimit;
    }
    
    public Quiz getQuiz() {
        return quiz;
    }
    
    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }
    
    public int getQuestionOrder() {
        return questionOrder;
    }
    
    public void setQuestionOrder(int questionOrder) {
        this.questionOrder = questionOrder;
    }
}