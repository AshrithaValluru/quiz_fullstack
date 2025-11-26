package com.example.quiz.controller;

import com.example.quiz.model.Quiz;
import com.example.quiz.repository.QuizRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*")
public class QuizController {

    private final QuizRepository quizRepo;

    public QuizController(QuizRepository quizRepo) {
        this.quizRepo = quizRepo;
    }

    @GetMapping
    public List<Quiz> all() {
        return quizRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getById(@PathVariable Long id) {
        return quizRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Quiz> create(@RequestBody Quiz quiz) {
        Quiz saved = quizRepo.save(quiz);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quiz> update(@PathVariable Long id, @RequestBody Quiz updated) {
        return quizRepo.findById(id).map(q -> {
            q.setTitle(updated.getTitle());
            q.setDescription(updated.getDescription());
            q.setQuestions(updated.getQuestions());
            quizRepo.save(q);
            return ResponseEntity.ok(q);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (quizRepo.existsById(id)) {
            quizRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
