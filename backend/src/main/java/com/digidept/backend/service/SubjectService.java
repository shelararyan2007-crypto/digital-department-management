package com.digidept.backend.service;

import com.digidept.backend.entity.AcademicYear;
import com.digidept.backend.entity.Department;
import com.digidept.backend.entity.Subject;
import com.digidept.backend.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final DepartmentService departmentService;

    public SubjectService(
            SubjectRepository subjectRepository,
            DepartmentService departmentService) {

        this.subjectRepository = subjectRepository;
        this.departmentService = departmentService;
    }

    // CREATE SUBJECT
    public Subject createSubject(
            String name,
            String code,
            Long departmentId,
            AcademicYear academicYear,
            Integer semester) {

        Department department =
                departmentService.getDepartmentById(
                        departmentId
                );

        validateAcademicStructure(
                department,
                academicYear,
                semester
        );

        if (subjectRepository
                .existsByCodeAndDepartmentIdAndSemester(
                        code,
                        departmentId,
                        semester
                )) {

            throw new RuntimeException(
                    "Subject code already exists for this department and semester"
            );
        }

        Subject subject =
                new Subject(
                        name,
                        code,
                        academicYear,
                        semester,
                        department
                );

        return subjectRepository.save(subject);
    }

    // GET ALL SUBJECTS OF DEPARTMENT
    public List<Subject> getSubjectsByDepartment(
            Long departmentId) {

        return subjectRepository
                .findByDepartmentId(departmentId);
    }

    // GET SUBJECTS BY DEPARTMENT + YEAR
    public List<Subject> getSubjectsByDepartmentAndYear(
            Long departmentId,
            AcademicYear academicYear) {

        return subjectRepository
                .findByDepartmentIdAndAcademicYear(
                        departmentId,
                        academicYear
                );
    }

    // GET SUBJECTS BY DEPARTMENT + SEMESTER
    public List<Subject> getSubjectsByDepartmentAndSemester(
            Long departmentId,
            Integer semester) {

        return subjectRepository
                .findByDepartmentIdAndSemester(
                        departmentId,
                        semester
                );
    }

    // GET SUBJECTS BY DEPARTMENT + YEAR + SEMESTER
    public List<Subject> getSubjectsByDepartmentYearAndSemester(
            Long departmentId,
            AcademicYear academicYear,
            Integer semester) {

        return subjectRepository
                .findByDepartmentIdAndAcademicYearAndSemester(
                        departmentId,
                        academicYear,
                        semester
                );
    }

    // GET SUBJECT BY ID
    public Subject getSubjectById(Long id) {

        return subjectRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Subject not found"
                        ));
    }

    // UPDATE SUBJECT
    public Subject updateSubject(
            Long id,
            String name,
            String code,
            AcademicYear academicYear,
            Integer semester) {

        Subject subject =
                getSubjectById(id);

        Department department =
                subject.getDepartment();

        validateAcademicStructure(
                department,
                academicYear,
                semester
        );

        if (!subject.getCode().equalsIgnoreCase(code)
                || !subject.getSemester().equals(semester)) {

            if (subjectRepository
                    .existsByCodeAndDepartmentIdAndSemester(
                            code,
                            department.getId(),
                            semester
                    )) {

                throw new RuntimeException(
                        "Subject code already exists for this department and semester"
                );
            }
        }

        subject.setName(name);
        subject.setCode(code);
        subject.setAcademicYear(academicYear);
        subject.setSemester(semester);

        return subjectRepository.save(subject);
    }

    // DELETE SUBJECT
    public void deleteSubject(Long id) {

        Subject subject =
                getSubjectById(id);

        subjectRepository.delete(subject);
    }

    // ACADEMIC STRUCTURE VALIDATION
    private void validateAcademicStructure(
            Department department,
            AcademicYear academicYear,
            Integer semester) {

        if (academicYear == null) {
            throw new RuntimeException(
                    "Academic year is required"
            );
        }

        if (semester == null) {
            throw new RuntimeException(
                    "Semester is required"
            );
        }

        if (semester < 1 || semester > 8) {
            throw new RuntimeException(
                    "Semester must be between 1 and 8"
            );
        }

        String departmentCode =
                department.getCode();

        // DESH handles FE only
        if ("DESH".equalsIgnoreCase(departmentCode)) {

            if (academicYear != AcademicYear.FE) {

                throw new RuntimeException(
                        "DESH department can only have FE subjects"
                );
            }

            if (semester != 1 && semester != 2) {

                throw new RuntimeException(
                        "DESH FE subjects can only belong to Semester 1 or Semester 2"
                );
            }

            return;
        }

        // Other engineering branches start from SE
        if (academicYear == AcademicYear.FE) {

            throw new RuntimeException(
                    "FE subjects are only available under DESH"
            );
        }

        // SE → Semester 3,4
        if (academicYear == AcademicYear.SE) {

            if (semester != 3 && semester != 4) {

                throw new RuntimeException(
                        "SE subjects can only belong to Semester 3 or Semester 4"
                );
            }

            return;
        }

        // TE → Semester 5,6
        if (academicYear == AcademicYear.TE) {

            if (semester != 5 && semester != 6) {

                throw new RuntimeException(
                        "TE subjects can only belong to Semester 5 or Semester 6"
                );
            }

            return;
        }

        // BE → Semester 7,8
        if (academicYear == AcademicYear.BE) {

            if (semester != 7 && semester != 8) {

                throw new RuntimeException(
                        "BE subjects can only belong to Semester 7 or Semester 8"
                );
            }
        }
    }
}