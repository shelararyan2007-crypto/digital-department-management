package com.digidept.backend.service;

import com.digidept.backend.dto.CreateUserRequest;
import com.digidept.backend.entity.Department;
import com.digidept.backend.entity.User;
import com.digidept.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentService departmentService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            DepartmentService departmentService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.departmentService = departmentService;
    }

    public User createUser(CreateUserRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setMobile(request.getMobile());
        user.setGender(request.getGender());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        if (request.getDepartmentId() != null) {

            Department department =
                    departmentService.getDepartmentById(
                            request.getDepartmentId()
                    );

            user.setDepartment(department);
        }

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}