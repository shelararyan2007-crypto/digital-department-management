package com.digidept.backend.repository;

import com.digidept.backend.entity.SubjectTeacherAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectTeacherAssignmentRepository
        extends JpaRepository<SubjectTeacherAssignment, Long> {

    List<SubjectTeacherAssignment> findByClassBatchId(
            Long classBatchId
    );

    List<SubjectTeacherAssignment> findBySubjectId(
            Long subjectId
    );

    List<SubjectTeacherAssignment> findByTeacherId(
            Long teacherId
    );

    Optional<SubjectTeacherAssignment> findBySubjectIdAndClassBatchId(
            Long subjectId,
            Long classBatchId
    );

    List<SubjectTeacherAssignment> findByClassBatchDepartmentId(
            Long departmentId
    );

    List<SubjectTeacherAssignment>
    findByClassBatchDepartmentIdAndClassBatchAcademicYear(
            Long departmentId,
            com.digidept.backend.entity.AcademicYear academicYear
    );

    List<SubjectTeacherAssignment>
    findByClassBatchDepartmentIdAndClassBatchAcademicYearAndClassBatchDivision(
            Long departmentId,
            com.digidept.backend.entity.AcademicYear academicYear,
            String division
    );
}