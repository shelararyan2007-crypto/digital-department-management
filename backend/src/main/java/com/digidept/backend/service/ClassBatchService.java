package com.digidept.backend.service;

import com.digidept.backend.entity.AcademicYear;
import com.digidept.backend.entity.ClassBatch;
import com.digidept.backend.entity.Department;
import com.digidept.backend.repository.ClassBatchRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassBatchService {

    private final ClassBatchRepository classBatchRepository;
    private final DepartmentService departmentService;

    public ClassBatchService(
            ClassBatchRepository classBatchRepository,
            DepartmentService departmentService) {

        this.classBatchRepository =
                classBatchRepository;

        this.departmentService =
                departmentService;
    }

    public ClassBatch createClassBatch(
            AcademicYear academicYear,
            String division,
            Long departmentId) {

        Department department =
                departmentService
                        .getDepartmentById(
                                departmentId
                        );

        if (classBatchRepository
                .findByDepartmentIdAndAcademicYearAndDivision(
                        departmentId,
                        academicYear,
                        division
                )
                .isPresent()) {

            throw new RuntimeException(
                    "This class division already exists in this department"
            );
        }

        ClassBatch classBatch =
                new ClassBatch(
                        academicYear,
                        division,
                        department
                );

        return classBatchRepository.save(
                classBatch
        );
    }

    public List<ClassBatch>
    getClassesByDepartment(
            Long departmentId) {

        return classBatchRepository
                .findByDepartmentId(
                        departmentId
                );
    }

    public ClassBatch getClassBatchById(
            Long id) {

        return classBatchRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Class batch not found"
                        ));
    }

    public ClassBatch updateClassBatch(
            Long id,
            AcademicYear academicYear,
            String division) {

        ClassBatch classBatch =
                getClassBatchById(id);

        classBatch.setAcademicYear(
                academicYear
        );

        classBatch.setDivision(
                division
        );

        return classBatchRepository.save(
                classBatch
        );
    }

    public void deleteClassBatch(
            Long id) {

        ClassBatch classBatch =
                getClassBatchById(id);

        classBatchRepository.delete(
                classBatch
        );
    }
}