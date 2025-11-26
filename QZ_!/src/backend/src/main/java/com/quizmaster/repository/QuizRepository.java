package com.quizmaster.repository;

import com.quizmaster.entity.Quiz;
import com.quizmaster.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    
    List<Quiz> findByCreatorOrderByCreatedAtDesc(User creator);
    
    Page<Quiz> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT q FROM Quiz q WHERE q.title LIKE %:searchTerm% OR q.description LIKE %:searchTerm%")
    List<Quiz> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT q FROM Quiz q JOIN q.tags t WHERE t IN :tags")
    List<Quiz> findByTagsIn(@Param("tags") List<String> tags);
    
    @Query("SELECT DISTINCT t FROM Quiz q JOIN q.tags t ORDER BY t")
    List<String> findAllUniqueTags();
    
    @Query("SELECT q FROM Quiz q LEFT JOIN FETCH q.questions WHERE q.id = :id")
    Optional<Quiz> findByIdWithQuestions(@Param("id") Long id);
    
    @Query("SELECT COUNT(q) FROM Quiz q WHERE q.creator = :creator")
    long countByCreator(@Param("creator") User creator);
}