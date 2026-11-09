package com.campus.carbontracker.config;

import com.campus.carbontracker.model.EnergyRecord;
import com.campus.carbontracker.model.Role;
import com.campus.carbontracker.model.User;
import com.campus.carbontracker.repository.EnergyRecordRepository;
import com.campus.carbontracker.repository.UserRepository;
import com.campus.carbontracker.service.EnergyRecordService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(
            UserRepository userRepository,
            EnergyRecordRepository recordRepository,
            PasswordEncoder passwordEncoder,
            EnergyRecordService recordService) {

        return args -> {
            // Seed Admin User
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User(
                        "admin",
                        passwordEncoder.encode("admin123"),
                        Role.ROLE_ADMIN
                );
                userRepository.save(admin);
            }

            // Seed Student / Standard User
            if (!userRepository.existsByUsername("student")) {
                User student = new User(
                        "student",
                        passwordEncoder.encode("student123"),
                        Role.ROLE_STUDENT
                );
                userRepository.save(student);
            }

            // Seed Sample Campus Energy Records if empty
            if (recordRepository.count() == 0) {
                Object[][] sampleData = {
                        {"Computer Science Lab A", 1450.0, 3200.0, LocalDate.now().minusDays(1), "admin"},
                        {"Mechanical Engg Workshop", 2800.0, 5400.0, LocalDate.now().minusDays(2), "admin"},
                        {"Biotech Research Lab", 1950.0, 8900.0, LocalDate.now().minusDays(3), "admin"},
                        {"Central Campus Library", 820.0, 1500.0, LocalDate.now().minusDays(4), "admin"},
                        {"Student Hostel Block 4", 3400.0, 18500.0, LocalDate.now().minusDays(5), "admin"},
                        {"Campus Dining Hall", 2100.0, 12400.0, LocalDate.now().minusDays(6), "admin"},
                        {"Electrical Engg Wing", 1680.0, 2900.0, LocalDate.now().minusDays(7), "admin"}
                };

                for (Object[] row : sampleData) {
                    String dept = (String) row[0];
                    Double kwh = (Double) row[1];
                    Double water = (Double) row[2];
                    LocalDate date = (LocalDate) row[3];
                    String user = (String) row[4];

                    double emissions = recordService.calculateCarbonEmissions(kwh, water);
                    EnergyRecord record = new EnergyRecord(dept, kwh, water, emissions, date, user);
                    recordRepository.save(record);
                }
            }
        };
    }
}
