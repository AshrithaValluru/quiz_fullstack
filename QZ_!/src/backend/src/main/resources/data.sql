-- Sample data for QuizMaster Pro (Optional - for development/testing)
-- This file will be executed on application startup if spring.sql.init.mode is set to 'always'

-- Note: The application will auto-create tables via Hibernate DDL
-- This file contains sample data for testing purposes

-- Sample users will be created via the API
-- Sample quizzes will be created via the API

-- You can uncomment and modify the following INSERT statements for testing:

/*
-- Insert sample user (password is BCrypt encoded "password123")
INSERT INTO users (email, username, first_name, last_name, password, created_at) VALUES
('john.doe@example.com', 'johndoe', 'John', 'Doe', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8wKcgj8VLpYUgEn.s6.7.7.yXcNlwm', NOW()),
('jane.smith@example.com', 'janesmith', 'Jane', 'Smith', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8wKcgj8VLpYUgEn.s6.7.7.yXcNlwm', NOW());

-- Insert sample quiz
INSERT INTO quizzes (title, description, randomize_questions, created_at, creator_id, primary_color, background_color, font_style) VALUES
('Sample JavaScript Quiz', 'Test your JavaScript knowledge', false, NOW(), 1, '#007bff', '#ffffff', 'Arial, sans-serif');

-- Insert sample questions
INSERT INTO questions (type, question, correct_answer, hint, difficulty, time_limit, quiz_id, question_order) VALUES
('MULTIPLE_CHOICE', 'What is the correct way to declare a variable in JavaScript?', 'let variableName;', 'Think about ES6 syntax', 'EASY', 30, 1, 0),
('TRUE_FALSE', 'JavaScript is a statically typed language.', 'false', 'Consider how variables are handled in JavaScript', 'MEDIUM', 20, 1, 1);

-- Insert sample question options
INSERT INTO question_options (question_id, option_text) VALUES
(1, 'var variableName;'),
(1, 'let variableName;'),
(1, 'const variableName;'),
(1, 'variable variableName;');

-- Insert sample quiz tags
INSERT INTO quiz_tags (quiz_id, tag) VALUES
(1, 'JavaScript'),
(1, 'Programming'),
(1, 'Web Development');
*/