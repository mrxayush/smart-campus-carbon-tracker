package com.campus.carbontracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "energy_records")
public class EnergyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String departmentName;

    @Column(nullable = false)
    private Double electricityKWh;

    @Column(nullable = false)
    private Double waterUsageLitres;

    // Automatically calculated and stored in kg CO2 equivalent (kg CO2e)
    @Column(nullable = false)
    private Double carbonEmissions;

    @Column(nullable = false)
    private LocalDate loggedDate;

    // Stores username of Admin who recorded the energy metrics
    @Column(nullable = false, length = 60)
    private String loggedBy;

    public EnergyRecord() {
    }

    public EnergyRecord(String departmentName, Double electricityKWh, Double waterUsageLitres,
                        Double carbonEmissions, LocalDate loggedDate, String loggedBy) {
        this.departmentName = departmentName;
        this.electricityKWh = electricityKWh;
        this.waterUsageLitres = waterUsageLitres;
        this.carbonEmissions = carbonEmissions;
        this.loggedDate = loggedDate;
        this.loggedBy = loggedBy;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Double getCarbonEmissions() {
        return carbonEmissions;
    }

    public void setCarbonEmissions(Double carbonEmissions) {
        this.carbonEmissions = carbonEmissions;
    }

    public LocalDate getLoggedDate() {
        return loggedDate;
    }

    public void setLoggedDate(LocalDate loggedDate) {
        this.loggedDate = loggedDate;
    }

    public String getLoggedBy() {
        return loggedBy;
    }

    public void setLoggedBy(String loggedBy) {
        this.loggedBy = loggedBy;
    }
}
