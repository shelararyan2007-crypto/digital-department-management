package com.digidept.backend.repository;

import com.digidept.backend.entity.ApprovalStatus;
import com.digidept.backend.entity.TeacherDepartment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeacherDepartmentRepository extends JpaRepository<TeacherDepartment, Long> {

    List<TeacherDepartment> findByTeacherId(Long teacherId);

    List<TeacherDepartment> findByDepartmentId(Long departmentId);

    List<TeacherDepartment> findByDepartmentIdAndStatus(
            Long departmentId,
            ApprovalStatus status
    );

    Optional<TeacherDepartment> findByTeacherIdAndDepartmentId(
            Long teacherId,
            Long departmentId
    );

    long countByDepartmentIdAndStatus(
            Long departmentId,
            ApprovalStatus status
    );
}