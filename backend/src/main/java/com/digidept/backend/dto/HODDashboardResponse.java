package com.digidept.backend.dto;

public class HODDashboardResponse {

    private Long departmentId;
    private String departmentName;

    private long totalTeachers;
    private long totalStudents;
    private long pendingRequests;

    private double todaysAttendance;


    public HODDashboardResponse() {
    }


    public HODDashboardResponse(
            Long departmentId,
            String departmentName,
            long totalTeachers,
            long totalStudents,
            long pendingRequests,
            double todaysAttendance) {

        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.totalTeachers = totalTeachers;
        this.totalStudents = totalStudents;
        this.pendingRequests = pendingRequests;
        this.todaysAttendance = todaysAttendance;
    }


    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }


    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }


    public long getTotalTeachers() {
        return totalTeachers;
    }

    public void setTotalTeachers(long totalTeachers) {
        this.totalTeachers = totalTeachers;
    }


    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }


    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }


    public double getTodaysAttendance() {
        return todaysAttendance;
    }

    public void setTodaysAttendance(double todaysAttendance) {
        this.todaysAttendance = todaysAttendance;
    }
}