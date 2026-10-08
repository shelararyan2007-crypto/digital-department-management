package com.digidept.backend.repository;

import com.digidept.backend.entity.AcademicYear;
import com.digidept.backend.entity.ClassBatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClassBatchRepository
        extends JpaRepository<ClassBatch, Long> {

    List<ClassBatch> findByDepartmentId(
            Long departmentId
    );

    Optional<ClassBatch>
    findByDepartmentIdAndAcademicYearAndDivision(
            Long departmentId,
            AcademicYear academicYear,
            String division
    );
}