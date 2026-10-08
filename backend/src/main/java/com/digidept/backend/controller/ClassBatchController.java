package com.digidept.backend.controller;

import com.digidept.backend.entity.AcademicYear;
import com.digidept.backend.entity.ClassBatch;
import com.digidept.backend.service.ClassBatchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "http://localhost:5173")
public class ClassBatchController {

    private final ClassBatchService classBatchService;

    public ClassBatchController(
            ClassBatchService classBatchService) {

        this.classBatchService =
                classBatchService;
    }

    @PostMapping
    public ClassBatch createClassBatch(
            @RequestParam AcademicYear academicYear,
            @RequestParam String division,
            @RequestParam Long departmentId) {

        return classBatchService.createClassBatch(
                academicYear,
                division,
                departmentId
        );
    }

    @GetMapping(
            "/department/{departmentId}"
    )
    public List<ClassBatch>
    getClassesByDepartment(
            @PathVariable Long departmentId) {

        return classBatchService
                .getClassesByDepartment(
                        departmentId
                );
    }

    @GetMapping("/{id}")
    public ClassBatch getClassBatchById(
            @PathVariable Long id) {

        return classBatchService
                .getClassBatchById(id);
    }

    @PutMapping("/{id}")
    public ClassBatch updateClassBatch(
            @PathVariable Long id,
            @RequestParam AcademicYear academicYear,
            @RequestParam String division) {

        return classBatchService.updateClassBatch(
                id,
                academicYear,
                division
        );
    }

    @DeleteMapping("/{id}")
    public String deleteClassBatch(
            @PathVariable Long id) {

        classBatchService.deleteClassBatch(id);

        return "Class batch deleted successfully";
    }
}