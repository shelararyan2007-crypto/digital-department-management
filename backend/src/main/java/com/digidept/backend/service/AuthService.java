package com.digidept.backend.service;

import com.digidept.backend.dto.LoginRequest;
import com.digidept.backend.dto.LoginResponse;
import com.digidept.backend.entity.Department;
import com.digidept.backend.entity.User;
import com.digidept.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public LoginResponse login(LoginRequest request) {

        User user =
                userRepository
                        .findByUsername(request.getUsername())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid username or password"
                                )
                        );


        /*
         * Verify password using BCrypt.
         */
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid username or password"
            );
        }


        /*
         * Get department information.
         *
         * HOD and Student currently have their
         * department directly attached to User.
         *
         * Teachers will use TeacherDepartment
         * membership instead.
         */
        Long departmentId = null;

        String departmentName = null;


        Department department = user.getDepartment();


        if (department != null) {

            departmentId = department.getId();

            departmentName = department.getName();
        }


        /*
         * Return authenticated user information.
         */
        return new LoginResponse(

                "Login successful",

                user.getId(),

                user.getName(),

                user.getUsername(),

                user.getRole().name(),

                departmentId,

                departmentName
        );
    }
}