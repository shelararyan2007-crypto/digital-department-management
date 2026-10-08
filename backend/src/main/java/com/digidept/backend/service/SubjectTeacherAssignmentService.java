package com.digidept.backend.service;

import com.digidept.backend.entity.*;
import com.digidept.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SubjectTeacherAssignmentService {

    private final SubjectTeacherAssignmentRepository assignmentRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final ClassBatchRepository classBatchRepository;
    private final TeacherDepartmentRepository teacherDepartmentRepository;

    public SubjectTeacherAssignmentService(
            SubjectTeacherAssignmentRepository assignmentRepository,
            SubjectRepository subjectRepository,
            UserRepository userRepository,
            ClassBatchRepository classBatchRepository,
            TeacherDepartmentRepository teacherDepartmentRepository) {

        this.assignmentRepository = assignmentRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.classBatchRepository = classBatchRepository;
        this.teacherDepartmentRepository = teacherDepartmentRepository;
    }

    @Transactional
    public SubjectTeacherAssignment createAssignment(
            Long subjectId,
            Long teacherId,
            Long classBatchId) {

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));

        ClassBatch classBatch = classBatchRepository.findById(classBatchId)
                .orElseThrow(() ->
                        new RuntimeException("Class batch not found"));

        // ---------------------------------------------------------
        // Basic validation
        // ---------------------------------------------------------

        if (teacher.getRole() != Role.TEACHING_STAFF) {
            throw new RuntimeException(
                    "Selected user is not a teaching staff member"
            );
        }

        // ---------------------------------------------------------
        // Subject and class must belong to same department
        // ---------------------------------------------------------

        if (!subject.getDepartment().getId()
                .equals(classBatch.getDepartment().getId())) {

            throw new RuntimeException(
                    "Subject and class batch belong to different departments"
            );
        }

        // ---------------------------------------------------------
        // Academic year must match
        // ---------------------------------------------------------

        if (subject.getAcademicYear()
                != classBatch.getAcademicYear()) {

            throw new RuntimeException(
                    "Subject and class batch belong to different academic years"
            );
        }

        // ---------------------------------------------------------
        // Check teacher approval for this department
        // ---------------------------------------------------------

        TeacherDepartment teacherDepartment =
                teacherDepartmentRepository
                        .findByTeacherIdAndDepartmentId(
                                teacherId,
                                subject.getDepartment().getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Teacher is not registered with this department"
                                )
                        );

        if (teacherDepartment.getStatus()
                != ApprovalStatus.APPROVED) {

            throw new RuntimeException(
                    "Teacher is not approved for this department"
            );
        }

        // ---------------------------------------------------------
        // Check duplicate assignment
        // ---------------------------------------------------------

        if (assignmentRepository
                .findBySubjectIdAndClassBatchId(
                        subjectId,
                        classBatchId
                )
                .isPresent()) {

            throw new RuntimeException(
                    "This subject is already assigned to this class"
            );
        }

        // ---------------------------------------------------------
        // Create assignment
        // ---------------------------------------------------------

        SubjectTeacherAssignment assignment =
                new SubjectTeacherAssignment(
                        subject,
                        teacher,
                        classBatch
                );

        return assignmentRepository.save(assignment);
    }

    // -------------------------------------------------------------
    // Get all assignments for department
    // -------------------------------------------------------------

    public List<SubjectTeacherAssignment> getDepartmentAssignments(
            Long departmentId) {

        return assignmentRepository
                .findByClassBatchDepartmentId(departmentId);
    }

    // -------------------------------------------------------------
    // Get assignments by academic year
    // -------------------------------------------------------------

    public List<SubjectTeacherAssignment>
    getDepartmentAssignmentsByAcademicYear(
            Long departmentId,
            AcademicYear academicYear) {

        return assignmentRepository
                .findByClassBatchDepartmentIdAndClassBatchAcademicYear(
                        departmentId,
                        academicYear
                );
    }

    // -------------------------------------------------------------
    // Get assignments by academic year + division
    // -------------------------------------------------------------

    public List<SubjectTeacherAssignment>
    getDepartmentAssignmentsByAcademicYearAndDivision(
            Long departmentId,
            AcademicYear academicYear,
            String division) {

        return assignmentRepository
                .findByClassBatchDepartmentIdAndClassBatchAcademicYearAndClassBatchDivision(
                        departmentId,
                        academicYear,
                        division
                );
    }

    // -------------------------------------------------------------
    // Get assignments for subject
    // -------------------------------------------------------------

    public List<SubjectTeacherAssignment> getSubjectAssignments(
            Long subjectId) {

        return assignmentRepository
                .findBySubjectId(subjectId);
    }

    // -------------------------------------------------------------
    // Get assignments for teacher
    // -------------------------------------------------------------

    public List<SubjectTeacherAssignment> getTeacherAssignments(
            Long teacherId) {

        return assignmentRepository
                .findByTeacherId(teacherId);
    }

    // -------------------------------------------------------------
    // Delete assignment
    // -------------------------------------------------------------

    @Transactional
    public void deleteAssignment(Long assignmentId) {

        if (!assignmentRepository.existsById(assignmentId)) {

            throw new RuntimeException(
                    "Subject assignment not found"
            );
        }

        assignmentRepository.deleteById(assignmentId);
    }
}