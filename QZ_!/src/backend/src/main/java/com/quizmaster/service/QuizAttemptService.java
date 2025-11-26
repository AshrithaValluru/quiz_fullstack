package com.quizmaster.service;

import com.quizmaster.dto.AnswerDto;
import com.quizmaster.dto.QuizAttemptDto;
import com.quizmaster.entity.*;
import com.quizmaster.exception.ResourceNotFoundException;
import com.quizmaster.repository.QuizAttemptRepository;
import com.quizmaster.repository.QuizRepository;
import com.quizmaster.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizAttemptService {
    
    @Autowired
    private QuizAttemptRepository attemptRepository;
    
    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    public QuizAttemptDto submitQuizAttempt(Long quizId, String participantName, List<AnswerDto> answers) {
        Quiz quiz = quizRepository.findByIdWithQuestions(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        
        QuizAttempt attempt = new QuizAttempt(quiz, participantName);
        
        // Create a map of questions for easy lookup
        Map<Long, Question> questionMap = quiz.getQuestions().stream()
                .collect(Collectors.toMap(Question::getId, q -> q));
        
        double totalScore = 0.0;
        
        // Process each answer
        for (AnswerDto answerDto : answers) {
            Answer answer = new Answer();
            answer.setQuestionId(answerDto.getQuestionId());
            answer.setAnswer(answerDto.getAnswer());
            answer.setConfidenceLevel(answerDto.getConfidenceLevel());
            answer.setUsedHint(answerDto.isUsedHint());
            answer.setTimeSpent(answerDto.getTimeSpent());
            
            // Calculate score for this answer
            Question question = questionMap.get(answerDto.getQuestionId());
            if (question != null) {
                boolean isCorrect = isAnswerCorrect(question, answerDto.getAnswer());
                answer.setIsCorrect(isCorrect);
                
                double points = calculatePoints(question, isCorrect, answerDto.getConfidenceLevel(), answerDto.isUsedHint());
                answer.setPointsEarned(points);
                totalScore += points;
            }
            
            attempt.addAnswer(answer);
        }
        
        attempt.setTotalScore(totalScore);
        attempt.calculateStatistics();
        
        QuizAttempt savedAttempt = attemptRepository.save(attempt);
        return new QuizAttemptDto(savedAttempt);
    }
    
    @Transactional(readOnly = true)
    public QuizAttemptDto getAttemptById(Long id) {
        QuizAttempt attempt = attemptRepository.findByIdWithAnswers(id);
        if (attempt == null) {
            throw new ResourceNotFoundException("QuizAttempt", "id", id);
        }
        return new QuizAttemptDto(attempt);
    }
    
    @Transactional(readOnly = true)
    public List<QuizAttemptDto> getAttemptsByQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        
        return attemptRepository.findByQuizOrderByCompletedAtDesc(quiz)
                .stream()
                .map(QuizAttemptDto::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<QuizAttemptDto> getAttemptsByQuizPaginated(Long quizId, int page, int size) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        
        Pageable pageable = PageRequest.of(page, size);
        return attemptRepository.findByQuizOrderByCompletedAtDesc(quiz, pageable)
                .map(QuizAttemptDto::new);
    }
    
    @Transactional(readOnly = true)
    public List<QuizAttemptDto> getAttemptsByCreator(Long creatorId) {
        return attemptRepository.findByQuizCreatorIdOrderByCompletedAtDesc(creatorId)
                .stream()
                .map(QuizAttemptDto::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<QuizAttemptDto> getAttemptsByParticipant(Long quizId, String participantName) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        
        return attemptRepository.findByQuizAndParticipantName(quiz, participantName)
                .stream()
                .map(QuizAttemptDto::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<QuizAttemptDto> getAttemptsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return attemptRepository.findByCompletedAtBetween(startDate, endDate)
                .stream()
                .map(QuizAttemptDto::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public QuizStatistics getQuizStatistics(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        
        long totalAttempts = attemptRepository.countByQuiz(quiz);
        Double averageScore = attemptRepository.findAverageScoreByQuiz(quiz);
        Double maxScore = attemptRepository.findMaxScoreByQuiz(quiz);
        Double minScore = attemptRepository.findMinScoreByQuiz(quiz);
        
        return new QuizStatistics(totalAttempts, averageScore, maxScore, minScore);
    }
    
    public void deleteAttempt(Long id) {
        QuizAttempt attempt = attemptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("QuizAttempt", "id", id));
        
        attemptRepository.delete(attempt);
    }
    
    private boolean isAnswerCorrect(Question question, String userAnswer) {
        if (userAnswer == null || question.getCorrectAnswer() == null) {
            return false;
        }
        
        String correctAnswer = question.getCorrectAnswer().trim().toLowerCase();
        String answer = userAnswer.trim().toLowerCase();
        
        switch (question.getType()) {
            case MULTIPLE_CHOICE:
            case TRUE_FALSE:
                return correctAnswer.equals(answer);
            case OPEN_ENDED:
                // For open-ended questions, you might want to implement more sophisticated matching
                // For now, we'll do simple string matching
                return correctAnswer.equals(answer);
            default:
                return false;
        }
    }
    
    private double calculatePoints(Question question, boolean isCorrect, int confidenceLevel, boolean usedHint) {
        if (!isCorrect) {
            return 0.0;
        }
        
        // Base points based on difficulty
        double basePoints;
        switch (question.getDifficulty()) {
            case EASY:
                basePoints = 10.0;
                break;
            case MEDIUM:
                basePoints = 15.0;
                break;
            case HARD:
                basePoints = 20.0;
                break;
            default:
                basePoints = 10.0;
        }
        
        // Confidence multiplier (1-5 scale becomes 0.8-1.2 multiplier)
        double confidenceMultiplier = 0.8 + (confidenceLevel - 1) * 0.1;
        
        // Hint penalty
        double hintMultiplier = usedHint ? 0.8 : 1.0;
        
        return basePoints * confidenceMultiplier * hintMultiplier;
    }
    
    // Statistics DTO
    public static class QuizStatistics {
        private long totalAttempts;
        private Double averageScore;
        private Double maxScore;
        private Double minScore;
        
        public QuizStatistics(long totalAttempts, Double averageScore, Double maxScore, Double minScore) {
            this.totalAttempts = totalAttempts;
            this.averageScore = averageScore != null ? averageScore : 0.0;
            this.maxScore = maxScore != null ? maxScore : 0.0;
            this.minScore = minScore != null ? minScore : 0.0;
        }
        
        // Getters
        public long getTotalAttempts() { return totalAttempts; }
        public Double getAverageScore() { return averageScore; }
        public Double getMaxScore() { return maxScore; }
        public Double getMinScore() { return minScore; }
    }
}