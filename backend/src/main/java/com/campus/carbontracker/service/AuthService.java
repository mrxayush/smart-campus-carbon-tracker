package com.campus.carbontracker.service;

import com.campus.carbontracker.dto.AuthRequest;
import com.campus.carbontracker.dto.AuthResponse;
import com.campus.carbontracker.dto.RegisterRequest;
import com.campus.carbontracker.model.Role;
import com.campus.carbontracker.model.User;
import com.campus.carbontracker.repository.UserRepository;
import com.campus.carbontracker.security.CustomUserDetailsService;
import com.campus.carbontracker.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       CustomUserDetailsService userDetailsService,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(AuthRequest request) {
        // Authenticate credentials against configured UserDetailsService and PasswordEncoder
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtUtil.generateToken(userDetails, user.getRole().name());

        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        Role assignedRole = request.getRole() != null ? request.getRole() : Role.ROLE_STUDENT;

        User newUser = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                assignedRole
        );

        userRepository.save(newUser);

        UserDetails userDetails = userDetailsService.loadUserByUsername(newUser.getUsername());
        String token = jwtUtil.generateToken(userDetails, newUser.getRole().name());

        return new AuthResponse(token, newUser.getUsername(), newUser.getRole().name());
    }
}
