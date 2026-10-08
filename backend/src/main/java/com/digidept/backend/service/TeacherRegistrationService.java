package com.digidept.backend.service;

import com.digidept.backend.dto.TeacherRegistrationRequest;
import com.digidept.backend.dto.TeacherRegistrationResponse;
import com.digidept.backend.entity.ApprovalStatus;
import com.digidept.backend.entity.Department;
import com.digidept.backend.entity.Role;
import com.digidept.backend.entity.TeacherDepartment;
import com.digidept.backend.entity.User;
import com.digidept.backend.repository.TeacherDepartmentRepository;
import com.digidept.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeacherRegistrationService {

    private final UserRepository userRepository;
    private final DepartmentService departmentService;
    private final TeacherDepartmentRepository teacherDepartmentRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherRegistrationService(
            UserRepository userRepository,
            DepartmentService departmentService,
            TeacherDepartmentRepository teacherDepartmentRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.departmentService = departmentService;
        this.teacherDepartmentRepository =
                teacherDepartmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public TeacherRegistrationResponse registerTeacher(
            TeacherRegistrationRequest request) {

        /*
         * Basic validation
         */

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Full name is required"
            );
        }

        if (request.getUsername() == null ||
                request.getUsername().trim().isEmpty()) {

            throw new RuntimeException(
                    "Faculty ID is required"
            );
        }

        if (request.getPassword() == null ||
                request.getPassword().isEmpty()) {

            throw new RuntimeException(
                    "Password is required"
            );
        }
if (request.getDateOfBirth() == null) {
    throw new RuntimeException("Date of birth is required");
}

if (request.getDateOfBirth().isAfter(java.time.LocalDate.now())) {
    throw new RuntimeException("Date of birth cannot be in the future");
}

java.time.LocalDate today =
        java.time.LocalDate.now();

int age =
        java.time.Period.between(
                request.getDateOfBirth(),
                today
        ).getYears();

if (age < 18) {
    throw new RuntimeException(
            "Teacher registration requires the applicant to be at least 18 years old"
    );
}
        if (request.getDepartmentId() == null) {

            throw new RuntimeException(
                    "Department is required"
            );
        }


        /*
         * Normalize Faculty ID
         */

        String username =
                request.getUsername()
                        .trim()
                        .toUpperCase();


        /*
         * Check duplicate Faculty ID
         */

        if (userRepository
                .findByUsername(username)
                .isPresent()) {

            throw new RuntimeException(
                    "Faculty ID already exists"
            );
        }


        /*
         * Find selected department
         */

        Department department =
                departmentService.getDepartmentById(
                        request.getDepartmentId()
                );


        /*
         * Create teacher account
         *
         * IMPORTANT:
         * department is deliberately NOT
         * assigned to User.
         *
         * Teacher department membership
         * is stored in TeacherDepartment.
         */

        User teacher = new User();

        teacher.setName(
                request.getName().trim()
        );

        teacher.setUsername(username);

        teacher.setEmail(
                request.getEmail()
        );

        teacher.setDateOfBirth(
                request.getDateOfBirth()
        );

        teacher.setMobile(
                request.getMobile()
        );

        teacher.setGender(
                request.getGender()
        );

        teacher.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        teacher.setRole(
                Role.TEACHING_STAFF
        );

        teacher.setDepartment(null);


        /*
         * Save teacher
         */

        User savedTeacher =
                userRepository.save(teacher);


        /*
         * Create department request
         *
         * Teacher is NOT approved yet.
         */

        TeacherDepartment teacherDepartment =
                new TeacherDepartment(
                        savedTeacher,
                        department,
                        ApprovalStatus.PENDING
                );

        teacherDepartmentRepository.save(
                teacherDepartment
        );


        /*
         * Return safe response
         */

        return new TeacherRegistrationResponse(
                "Teacher registration submitted successfully. Waiting for HOD approval.",
                savedTeacher.getId(),
                savedTeacher.getName(),
                savedTeacher.getUsername(),
                department.getName(),
                ApprovalStatus.PENDING.name()
        );
    }
}