package com.quizmaster;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class QuizMasterApplication {
    public static void main(String[] args) {
        SpringApplication.run(QuizMasterApplication.class, args);
    }
}