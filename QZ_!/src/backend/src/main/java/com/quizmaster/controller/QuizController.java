package com.quizmaster.controller;

import com.quizmaster.dto.QuizDto;
import com.quizmaster.security.UserPrincipal;
import com.quizmaster.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quizzes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class QuizController {
    
    @Autowired
    private QuizService quizService;
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<QuizDto> createQuiz(@Valid @RequestBody QuizDto quizDto, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        QuizDto createdQuiz = quizService.createQuiz(quizDto, userPrincipal.getId());
        return ResponseEntity.ok(createdQuiz);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<QuizDto> updateQuiz(@PathVariable Long id, @Valid @RequestBody QuizDto quizDto, 
                                            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        QuizDto updatedQuiz = quizService.updateQuiz(id, quizDto, userPrincipal.getId());
        return ResponseEntity.ok(updatedQuiz);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<QuizDto> getQuizById(@PathVariable Long id) {
        QuizDto quiz = quizService.getQuizById(id);
        return ResponseEntity.ok(quiz);
    }
    
    @GetMapping
    public ResponseEntity<List<QuizDto>> getAllQuizzes() {
        List<QuizDto> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<Page<QuizDto>> getAllQuizzesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<QuizDto> quizzes = quizService.getAllQuizzesPaginated(page, size);
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/my-quizzes")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<QuizDto>> getMyQuizzes(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<QuizDto> quizzes = quizService.getQuizzesByCreator(userPrincipal.getId());
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<QuizDto>> getQuizzesByCreator(@PathVariable Long creatorId) {
        List<QuizDto> quizzes = quizService.getQuizzesByCreator(creatorId);
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<QuizDto>> searchQuizzes(@RequestParam String q) {
        List<QuizDto> quizzes = quizService.searchQuizzes(q);
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/by-tags")
    public ResponseEntity<List<QuizDto>> getQuizzesByTags(@RequestParam List<String> tags) {
        List<QuizDto> quizzes = quizService.getQuizzesByTags(tags);
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/tags")
    public ResponseEntity<List<String>> getAllTags() {
        List<String> tags = quizService.getAllTags();
        return ResponseEntity.ok(tags);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long id, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        quizService.deleteQuiz(id, userPrincipal.getId());
        return ResponseEntity.ok().body(new MessageResponse("Quiz deleted successfully"));
    }
    
    @GetMapping("/stats/count")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Long> getMyQuizCount(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        long count = quizService.getQuizCountByCreator(userPrincipal.getId());
        return ResponseEntity.ok(count);
    }
    
    // Public endpoints that don't require authentication
    @GetMapping("/public/{id}")
    public ResponseEntity<QuizDto> getPublicQuizById(@PathVariable Long id) {
        QuizDto quiz = quizService.getQuizById(id);
        return ResponseEntity.ok(quiz);
    }
    
    @GetMapping("/public")
    public ResponseEntity<List<QuizDto>> getPublicQuizzes() {
        List<QuizDto> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }
    
    // Helper class for simple messages
    public static class MessageResponse {
        private String message;
        
        public MessageResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}