package com.example.quiz.controller;

import com.example.quiz.model.User;
import com.example.quiz.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    // --- SIGNUP ---
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepo.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        }
        if (userRepo.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already in use"));
        }

        user.setPassword(encoder.encode(user.getPassword())); // store encoded password
        userRepo.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    // --- LOGIN (username OR email) ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String identifier = req.get("username"); // frontend may still send "username"
        String email = req.get("email");         // or frontend may send "email"
        String password = req.get("password");

        // Pick whichever is provided
        Optional<User> userOpt = Optional.empty();
        if (identifier != null && !identifier.isBlank()) {
            userOpt = userRepo.findByUsername(identifier);
        } else if (email != null && !email.isBlank()) {
            userOpt = userRepo.findByEmail(email);
        }

        return userOpt.map(u -> {
            if (encoder.matches(password, u.getPassword())) {
                return ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "username", u.getUsername(),
                        "email", u.getEmail()
                ));
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid username/email or password"));
            }
        }).orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid username/email or password")));
    }
}
