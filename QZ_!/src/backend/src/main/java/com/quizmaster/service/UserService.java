package com.quizmaster.service;

import com.quizmaster.dto.UserRegistrationDto;
import com.quizmaster.dto.UserResponseDto;
import com.quizmaster.entity.User;
import com.quizmaster.exception.EmailAlreadyExistsException;
import com.quizmaster.exception.ResourceNotFoundException;
import com.quizmaster.exception.UsernameAlreadyExistsException;
import com.quizmaster.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public UserResponseDto createUser(UserRegistrationDto registrationDto) {
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new EmailAlreadyExistsException("Email is already in use!");
        }
        
        // Generate username from email
        String username = generateUsernameFromEmail(registrationDto.getEmail());
        
        // Ensure username is unique
        if (userRepository.existsByUsername(username)) {
            username = makeUsernameUnique(username);
        }
        
        User user = new User(
                registrationDto.getEmail(),
                username,
                registrationDto.getFirstName(),
                registrationDto.getLastName(),
                passwordEncoder.encode(registrationDto.getPassword())
        );
        
        User savedUser = userRepository.save(user);
        return new UserResponseDto(savedUser);
    }
    
    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return new UserResponseDto(user);
    }
    
    @Transactional(readOnly = true)
    public UserResponseDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return new UserResponseDto(user);
    }
    
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponseDto::new)
                .collect(Collectors.toList());
    }
    
    public UserResponseDto updateUser(Long id, UserRegistrationDto updateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        // Check if email is being changed and if it's already in use
        if (!user.getEmail().equals(updateDto.getEmail()) && 
            userRepository.existsByEmail(updateDto.getEmail())) {
            throw new EmailAlreadyExistsException("Email is already in use!");
        }
        
        user.setEmail(updateDto.getEmail());
        user.setFirstName(updateDto.getFirstName());
        user.setLastName(updateDto.getLastName());
        
        // Update username if email changed
        if (!user.getEmail().equals(updateDto.getEmail())) {
            String newUsername = generateUsernameFromEmail(updateDto.getEmail());
            if (userRepository.existsByUsername(newUsername) && !user.getUsername().equals(newUsername)) {
                newUsername = makeUsernameUnique(newUsername);
            }
            user.setUsername(newUsername);
        }
        
        // Update password if provided
        if (updateDto.getPassword() != null && !updateDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateDto.getPassword()));
        }
        
        User savedUser = userRepository.save(user);
        return new UserResponseDto(savedUser);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
    }
    
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    private String generateUsernameFromEmail(String email) {
        // Extract the part before @ and clean it up
        String username = email.substring(0, email.indexOf('@'));
        // Remove any non-alphanumeric characters and convert to lowercase
        username = username.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        // Ensure it's not empty and has a reasonable length
        if (username.isEmpty()) {
            username = "user";
        }
        if (username.length() > 20) {
            username = username.substring(0, 20);
        }
        return username;
    }
    
    private String makeUsernameUnique(String baseUsername) {
        String uniqueUsername = baseUsername;
        int counter = 1;
        
        while (userRepository.existsByUsername(uniqueUsername)) {
            uniqueUsername = baseUsername + counter;
            counter++;
        }
        
        return uniqueUsername;
    }
}