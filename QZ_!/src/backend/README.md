# QuizMaster Pro Backend

A comprehensive Spring Boot REST API for the QuizMaster Pro quiz management system, featuring user authentication, quiz creation, participation tracking, and analytics.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- User registration and login
- Auto-generated usernames from email addresses
- Secure password encryption with BCrypt
- Role-based access control

### 📝 Quiz Management
- Create, read, update, delete quizzes
- Multiple question types (multiple-choice, true/false, open-ended)
- Difficulty levels and time limits
- Custom themes and randomization options
- Tag-based categorization
- Search functionality

### 🎯 Quiz Participation
- Anonymous quiz participation
- Confidence-based scoring system
- Hint system with point penalties
- Time tracking per question
- Detailed attempt analytics

### 📊 Analytics & Reporting
- Comprehensive quiz statistics
- Participant performance tracking
- Score analytics (average, min, max)
- Date-range filtering
- Leaderboard data

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security with JWT
- **Database**: MySQL 8.0
- **ORM**: JPA/Hibernate
- **API Documentation**: OpenAPI 3 (Swagger)
- **Build Tool**: Maven
- **Java Version**: 17

## Quick Start

### Prerequisites
- Java 17 or higher
- MySQL 8.0
- Maven 3.6+

### Database Setup
1. Create a MySQL database:
```sql
CREATE DATABASE quizmaster_db;
```

2. Update database credentials in `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/quizmaster_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
    username: your_mysql_username
    password: your_mysql_password
```

### Installation & Running

1. Clone the repository and navigate to the backend directory
2. Install dependencies:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`

### API Documentation
Once the application is running, access the Swagger UI at:
- **Swagger UI**: http://localhost:8080/api/swagger-ui/index.html
- **OpenAPI JSON**: http://localhost:8080/api/v3/api-docs

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/validate` - Validate JWT token

### Quiz Management
- `GET /api/quizzes` - Get all quizzes
- `POST /api/quizzes` - Create new quiz (authenticated)
- `GET /api/quizzes/{id}` - Get quiz by ID
- `PUT /api/quizzes/{id}` - Update quiz (authenticated)
- `DELETE /api/quizzes/{id}` - Delete quiz (authenticated)
- `GET /api/quizzes/my-quizzes` - Get current user's quizzes
- `GET /api/quizzes/search?q={term}` - Search quizzes
- `GET /api/quizzes/by-tags?tags={tag1,tag2}` - Filter by tags

### Quiz Participation
- `POST /api/attempts/submit` - Submit quiz attempt
- `POST /api/attempts/public/submit` - Submit public quiz attempt
- `GET /api/attempts/quiz/{quizId}` - Get attempts for a quiz (authenticated)
- `GET /api/attempts/quiz/{quizId}/statistics` - Get quiz statistics

### User Management
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `DELETE /api/users/me` - Delete current user account
- `GET /api/users/profile/{id}` - Get public user profile

## Configuration

### JWT Configuration
Configure JWT settings in `application.yml`:
```yaml
app:
  jwt:
    secret: your-secret-key-here
    expiration: 86400000 # 24 hours
```

### CORS Configuration
CORS is configured to allow requests from React development servers:
```yaml
cors:
  allowed-origins: http://localhost:3000,http://localhost:5173
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: "*"
  allow-credentials: true
```

## Data Models

### User
- ID, email, username, firstName, lastName
- Auto-generated username from email
- Encrypted password
- Creation timestamp

### Quiz
- Title, description, tags
- Questions with multiple types
- Theme customization
- Randomization settings
- Creator relationship

### Question
- Type (multiple-choice, true/false, open-ended)
- Question text and options
- Correct answer and hints
- Difficulty level and time limit

### Quiz Attempt
- Participant information
- Answers with confidence levels
- Scoring and timing data
- Usage statistics (hints used, time taken)

## Scoring System

The API implements a sophisticated scoring system:

- **Base Points**: Difficulty-based (Easy: 10, Medium: 15, Hard: 20)
- **Confidence Multiplier**: 1-5 confidence scale (0.8x - 1.2x multiplier)
- **Hint Penalty**: 20% point reduction when hints are used
- **Final Score**: Base Points × Confidence Multiplier × Hint Multiplier

## Security Features

- JWT token-based authentication
- Password encryption with BCrypt
- Role-based access control
- CORS protection
- Request validation
- Global exception handling

## Development

### Running Tests
```bash
mvn test
```

### Building for Production
```bash
mvn clean package -Pprod
```

### Database Migration
The application uses Hibernate's `ddl-auto: update` for development. For production, consider using Flyway or Liquibase for proper database versioning.

## Frontend Integration

This backend is designed to work seamlessly with the React frontend. The API responses match the frontend's TypeScript interfaces:

- User authentication flows
- Quiz CRUD operations
- Real-time quiz participation
- Analytics and reporting data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@quizmasterpro.com
- Documentation: API documentation available via Swagger UI
- Issues: GitHub Issues for bug reports and feature requests