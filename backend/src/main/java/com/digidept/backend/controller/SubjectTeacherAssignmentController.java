package com.digidept.backend.controller;

import com.digidept.backend.entity.AcademicYear;
import com.digidept.backend.entity.SubjectTeacherAssignment;
import com.digidept.backend.service.SubjectTeacherAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subject-assignments")
@CrossOrigin(origins = "http://localhost:5173")
public class SubjectTeacherAssignmentController {

    private final SubjectTeacherAssignmentService assignmentService;

    public SubjectTeacherAssignmentController(
            SubjectTeacherAssignmentService assignmentService) {

        this.assignmentService = assignmentService;
    }

    // ---------------------------------------------------------
    // CREATE ASSIGNMENT
    // ---------------------------------------------------------

    @PostMapping
    public ResponseEntity<?> createAssignment(
            @RequestParam Long subjectId,
            @RequestParam Long teacherId,
            @RequestParam Long classBatchId) {

        try {

            SubjectTeacherAssignment assignment =
                    assignmentService.createAssignment(
                            subjectId,
                            teacherId,
                            classBatchId
                    );

            return ResponseEntity.ok(assignment);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // ---------------------------------------------------------
    // GET ALL DEPARTMENT ASSIGNMENTS
    // ---------------------------------------------------------

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<SubjectTeacherAssignment>>
    getDepartmentAssignments(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                assignmentService.getDepartmentAssignments(
                        departmentId
                )
        );
    }

    // ---------------------------------------------------------
    // GET BY DEPARTMENT + ACADEMIC YEAR
    // ---------------------------------------------------------

    @GetMapping("/department/{departmentId}/year/{academicYear}")
    public ResponseEntity<List<SubjectTeacherAssignment>>
    getDepartmentAssignmentsByAcademicYear(
            @PathVariable Long departmentId,
            @PathVariable AcademicYear academicYear) {

        return ResponseEntity.ok(
                assignmentService
                        .getDepartmentAssignmentsByAcademicYear(
                                departmentId,
                                academicYear
                        )
        );
    }

    // ---------------------------------------------------------
    // GET BY DEPARTMENT + YEAR + DIVISION
    // ---------------------------------------------------------

    @GetMapping(
            "/department/{departmentId}/year/{academicYear}/division/{division}"
    )
    public ResponseEntity<List<SubjectTeacherAssignment>>
    getDepartmentAssignmentsByAcademicYearAndDivision(
            @PathVariable Long departmentId,
            @PathVariable AcademicYear academicYear,
            @PathVariable String division) {

        return ResponseEntity.ok(
                assignmentService
                        .getDepartmentAssignmentsByAcademicYearAndDivision(
                                departmentId,
                                academicYear,
                                division
                        )
        );
    }

    // ---------------------------------------------------------
    // GET ASSIGNMENTS FOR SUBJECT
    // ---------------------------------------------------------

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<SubjectTeacherAssignment>>
    getSubjectAssignments(
            @PathVariable Long subjectId) {

        return ResponseEntity.ok(
                assignmentService.getSubjectAssignments(
                        subjectId
                )
        );
    }

    // ---------------------------------------------------------
    // GET ASSIGNMENTS FOR TEACHER
    // ---------------------------------------------------------

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<SubjectTeacherAssignment>>
    getTeacherAssignments(
            @PathVariable Long teacherId) {

        return ResponseEntity.ok(
                assignmentService.getTeacherAssignments(
                        teacherId
                )
        );
    }

    // ---------------------------------------------------------
    // DELETE ASSIGNMENT
    // ---------------------------------------------------------

    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<?> deleteAssignment(
            @PathVariable Long assignmentId) {

        try {

            assignmentService.deleteAssignment(
                    assignmentId
            );

            return ResponseEntity.ok(
                    "Subject assignment removed successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}