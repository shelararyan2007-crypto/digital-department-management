package com.digidept.backend.repository;

import com.digidept.backend.entity.AcademicYear;
import com.digidept.backend.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findByDepartmentId(Long departmentId);

    List<Subject> findByDepartmentIdAndAcademicYear(
            Long departmentId,
            AcademicYear academicYear
    );

    List<Subject> findByDepartmentIdAndSemester(
            Long departmentId,
            Integer semester
    );

    List<Subject> findByDepartmentIdAndAcademicYearAndSemester(
            Long departmentId,
            AcademicYear academicYear,
            Integer semester
    );

    boolean existsByCodeAndDepartmentIdAndSemester(
            String code,
            Long departmentId,
            Integer semester
    );
}