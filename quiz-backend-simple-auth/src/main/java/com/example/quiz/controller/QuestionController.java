package com.example.quiz.controller;

import com.example.quiz.model.Question;
import com.example.quiz.model.Quiz;
import com.example.quiz.repository.QuestionRepository;
import com.example.quiz.repository.QuizRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionRepository questionRepo;
    private final QuizRepository quizRepo;

    public QuestionController(QuestionRepository questionRepo, QuizRepository quizRepo) {
        this.questionRepo = questionRepo;
        this.quizRepo = quizRepo;
    }

    @GetMapping
    public List<Question> all() {
        return questionRepo.findAll();
    }

    @PostMapping("/quiz/{quizId}")
    public ResponseEntity<Question> createForQuiz(@PathVariable Long quizId, @RequestBody Question question) {
        return quizRepo.findById(quizId).map(quiz -> {
            question.setQuiz(quiz);
            Question saved = questionRepo.save(question);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getById(@PathVariable Long id) {
        return questionRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (questionRepo.existsById(id)) {
            questionRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
