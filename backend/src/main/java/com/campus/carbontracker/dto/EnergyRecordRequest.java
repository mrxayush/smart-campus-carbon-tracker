package com.campus.carbontracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class EnergyRecordRequest {

    @NotBlank(message = "Department name is required")
    private String departmentName;

    @NotNull(message = "Electricity usage is required")
    @DecimalMin(value = "0.0", message = "Electricity usage cannot be negative")
    private Double electricityKWh;

    @NotNull(message = "Water usage is required")
    @DecimalMin(value = "0.0", message = "Water usage cannot be negative")
    private Double waterUsageLitres;

    private LocalDate loggedDate; // Defaults to LocalDate.now() if null

    public EnergyRecordRequest() {
    }

    public EnergyRecordRequest(String departmentName, Double electricityKWh, Double waterUsageLitres, LocalDate loggedDate) {
        this.departmentName = departmentName;
        this.electricityKWh = electricityKWh;
        this.waterUsageLitres = waterUsageLitres;
        this.loggedDate = loggedDate;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public Double getElectricityKWh() {
        return electricityKWh;
    }

    public void setElectricityKWh(Double electricityKWh) {
        this.electricityKWh = electricityKWh;
    }

    public Double getWaterUsageLitres() {
        return waterUsageLitres;
    }

    public void setWaterUsageLitres(Double waterUsageLitres) {
        this.waterUsageLitres = waterUsageLitres;
    }

    public LocalDate getLoggedDate() {
        return loggedDate;
    }

    public void setLoggedDate(LocalDate loggedDate) {
        this.loggedDate = loggedDate;
    }
}
