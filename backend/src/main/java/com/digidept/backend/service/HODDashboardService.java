package com.digidept.backend.service;

import com.digidept.backend.dto.HODDashboardResponse;
import com.digidept.backend.entity.ApprovalStatus;
import com.digidept.backend.entity.AttendanceStatus;
import com.digidept.backend.entity.Department;
import com.digidept.backend.entity.Role;
import com.digidept.backend.repository.AttendanceRepository;
import com.digidept.backend.repository.TeacherDepartmentRepository;
import com.digidept.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class HODDashboardService {

    private final UserRepository userRepository;

    private final TeacherDepartmentRepository
            teacherDepartmentRepository;

    private final DepartmentService departmentService;

    private final AttendanceRepository attendanceRepository;


    public HODDashboardService(
            UserRepository userRepository,
            TeacherDepartmentRepository
                    teacherDepartmentRepository,
            DepartmentService departmentService,
            AttendanceRepository attendanceRepository) {

        this.userRepository =
                userRepository;

        this.teacherDepartmentRepository =
                teacherDepartmentRepository;

        this.departmentService =
                departmentService;

        this.attendanceRepository =
                attendanceRepository;
    }


    public HODDashboardResponse getDashboard(
            Long departmentId) {

        /*
         * Get department
         */
        Department department =
                departmentService
                        .getDepartmentById(
                                departmentId
                        );


        /*
         * Count approved teachers
         *
         * Teachers belong to departments through
         * TeacherDepartment.
         */
        long totalTeachers =
                teacherDepartmentRepository
                        .countByDepartmentIdAndStatus(
                                departmentId,
                                ApprovalStatus.APPROVED
                        );


        /*
         * Count students
         *
         * Students have their department directly
         * associated with their User record.
         */
        long totalStudents =
                userRepository
                        .countByDepartmentIdAndRole(
                                departmentId,
                                Role.STUDENT
                        );


        /*
         * Count pending teacher requests
         */
        long pendingRequests =
                teacherDepartmentRepository
                        .countByDepartmentIdAndStatus(
                                departmentId,
                                ApprovalStatus.PENDING
                        );


        /*
         * Calculate today's attendance
         */
        LocalDate today =
                LocalDate.now();


        /*
         * Total attendance records created
         * for this department today.
         */
        long totalAttendanceRecords =
                attendanceRepository
                        .countByDepartmentIdAndAttendanceDate(
                                departmentId,
                                today
                        );


        /*
         * Number of students marked PRESENT
         * today.
         */
        long presentAttendanceRecords =
                attendanceRepository
                        .countByDepartmentIdAndAttendanceDateAndStatus(
                                departmentId,
                                today,
                                AttendanceStatus.PRESENT
                        );


        /*
         * Default attendance is 0%
         * when no attendance has been recorded.
         */
        double todaysAttendance = 0;


        if (totalAttendanceRecords > 0) {

            todaysAttendance =
                    (
                            presentAttendanceRecords
                                    * 100.0
                    )
                    / totalAttendanceRecords;
        }


        /*
         * Return complete dashboard response
         */
        return new HODDashboardResponse(

                department.getId(),

                department.getName(),

                totalTeachers,

                totalStudents,

                pendingRequests,

                todaysAttendance
        );
    }
}