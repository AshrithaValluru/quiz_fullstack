package com.example.quiz.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String quizId;
    private String participantName;
    private int totalScore;
    private LocalDateTime completedAt;

    @Lob
    private String answersJson; // store answers as JSON

	public void setCompletedAt(LocalDateTime now) {
		// TODO Auto-generated method stub
		
	}

    // getters and setters
}
