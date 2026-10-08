package com.digidept.backend.controller;

import com.digidept.backend.dto.TeacherRegistrationRequest;
import com.digidept.backend.dto.TeacherRegistrationResponse;
import com.digidept.backend.service.TeacherRegistrationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher-registration")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://127.0.0.1:5173"
        }
)
public class TeacherRegistrationController {

    private final TeacherRegistrationService
            teacherRegistrationService;

    public TeacherRegistrationController(
            TeacherRegistrationService teacherRegistrationService) {

        this.teacherRegistrationService =
                teacherRegistrationService;
    }

    @PostMapping
    public TeacherRegistrationResponse registerTeacher(
            @RequestBody TeacherRegistrationRequest request) {

        return teacherRegistrationService
                .registerTeacher(request);
    }
}