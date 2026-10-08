package com.digidept.backend.dto;

public class TeacherRegistrationResponse {

    private String message;
    private Long teacherId;
    private String name;
    private String username;
    private String departmentName;
    private String status;

    public TeacherRegistrationResponse() {
    }

    public TeacherRegistrationResponse(
            String message,
            Long teacherId,
            String name,
            String username,
            String departmentName,
            String status) {

        this.message = message;
        this.teacherId = teacherId;
        this.name = name;
        this.username = username;
        this.departmentName = departmentName;
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}