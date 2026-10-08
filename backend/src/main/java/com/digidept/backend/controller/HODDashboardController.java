package com.digidept.backend.controller;

import com.digidept.backend.dto.HODDashboardResponse;
import com.digidept.backend.service.HODDashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hod/dashboard")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173"
})
public class HODDashboardController {

    private final HODDashboardService hodDashboardService;

    public HODDashboardController(
            HODDashboardService hodDashboardService) {

        this.hodDashboardService =
                hodDashboardService;
    }

    @GetMapping("/{departmentId}")
    public HODDashboardResponse getDashboard(
            @PathVariable Long departmentId) {

        return hodDashboardService
                .getDashboard(departmentId);
    }
}