package com.quizmaster.controller;

import com.quizmaster.dto.AnswerDto;
import com.quizmaster.dto.QuizAttemptDto;
import com.quizmaster.security.UserPrincipal;
import com.quizmaster.service.QuizAttemptService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/attempts")
@CrossOrigin(origins = "*", maxAge = 3600)
public class QuizAttemptController {
    
    @Autowired
    private QuizAttemptService attemptService;
    
    @PostMapping("/submit")
    public ResponseEntity<QuizAttemptDto> submitQuizAttempt(@Valid @RequestBody QuizAttemptSubmission submission) {
        QuizAttemptDto attempt = attemptService.submitQuizAttempt(
                submission.getQuizId(),
                submission.getParticipantName(),
                submission.getAnswers()
        );
        return ResponseEntity.ok(attempt);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<QuizAttemptDto> getAttemptById(@PathVariable Long id) {
        QuizAttemptDto attempt = attemptService.getAttemptById(id);
        return ResponseEntity.ok(attempt);
    }
    
    @GetMapping("/quiz/{quizId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<QuizAttemptDto>> getAttemptsByQuiz(@PathVariable Long quizId) {
        List<QuizAttemptDto> attempts = attemptService.getAttemptsByQuiz(quizId);
        return ResponseEntity.ok(attempts);
    }
    
    @GetMapping("/quiz/{quizId}/paginated")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<QuizAttemptDto>> getAttemptsByQuizPaginated(
            @PathVariable Long quizId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<QuizAttemptDto> attempts = attemptService.getAttemptsByQuizPaginated(quizId, page, size);
        return ResponseEntity.ok(attempts);
    }
    
    @GetMapping("/my-attempts")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<QuizAttemptDto>> getMyQuizAttempts(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<QuizAttemptDto> attempts = attemptService.getAttemptsByCreator(userPrincipal.getId());
        return ResponseEntity.ok(attempts);
    }
    
    @GetMapping("/quiz/{quizId}/participant/{participantName}")
    public ResponseEntity<List<QuizAttemptDto>> getAttemptsByParticipant(
            @PathVariable Long quizId,
            @PathVariable String participantName) {
        List<QuizAttemptDto> attempts = attemptService.getAttemptsByParticipant(quizId, participantName);
        return ResponseEntity.ok(attempts);
    }
    
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<QuizAttemptDto>> getAttemptsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<QuizAttemptDto> attempts = attemptService.getAttemptsByDateRange(startDate, endDate);
        return ResponseEntity.ok(attempts);
    }
    
    @GetMapping("/quiz/{quizId}/statistics")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<QuizAttemptService.QuizStatistics> getQuizStatistics(@PathVariable Long quizId) {
        QuizAttemptService.QuizStatistics stats = attemptService.getQuizStatistics(quizId);
        return ResponseEntity.ok(stats);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteAttempt(@PathVariable Long id) {
        attemptService.deleteAttempt(id);
        return ResponseEntity.ok().body(new MessageResponse("Quiz attempt deleted successfully"));
    }
    
    // Public endpoints for quiz participation
    @PostMapping("/public/submit")
    public ResponseEntity<QuizAttemptDto> submitPublicQuizAttempt(@Valid @RequestBody QuizAttemptSubmission submission) {
        QuizAttemptDto attempt = attemptService.submitQuizAttempt(
                submission.getQuizId(),
                submission.getParticipantName(),
                submission.getAnswers()
        );
        return ResponseEntity.ok(attempt);
    }
    
    @GetMapping("/public/quiz/{quizId}/statistics")
    public ResponseEntity<PublicQuizStatistics> getPublicQuizStatistics(@PathVariable Long quizId) {
        QuizAttemptService.QuizStatistics stats = attemptService.getQuizStatistics(quizId);
        // Return limited statistics for public access
        PublicQuizStatistics publicStats = new PublicQuizStatistics(
                stats.getTotalAttempts(),
                stats.getAverageScore()
        );
        return ResponseEntity.ok(publicStats);
    }
    
    // DTOs for request/response
    public static class QuizAttemptSubmission {
        private Long quizId;
        private String participantName;
        private List<AnswerDto> answers;
        
        // Constructors, getters, and setters
        public QuizAttemptSubmission() {}
        
        public Long getQuizId() { return quizId; }
        public void setQuizId(Long quizId) { this.quizId = quizId; }
        
        public String getParticipantName() { return participantName; }
        public void setParticipantName(String participantName) { this.participantName = participantName; }
        
        public List<AnswerDto> getAnswers() { return answers; }
        public void setAnswers(List<AnswerDto> answers) { this.answers = answers; }
    }
    
    public static class PublicQuizStatistics {
        private long totalAttempts;
        private Double averageScore;
        
        public PublicQuizStatistics(long totalAttempts, Double averageScore) {
            this.totalAttempts = totalAttempts;
            this.averageScore = averageScore;
        }
        
        public long getTotalAttempts() { return totalAttempts; }
        public Double getAverageScore() { return averageScore; }
    }
    
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