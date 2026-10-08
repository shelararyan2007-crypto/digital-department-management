package com.digidept.backend.repository;

import com.digidept.backend.entity.Attendance;
import com.digidept.backend.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    long countByDepartmentIdAndAttendanceDate(
            Long departmentId,
            LocalDate attendanceDate
    );

    long countByDepartmentIdAndAttendanceDateAndStatus(
            Long departmentId,
            LocalDate attendanceDate,
            AttendanceStatus status
    );
}