package com.campus.carbontracker.service;

import com.campus.carbontracker.dto.CampusStatsResponse;
import com.campus.carbontracker.dto.EnergyRecordRequest;
import com.campus.carbontracker.model.EnergyRecord;
import com.campus.carbontracker.repository.EnergyRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class EnergyRecordService {

    /**
     * Standard Campus Sustainability Emission Factors:
     * - Electricity Grid Emission Factor: 0.82 kg CO2e per kWh (Standard regional thermal/renewable mix)
     * - Municipal Water Emission Factor: 0.0003 kg CO2e per Litre (Energy consumed in pumping, filtration, and distribution)
     */
    public static final double ELECTRICITY_EMISSION_FACTOR = 0.82;
    public static final double WATER_EMISSION_FACTOR = 0.0003;

    private final EnergyRecordRepository repository;

    public EnergyRecordService(EnergyRecordRepository repository) {
        this.repository = repository;
    }

    /**
     * Calculates carbon footprint in kg CO2e:
     * Formula: (Electricity_kWh * 0.82) + (Water_Litres * 0.0003)
     */
    public double calculateCarbonEmissions(Double electricityKWh, Double waterUsageLitres) {
        double electricityPart = (electricityKWh != null ? electricityKWh : 0.0) * ELECTRICITY_EMISSION_FACTOR;
        double waterPart = (waterUsageLitres != null ? waterUsageLitres : 0.0) * WATER_EMISSION_FACTOR;
        double total = electricityPart + waterPart;

        return BigDecimal.valueOf(total)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    public EnergyRecord createRecord(EnergyRecordRequest request, String loggedByUsername) {
        double emissions = calculateCarbonEmissions(request.getElectricityKWh(), request.getWaterUsageLitres());
        LocalDate recordDate = request.getLoggedDate() != null ? request.getLoggedDate() : LocalDate.now();

        EnergyRecord record = new EnergyRecord(
                request.getDepartmentName().trim(),
                request.getElectricityKWh(),
                request.getWaterUsageLitres(),
                emissions,
                recordDate,
                loggedByUsername
        );

        return repository.save(record);
    }

    @Transactional(readOnly = true)
    public List<EnergyRecord> getAllRecords() {
        return repository.findAllByOrderByLoggedDateDesc();
    }

    @Transactional(readOnly = true)
    public List<EnergyRecord> getRecordsByDepartment(String department) {
        return repository.findByDepartmentNameIgnoreCaseOrderByLoggedDateDesc(department);
    }

    @Transactional(readOnly = true)
    public EnergyRecord getRecordById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Energy record not found with ID: " + id));
    }

    public EnergyRecord updateRecord(Long id, EnergyRecordRequest request) {
        EnergyRecord record = getRecordById(id);

        record.setDepartmentName(request.getDepartmentName().trim());
        record.setElectricityKWh(request.getElectricityKWh());
        record.setWaterUsageLitres(request.getWaterUsageLitres());
        record.setCarbonEmissions(calculateCarbonEmissions(request.getElectricityKWh(), request.getWaterUsageLitres()));

        if (request.getLoggedDate() != null) {
            record.setLoggedDate(request.getLoggedDate());
        }

        return repository.save(record);
    }

    public void deleteRecord(Long id) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Energy record not found with ID: " + id);
        }
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public CampusStatsResponse getCampusStats() {
        List<EnergyRecord> records = repository.findAll();

        long totalRecords = records.size();
        double totalElectricity = records.stream().mapToDouble(EnergyRecord::getElectricityKWh).sum();
        double totalWater = records.stream().mapToDouble(EnergyRecord::getWaterUsageLitres).sum();
        double totalCarbon = records.stream().mapToDouble(EnergyRecord::getCarbonEmissions).sum();

        double avgCarbon = totalRecords > 0 ? (totalCarbon / totalRecords) : 0.0;

        // Department breakdown
        Map<String, Double> departmentEmissions = records.stream()
                .collect(Collectors.groupingBy(
                        EnergyRecord::getDepartmentName,
                        Collectors.summingDouble(EnergyRecord::getCarbonEmissions)
                ));

        // Format to 2 decimal places
        Map<String, Double> formattedDeptEmissions = new HashMap<>();
        departmentEmissions.forEach((dept, val) -> {
            formattedDeptEmissions.put(dept, BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue());
        });

        // Top emitting department
        String topDept = departmentEmissions.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");

        return new CampusStatsResponse(
                totalRecords,
                BigDecimal.valueOf(totalElectricity).setScale(2, RoundingMode.HALF_UP).doubleValue(),
                BigDecimal.valueOf(totalWater).setScale(2, RoundingMode.HALF_UP).doubleValue(),
                BigDecimal.valueOf(totalCarbon).setScale(2, RoundingMode.HALF_UP).doubleValue(),
                BigDecimal.valueOf(avgCarbon).setScale(2, RoundingMode.HALF_UP).doubleValue(),
                topDept,
                formattedDeptEmissions
        );
    }
}
