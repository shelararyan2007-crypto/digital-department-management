package com.digidept.backend.service;

import com.digidept.backend.entity.ApprovalStatus;
import com.digidept.backend.entity.Department;
import com.digidept.backend.entity.TeacherDepartment;
import com.digidept.backend.entity.User;
import com.digidept.backend.repository.TeacherDepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherDepartmentService {

    private final TeacherDepartmentRepository teacherDepartmentRepository;
    private final UserService userService;
    private final DepartmentService departmentService;

    public TeacherDepartmentService(
            TeacherDepartmentRepository teacherDepartmentRepository,
            UserService userService,
            DepartmentService departmentService) {

        this.teacherDepartmentRepository = teacherDepartmentRepository;
        this.userService = userService;
        this.departmentService = departmentService;
    }

    public TeacherDepartment createRequest(
            Long teacherId,
            Long departmentId) {

        User teacher = userService.getUserById(teacherId);
        Department department =
                departmentService.getDepartmentById(departmentId);

        TeacherDepartment request = new TeacherDepartment(
                teacher,
                department,
                ApprovalStatus.PENDING
        );

        return teacherDepartmentRepository.save(request);
    }

    public List<TeacherDepartment> getPendingRequests(
            Long departmentId) {

        return teacherDepartmentRepository
                .findByDepartmentIdAndStatus(
                        departmentId,
                        ApprovalStatus.PENDING
                );
    }

    public List<TeacherDepartment> getTeacherDepartments(
            Long teacherId) {

        return teacherDepartmentRepository
                .findByTeacherId(teacherId);
    }

    public List<TeacherDepartment> getDepartmentTeachers(
            Long departmentId) {

        return teacherDepartmentRepository
                .findByDepartmentId(departmentId);
    }

    public TeacherDepartment updateStatus(
            Long teacherDepartmentId,
            ApprovalStatus status) {

        TeacherDepartment relationship =
                teacherDepartmentRepository
                        .findById(teacherDepartmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Teacher department request not found"
                                ));

        relationship.setStatus(status);

        return teacherDepartmentRepository.save(relationship);
    }
    public void removeTeacherFromDepartment(Long teacherDepartmentId) {

    TeacherDepartment relationship =
            teacherDepartmentRepository
                    .findById(teacherDepartmentId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Teacher department relationship not found"
                            ));

    teacherDepartmentRepository.delete(relationship);
}
}