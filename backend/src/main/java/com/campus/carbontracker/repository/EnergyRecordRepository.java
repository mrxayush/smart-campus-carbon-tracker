package com.campus.carbontracker.repository;

import com.campus.carbontracker.model.EnergyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnergyRecordRepository extends JpaRepository<EnergyRecord, Long> {

    List<EnergyRecord> findAllByOrderByLoggedDateDesc();

    List<EnergyRecord> findByDepartmentNameIgnoreCaseOrderByLoggedDateDesc(String departmentName);

    @Query("SELECT COALESCE(SUM(e.electricityKWh), 0) FROM EnergyRecord e")
    Double sumElectricityKWh();

    @Query("SELECT COALESCE(SUM(e.waterUsageLitres), 0) FROM EnergyRecord e")
    Double sumWaterUsageLitres();

    @Query("SELECT COALESCE(SUM(e.carbonEmissions), 0) FROM EnergyRecord e")
    Double sumCarbonEmissions();
}
