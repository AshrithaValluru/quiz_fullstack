package com.example.quiz.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.quiz.model.QuizAttempt;
import com.example.quiz.repository.QuizAttemptRepository;

@RestController
@RequestMapping("/api/attempts")
@CrossOrigin(origins = "http://localhost:3000") // frontend origin
public class QuizAttemptController {

    private final QuizAttemptRepository repo;

    public QuizAttemptController(QuizAttemptRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<QuizAttempt> getAllAttempts() {
        return repo.findAll();
    }

    @PostMapping
    public QuizAttempt saveAttempt(@RequestBody QuizAttempt attempt) {
        attempt.setCompletedAt(LocalDateTime.now());
        return repo.save(attempt);
    }
}
