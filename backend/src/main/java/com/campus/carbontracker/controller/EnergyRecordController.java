package com.campus.carbontracker.controller;

import com.campus.carbontracker.dto.CampusStatsResponse;
import com.campus.carbontracker.dto.EnergyRecordRequest;
import com.campus.carbontracker.model.EnergyRecord;
import com.campus.carbontracker.service.EnergyRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
@Tag(name = "Energy Records", description = "Endpoints for managing and viewing campus energy and carbon footprint records")
@SecurityRequirement(name = "bearerAuth")
public class EnergyRecordController {

    private final EnergyRecordService service;

    public EnergyRecordController(EnergyRecordService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Get all energy records, optionally filtered by department (Students and Admins)")
    public ResponseEntity<List<EnergyRecord>> getAllRecords(
            @RequestParam(required = false) String department) {
        if (department != null && !department.trim().isEmpty()) {
            return ResponseEntity.ok(service.getRecordsByDepartment(department));
        }
        return ResponseEntity.ok(service.getAllRecords());
    }

    @GetMapping("/stats")
    @Operation(summary = "Get campus aggregated carbon and energy metrics (Students and Admins)")
    public ResponseEntity<CampusStatsResponse> getCampusStats() {
        return ResponseEntity.ok(service.getCampusStats());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single energy record by ID")
    public ResponseEntity<EnergyRecord> getRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getRecordById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new energy record (Admin only). Carbon emissions are calculated automatically.")
    public ResponseEntity<EnergyRecord> createRecord(
            @Valid @RequestBody EnergyRecordRequest request,
            Authentication authentication) {
        String loggedBy = authentication != null ? authentication.getName() : "admin";
        EnergyRecord created = service.createRecord(request, loggedBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing energy record (Admin only)")
    public ResponseEntity<EnergyRecord> updateRecord(
            @PathVariable Long id,
            @Valid @RequestBody EnergyRecordRequest request) {
        EnergyRecord updated = service.updateRecord(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an energy record (Admin only)")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        service.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }
}
