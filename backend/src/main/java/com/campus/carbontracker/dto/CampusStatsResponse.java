package com.campus.carbontracker.dto;

import java.util.Map;

public class CampusStatsResponse {
    private long totalRecords;
    private double totalElectricityKWh;
    private double totalWaterUsageLitres;
    private double totalCarbonEmissionsKg;
    private double averageCarbonPerRecord;
    private String topEmittingDepartment;
    private Map<String, Double> emissionsByDepartment;

    public CampusStatsResponse() {
    }

    public CampusStatsResponse(long totalRecords, double totalElectricityKWh, double totalWaterUsageLitres,
                               double totalCarbonEmissionsKg, double averageCarbonPerRecord,
                               String topEmittingDepartment, Map<String, Double> emissionsByDepartment) {
        this.totalRecords = totalRecords;
        this.totalElectricityKWh = totalElectricityKWh;
        this.totalWaterUsageLitres = totalWaterUsageLitres;
        this.totalCarbonEmissionsKg = totalCarbonEmissionsKg;
        this.averageCarbonPerRecord = averageCarbonPerRecord;
        this.topEmittingDepartment = topEmittingDepartment;
        this.emissionsByDepartment = emissionsByDepartment;
    }

    public long getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(long totalRecords) {
        this.totalRecords = totalRecords;
    }

    public double getTotalElectricityKWh() {
        return totalElectricityKWh;
    }

    public void setTotalElectricityKWh(double totalElectricityKWh) {
        this.totalElectricityKWh = totalElectricityKWh;
    }

    public double getTotalWaterUsageLitres() {
        return totalWaterUsageLitres;
    }

    public void setTotalWaterUsageLitres(double totalWaterUsageLitres) {
        this.totalWaterUsageLitres = totalWaterUsageLitres;
    }

    public double getTotalCarbonEmissionsKg() {
        return totalCarbonEmissionsKg;
    }

    public void setTotalCarbonEmissionsKg(double totalCarbonEmissionsKg) {
        this.totalCarbonEmissionsKg = totalCarbonEmissionsKg;
    }

    public double getAverageCarbonPerRecord() {
        return averageCarbonPerRecord;
    }

    public void setAverageCarbonPerRecord(double averageCarbonPerRecord) {
        this.averageCarbonPerRecord = averageCarbonPerRecord;
    }

    public String getTopEmittingDepartment() {
        return topEmittingDepartment;
    }

    public void setTopEmittingDepartment(String topEmittingDepartment) {
        this.topEmittingDepartment = topEmittingDepartment;
    }

    public Map<String, Double> getEmissionsByDepartment() {
        return emissionsByDepartment;
    }

    public void setEmissionsByDepartment(Map<String, Double> emissionsByDepartment) {
        this.emissionsByDepartment = emissionsByDepartment;
    }
}
