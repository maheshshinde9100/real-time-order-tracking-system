package com.mahesh.RealTimeOrderTracking.security;

import com.mahesh.RealTimeOrderTracking.entity.Role;
import com.mahesh.RealTimeOrderTracking.entity.User;
import com.mahesh.RealTimeOrderTracking.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostConstruct
    public void seedAdmin() {
        if (userRepository.findByUsername("mahesh").isEmpty()) {
            User admin = User.builder()
                    .username("mahesh")
                    .password(passwordEncoder.encode("mahesh123"))
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
        }
    }

    public String signup(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(Role.ROLE_CUSTOMER)
                .build();
        userRepository.save(user);
        return "Signup successful";
    }

    public String login(String username, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        User user = userRepository.findByUsername(username).orElseThrow();
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().name().substring(5))
                .build();
        
        return jwtService.generateToken(Map.of("role", user.getRole().name()), userDetails);
    }
}
