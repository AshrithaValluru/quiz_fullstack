package com.example.quiz.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

@Entity
@Table(name = "options")
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id"
)
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private boolean correct;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public boolean isCorrect() { return correct; }
    public void setCorrect(boolean correct) { this.correct = correct; }

    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }
}
