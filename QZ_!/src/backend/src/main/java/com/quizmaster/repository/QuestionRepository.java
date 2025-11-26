package com.quizmaster.repository;

import com.quizmaster.entity.Question;
import com.quizmaster.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    List<Question> findByQuizOrderByQuestionOrder(Quiz quiz);
    
    @Query("SELECT COUNT(q) FROM Question q WHERE q.quiz = :quiz")
    long countByQuiz(@Param("quiz") Quiz quiz);
    
    @Query("SELECT q FROM Question q WHERE q.quiz = :quiz AND q.difficulty = :difficulty")
    List<Question> findByQuizAndDifficulty(@Param("quiz") Quiz quiz, @Param("difficulty") Question.Difficulty difficulty);
    
    @Query("SELECT q FROM Question q WHERE q.quiz = :quiz AND q.type = :type")
    List<Question> findByQuizAndType(@Param("quiz") Quiz quiz, @Param("type") Question.QuestionType type);
}