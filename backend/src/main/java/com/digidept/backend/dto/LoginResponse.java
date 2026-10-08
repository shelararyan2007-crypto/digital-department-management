package com.digidept.backend.dto;

public class LoginResponse {

    private String message;

    private Long userId;

    private String name;

    private String username;

    private String role;

    private Long departmentId;

    private String departmentName;


    public LoginResponse() {
    }


    public LoginResponse(
            String message,
            Long userId,
            String name,
            String username,
            String role,
            Long departmentId,
            String departmentName) {

        this.message = message;
        this.userId = userId;
        this.name = name;
        this.username = username;
        this.role = role;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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
}