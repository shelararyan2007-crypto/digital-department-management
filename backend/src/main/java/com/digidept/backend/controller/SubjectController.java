package com.digidept.backend.controller;

import com.digidept.backend.entity.AcademicYear;
import com.digidept.backend.entity.Subject;
import com.digidept.backend.service.SubjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://127.0.0.1:5173"
        }
)
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(
            SubjectService subjectService) {

        this.subjectService = subjectService;
    }

    // CREATE SUBJECT
    @PostMapping
    public Subject createSubject(
            @RequestParam String name,
            @RequestParam String code,
            @RequestParam Long departmentId,
            @RequestParam AcademicYear academicYear,
            @RequestParam Integer semester) {

        return subjectService.createSubject(
                name,
                code,
                departmentId,
                academicYear,
                semester
        );
    }

    // GET ALL SUBJECTS OF DEPARTMENT
    @GetMapping("/department/{departmentId}")
    public List<Subject> getSubjectsByDepartment(
            @PathVariable Long departmentId) {

        return subjectService
                .getSubjectsByDepartment(
                        departmentId
                );
    }

    // GET SUBJECTS BY DEPARTMENT + YEAR
    @GetMapping("/department/{departmentId}/year/{academicYear}")
    public List<Subject> getSubjectsByDepartmentAndYear(
            @PathVariable Long departmentId,
            @PathVariable AcademicYear academicYear) {

        return subjectService
                .getSubjectsByDepartmentAndYear(
                        departmentId,
                        academicYear
                );
    }

    // GET SUBJECTS BY DEPARTMENT + SEMESTER
    @GetMapping("/department/{departmentId}/semester/{semester}")
    public List<Subject> getSubjectsByDepartmentAndSemester(
            @PathVariable Long departmentId,
            @PathVariable Integer semester) {

        return subjectService
                .getSubjectsByDepartmentAndSemester(
                        departmentId,
                        semester
                );
    }

    // GET SUBJECTS BY DEPARTMENT + YEAR + SEMESTER
    @GetMapping(
            "/department/{departmentId}/year/{academicYear}/semester/{semester}"
    )
    public List<Subject> getSubjectsByDepartmentYearAndSemester(
            @PathVariable Long departmentId,
            @PathVariable AcademicYear academicYear,
            @PathVariable Integer semester) {

        return subjectService
                .getSubjectsByDepartmentYearAndSemester(
                        departmentId,
                        academicYear,
                        semester
                );
    }

    // GET SUBJECT BY ID
    @GetMapping("/{id}")
    public Subject getSubjectById(
            @PathVariable Long id) {

        return subjectService
                .getSubjectById(id);
    }

    // UPDATE SUBJECT
    @PutMapping("/{id}")
    public Subject updateSubject(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String code,
            @RequestParam AcademicYear academicYear,
            @RequestParam Integer semester) {

        return subjectService.updateSubject(
                id,
                name,
                code,
                academicYear,
                semester
        );
    }

    // DELETE SUBJECT
    @DeleteMapping("/{id}")
    public String deleteSubject(
            @PathVariable Long id) {

        subjectService.deleteSubject(id);

        return "Subject deleted successfully";
    }
}