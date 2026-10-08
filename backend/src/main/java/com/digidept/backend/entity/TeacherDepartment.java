package com.digidept.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "teacher_departments",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"teacher_id", "department_id"}
        )
    }
)
public class TeacherDepartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus status;

    public TeacherDepartment() {
    }

    public TeacherDepartment(
            User teacher,
            Department department,
            ApprovalStatus status) {

        this.teacher = teacher;
        this.department = department;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public ApprovalStatus getStatus() {
        return status;
    }

    public void setStatus(ApprovalStatus status) {
        this.status = status;
    }
}