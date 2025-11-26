package com.quizmaster.repository;

import com.quizmaster.entity.Quiz;
import com.quizmaster.entity.QuizAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    
    List<QuizAttempt> findByQuizOrderByCompletedAtDesc(Quiz quiz);
    
    Page<QuizAttempt> findByQuizOrderByCompletedAtDesc(Quiz quiz, Pageable pageable);
    
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.quiz = :quiz AND qa.participantName = :participantName ORDER BY qa.completedAt DESC")
    List<QuizAttempt> findByQuizAndParticipantName(@Param("quiz") Quiz quiz, @Param("participantName") String participantName);
    
    @Query("SELECT COUNT(qa) FROM QuizAttempt qa WHERE qa.quiz = :quiz")
    long countByQuiz(@Param("quiz") Quiz quiz);
    
    @Query("SELECT AVG(qa.totalScore) FROM QuizAttempt qa WHERE qa.quiz = :quiz")
    Double findAverageScoreByQuiz(@Param("quiz") Quiz quiz);
    
    @Query("SELECT MAX(qa.totalScore) FROM QuizAttempt qa WHERE qa.quiz = :quiz")
    Double findMaxScoreByQuiz(@Param("quiz") Quiz quiz);
    
    @Query("SELECT MIN(qa.totalScore) FROM QuizAttempt qa WHERE qa.quiz = :quiz")
    Double findMinScoreByQuiz(@Param("quiz") Quiz quiz);
    
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.quiz.creator.id = :creatorId ORDER BY qa.completedAt DESC")
    List<QuizAttempt> findByQuizCreatorIdOrderByCompletedAtDesc(@Param("creatorId") Long creatorId);
    
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.completedAt BETWEEN :startDate AND :endDate ORDER BY qa.completedAt DESC")
    List<QuizAttempt> findByCompletedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT qa FROM QuizAttempt qa LEFT JOIN FETCH qa.answers WHERE qa.id = :id")
    QuizAttempt findByIdWithAnswers(@Param("id") Long id);
}