package com.quizmaster.dto;

import com.quizmaster.entity.Question;

import java.util.List;

public class QuestionDto {
    
    private Long id;
    private String type;
    private String question;
    private List<String> options;
    private String correctAnswer;
    private String hint;
    private String difficulty;
    private int timeLimit;
    private int questionOrder;
    
    // Constructors
    public QuestionDto() {}
    
    public QuestionDto(Question question) {
        this.id = question.getId();
        this.type = question.getType().getValue();
        this.question = question.getQuestion();
        this.options = question.getOptions();
        this.correctAnswer = question.getCorrectAnswer();
        this.hint = question.getHint();
        this.difficulty = question.getDifficulty().getValue();
        this.timeLimit = question.getTimeLimit();
        this.questionOrder = question.getQuestionOrder();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
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
    
    public String getDifficulty() {
        return difficulty;
    }
    
    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
    
    public int getTimeLimit() {
        return timeLimit;
    }
    
    public void setTimeLimit(int timeLimit) {
        this.timeLimit = timeLimit;
    }
    
    public int getQuestionOrder() {
        return questionOrder;
    }
    
    public void setQuestionOrder(int questionOrder) {
        this.questionOrder = questionOrder;
    }
}