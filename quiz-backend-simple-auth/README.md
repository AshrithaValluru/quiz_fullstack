# Quiz Backend (Spring Boot + MySQL)

This is a ready-to-import Spring Boot backend for a Quiz Builder application.

## What is included
- Entities: Quiz, Question, Option
- Repositories: CRUD via Spring Data JPA
- Controllers: REST endpoints for quizzes and questions
- MySQL configuration (application.properties)

## Import & Run (step-by-step)

1. Make sure you have:
   - Java 17+ installed
   - Maven installed (or use IDE's built-in)
   - MySQL running (MySQL Workbench can be used for DB management)

2. Create the database:
   - Start MySQL and run:
     ```
     CREATE DATABASE quizdb;
     ```
   - Update `src/main/resources/application.properties` with your MySQL username and password.

3. Import into IDE:
   - In IntelliJ: File -> Open... -> choose this folder
   - IntelliJ will detect it as a Maven project. Let it download dependencies.

4. Run the app:
   - Run `com.example.quiz.QuizBackendApplication` or `mvn spring-boot:run`.
   - Server runs on port 8080 (configurable).

5. Test with Postman (examples):
   - Create a quiz:
     POST http://localhost:8080/api/quizzes
     Body (JSON):
     {
       "title": "Java Basics",
       "description": "Intro quiz",
       "questions": [
         {
           "text": "What is JVM?",
           "options": [
             { "text": "Java Virtual Machine", "correct": true },
             { "text": "Java Very Much", "correct": false }
           ]
         }
       ]
     }

   - Get quizzes:
     GET http://localhost:8080/api/quizzes

   - Add a question to an existing quiz:
     POST http://localhost:8080/api/questions/quiz/{quizId}
     Body:
     {
       "text": "New Q?",
       "options": [
         { "text": "A", "correct": false },
         { "text": "B", "correct": true }
       ]
     }

6. Connect to your frontend:
   - Ensure frontend is calling the same base URL (http://localhost:8080).
   - Enable CORS if your frontend runs on a different port (the controllers already include @CrossOrigin(origins = "*") for convenience).

## Notes
- `spring.jpa.hibernate.ddl-auto=update` will create/update tables automatically in dev. For production use migrations (Flyway/DDL scripts).
- No authentication included - add Spring Security if you need user accounts.

