package com.digidept.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "subject_teacher_assignments",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "subject_id",
                                "class_batch_id"
                        }
                )
        }
)
public class SubjectTeacherAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "subject_id",
            nullable = false
    )
    private Subject subject;

    @ManyToOne
    @JoinColumn(
            name = "teacher_id",
            nullable = false
    )
    private User teacher;

    @ManyToOne
    @JoinColumn(
            name = "class_batch_id",
            nullable = false
    )
    private ClassBatch classBatch;

    public SubjectTeacherAssignment() {
    }

    public SubjectTeacherAssignment(
            Subject subject,
            User teacher,
            ClassBatch classBatch) {

        this.subject = subject;
        this.teacher = teacher;
        this.classBatch = classBatch;
    }

    public Long getId() {
        return id;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }

    public ClassBatch getClassBatch() {
        return classBatch;
    }

    public void setClassBatch(ClassBatch classBatch) {
        this.classBatch = classBatch;
    }
}