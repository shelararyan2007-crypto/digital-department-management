package com.digidept.backend.controller;

import com.digidept.backend.entity.ApprovalStatus;
import com.digidept.backend.entity.TeacherDepartment;
import com.digidept.backend.service.TeacherDepartmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher-departments")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://127.0.0.1:5173"
        }
)
public class TeacherDepartmentController {

    private final TeacherDepartmentService teacherDepartmentService;

    public TeacherDepartmentController(
            TeacherDepartmentService teacherDepartmentService) {

        this.teacherDepartmentService = teacherDepartmentService;
    }

    @PostMapping("/request")
    public TeacherDepartment createRequest(
            @RequestParam Long teacherId,
            @RequestParam Long departmentId) {

        return teacherDepartmentService.createRequest(
                teacherId,
                departmentId
        );
    }

    @GetMapping("/teacher/{teacherId}")
    public List<TeacherDepartment> getTeacherDepartments(
            @PathVariable Long teacherId) {

        return teacherDepartmentService
                .getTeacherDepartments(teacherId);
    }

    @GetMapping("/department/{departmentId}/pending")
    public List<TeacherDepartment> getPendingRequests(
            @PathVariable Long departmentId) {

        return teacherDepartmentService
                .getPendingRequests(departmentId);
    }

    @GetMapping("/department/{departmentId}")
    public List<TeacherDepartment> getDepartmentTeachers(
            @PathVariable Long departmentId) {

        return teacherDepartmentService
                .getDepartmentTeachers(departmentId);
    }

    @PutMapping("/{id}/status")
    public TeacherDepartment updateStatus(
            @PathVariable Long id,
            @RequestParam ApprovalStatus status) {

        return teacherDepartmentService
                .updateStatus(id, status);
    }
    @DeleteMapping("/{id}")
public void removeTeacherFromDepartment(
        @PathVariable Long id) {

    teacherDepartmentService
            .removeTeacherFromDepartment(id);
}
}