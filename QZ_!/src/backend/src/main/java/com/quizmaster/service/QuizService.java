package com.quizmaster.service;

import com.quizmaster.dto.QuizDto;
import com.quizmaster.entity.Question;
import com.quizmaster.entity.Quiz;
import com.quizmaster.entity.User;
import com.quizmaster.exception.ResourceNotFoundException;
import com.quizmaster.repository.QuizRepository;
import com.quizmaster.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizService {
    
    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public QuizDto createQuiz(QuizDto quizDto, Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", creatorId));
        
        Quiz quiz = new Quiz(quizDto.getTitle(), quizDto.getDescription(), creator);
        quiz.setTags(quizDto.getTags());
        quiz.setRandomizeQuestions(quizDto.isRandomizeQuestions());
        quiz.setTheme(quizDto.getTheme());
        
        // Convert and add questions
        if (quizDto.getQuestions() != null) {
            for (int i = 0; i < quizDto.getQuestions().size(); i++) {
                var questionDto = quizDto.getQuestions().get(i);
                Question question = convertToQuestion(questionDto);
                question.setQuestionOrder(i);
                quiz.addQuestion(question);
            }
        }
        
        Quiz savedQuiz = quizRepository.save(quiz);
        return new QuizDto(savedQuiz);
    }
    
    public QuizDto updateQuiz(Long quizId, QuizDto quizDto, Long userId) {
        Quiz quiz = quizRepository.findByIdWithQuestions(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        
        // Check if user is the creator
        if (!quiz.getCreator().getId().equals(userId)) {
            throw new SecurityException("You can only update your own quizzes");
        }
        
        quiz.setTitle(quizDto.getTitle());
        quiz.setDescription(quizDto.getDescription());
        quiz.setTags(quizDto.getTags());
        quiz.setRandomizeQuestions(quizDto.isRandomizeQuestions());
        quiz.setTheme(quizDto.getTheme());
        
        // Update questions
        quiz.getQuestions().clear();
        if (quizDto.getQuestions() != null) {
            for (int i = 0; i < quizDto.getQuestions().size(); i++) {
                var questionDto = quizDto.getQuestions().get(i);
                Question question = convertToQuestion(questionDto);
                question.setQuestionOrder(i);
                quiz.addQuestion(question);
            }
        }
        
        Quiz savedQuiz = quizRepository.save(quiz);
        return new QuizDto(savedQuiz);
    }
    
    @Transactional(readOnly = true)
    public QuizDto getQuizById(Long id) {
        Quiz quiz = quizRepository.findByIdWithQuestions(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", id));
        return new QuizDto(quiz);
    }
    
    @Transactional(readOnly = true)
    public List<QuizDto> getAllQuizzes() {
        return quizRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 100))
                .stream()
                .map(QuizDto::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<QuizDto> getAllQuizzesPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return quizRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(QuizDto::new);
    }
    
    @Transactional(readOnly = true)
    public List<QuizDto> getQuizzesByCreator(Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", creatorId));
        
        return quizRepository.findByCreatorOrderByCreatedAtDesc(creator)
                .stream()
                .map(QuizDto::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<QuizDto> searchQuizzes(String searchTerm) {
        return quizRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(searchTerm)
                .stream()
                .map(QuizDto::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<QuizDto> getQuizzesByTags(List<String> tags) {
        return quizRepository.findByTagsIn(tags)
                .stream()
                .map(QuizDto::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<String> getAllTags() {
        return quizRepository.findAllUniqueTags();
    }
    
    public void deleteQuiz(Long quizId, Long userId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        
        // Check if user is the creator
        if (!quiz.getCreator().getId().equals(userId)) {
            throw new SecurityException("You can only delete your own quizzes");
        }
        
        quizRepository.delete(quiz);
    }
    
    @Transactional(readOnly = true)
    public long getQuizCountByCreator(Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", creatorId));
        
        return quizRepository.countByCreator(creator);
    }
    
    private Question convertToQuestion(com.quizmaster.dto.QuestionDto questionDto) {
        Question question = new Question();
        question.setType(Question.QuestionType.valueOf(questionDto.getType().toUpperCase().replace("-", "_")));
        question.setQuestion(questionDto.getQuestion());
        question.setOptions(questionDto.getOptions());
        question.setCorrectAnswer(questionDto.getCorrectAnswer());
        question.setHint(questionDto.getHint());
        question.setDifficulty(Question.Difficulty.valueOf(questionDto.getDifficulty().toUpperCase()));
        question.setTimeLimit(questionDto.getTimeLimit());
        return question;
    }
}