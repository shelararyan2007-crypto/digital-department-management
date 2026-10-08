package com.digidept.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "class_batches",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "department_id",
                                "academic_year",
                                "division"
                        }
                )
        }
)
public class ClassBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "academic_year",
            nullable = false
    )
    private AcademicYear academicYear;

    @Column(nullable = false)
    private String division;

    @ManyToOne
    @JoinColumn(
            name = "department_id",
            nullable = false
    )
    private Department department;

    public ClassBatch() {
    }

    public ClassBatch(
            AcademicYear academicYear,
            String division,
            Department department) {

        this.academicYear = academicYear;
        this.division = division;
        this.department = department;
    }

    public Long getId() {
        return id;
    }

    public AcademicYear getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(
            AcademicYear academicYear) {

        this.academicYear = academicYear;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(
            Department department) {

        this.department = department;
    }
}