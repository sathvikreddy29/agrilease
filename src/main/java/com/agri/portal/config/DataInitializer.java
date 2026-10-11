package com.agri.portal.config;

import com.agri.portal.entity.*;
import com.agri.portal.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LandListingRepository landListingRepository;

    @Autowired
    private LeaseApplicationRepository leaseApplicationRepository;

    @Autowired
    private LeaseAgreementRepository leaseAgreementRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            logger.info("Database is empty. Seeding initial demo users and land listings...");

            // 1. Seed Users
            User admin = new User(
                    null,
                    "System Administrator",
                    "admin@agrilease.com",
                    passwordEncoder.encode("Admin@123"),
                    "+91 9876543210",
                    Role.ROLE_ADMIN,
                    "Admin Secretariat, Agritech Tower",
                    "New Delhi",
                    "Central Delhi",
                    true
            );
            userRepository.save(admin);

            User landowner1 = new User(
                    null,
                    "Ramesh Patel",
                    "ramesh.patel@gmail.com",
                    passwordEncoder.encode("Ramesh@123"),
                    "+91 9825123456",
                    Role.ROLE_LANDOWNER,
                    "Farm House 12, Mogar Road",
                    "Gujarat",
                    "Anand",
                    true
            );
            landowner1 = userRepository.save(landowner1);

            User landowner2 = new User(
                    null,
                    "Suresh Reddy",
                    "suresh.reddy@gmail.com",
                    passwordEncoder.encode("Suresh@123"),
                    "+91 9440123456",
                    Role.ROLE_LANDOWNER,
                    "Opp. Rythu Bazaar, Tenali Road",
                    "Andhra Pradesh",
                    "Guntur",
                    true
            );
            landowner2 = userRepository.save(landowner2);

            User farmer1 = new User(
                    null,
                    "Kavitha Farmer",
                    "kavitha.farmer@gmail.com",
                    passwordEncoder.encode("Farmer@123"),
                    "+91 9848123456",
                    Role.ROLE_FARMER,
                    "Main Village Post, Chebrolu",
                    "Andhra Pradesh",
                    "Guntur",
                    true
            );
            farmer1 = userRepository.save(farmer1);

            User farmer2 = new User(
                    null,
                    "Vikram Singh",
                    "vikram.singh@gmail.com",
                    passwordEncoder.encode("Farmer@123"),
                    "+91 9712123456",
                    Role.ROLE_FARMER,
                    "Sector 4, Borsad Highway",
                    "Gujarat",
                    "Anand",
                    true
            );
            farmer2 = userRepository.save(farmer2);

            logger.info("Demo users created successfully.");

            // 2. Seed Land Listings
            LandListing land1 = new LandListing();
            land1.setTitle("15-Acre Fertile Black Soil Farmland with Borewell");
            land1.setDescription("Premium quality black cotton soil ideal for cotton, tobacco, groundnut, and wheat cultivation. Includes 2 high-yield borewells, drip irrigation lines installed, 3-phase electricity, and complete barbed-wire boundary fencing.");
            land1.setState("Gujarat");
            land1.setDistrict("Anand");
            land1.setVillage("Mogar");
            land1.setAddress("Survey No. 142/A, Mogar-Vasad Express Highway");
            land1.setTotalAcreage(15.0);
            land1.setAvailableAcreage(10.0);
            land1.setSoilType("Black Cotton Soil");
            land1.setWaterAvailability("2 Deep Borewells (24/7 water supply)");
            land1.setElectricityAvailability(true);
            land1.setAvailableFacilities("Solar fencing, Drip irrigation, Tractor access road, Storage shed");
            land1.setRentPerAcrePerYear(28000.0);
            land1.setTotalExpectedRent(420000.0);
            land1.setMinLeaseDurationMonths(12);
            land1.setMaxLeaseDurationMonths(36);
            land1.setStatus(LandStatus.PARTIALLY_LEASED);
            land1.setImageUrl("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80");
            land1.setContactPhone("+91 9825123456");
            land1.setContactEmail("ramesh.patel@gmail.com");
            land1.setOwner(landowner1);
            land1 = landListingRepository.save(land1);

            LandListing land2 = new LandListing();
            land2.setTitle("25-Acre Krishna Riverbank Alluvial Farmland");
            land2.setDescription("Extremely fertile river delta alluvial soil suitable for paddy, chilli, turmeric, and banana plantations. Water sourced directly from canal network. Good road connectivity for transport trailers.");
            land2.setState("Andhra Pradesh");
            land2.setDistrict("Guntur");
            land2.setVillage("Chebrolu");
            land2.setAddress("Karakatta Road, Near River Sluice");
            land2.setTotalAcreage(25.0);
            land2.setAvailableAcreage(25.0);
            land2.setSoilType("Alluvial Soil");
            land2.setWaterAvailability("Canal Irrigation & River Lift");
            land2.setElectricityAvailability(true);
            land2.setAvailableFacilities("Concrete canal channels, Warehouse for crop storage, Tractor turn-pad");
            land2.setRentPerAcrePerYear(35000.0);
            land2.setTotalExpectedRent(875000.0);
            land2.setMinLeaseDurationMonths(12);
            land2.setMaxLeaseDurationMonths(60);
            land2.setStatus(LandStatus.AVAILABLE);
            land2.setImageUrl("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80");
            land2.setContactPhone("+91 9440123456");
            land2.setContactEmail("suresh.reddy@gmail.com");
            land2.setOwner(landowner2);
            landListingRepository.save(land2);

            LandListing land3 = new LandListing();
            land3.setTitle("12-Acre Red Loamy Soil Land Ideal for Horticulture");
            land3.setDescription("Rich red loamy soil, slightly sloping terrain with optimal drainage. Best suited for vegetables, pulses, and pomegranate farming. Includes farm pond with 5 HP solar motor.");
            land3.setState("Maharashtra");
            land3.setDistrict("Nashik");
            land3.setVillage("Dindori");
            land3.setAddress("Gat No. 89, Dindori-Vani State Highway");
            land3.setTotalAcreage(12.0);
            land3.setAvailableAcreage(12.0);
            land3.setSoilType("Red Loamy Soil");
            land3.setWaterAvailability("Farm Pond & Seasonal Stream");
            land3.setElectricityAvailability(true);
            land3.setAvailableFacilities("Solar water pump, Polyhouse skeleton, Farmhouse room");
            land3.setRentPerAcrePerYear(22000.0);
            land3.setTotalExpectedRent(264000.0);
            land3.setMinLeaseDurationMonths(6);
            land3.setMaxLeaseDurationMonths(24);
            land3.setStatus(LandStatus.AVAILABLE);
            land3.setImageUrl("https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80");
            land3.setContactPhone("+91 9825123456");
            land3.setContactEmail("ramesh.patel@gmail.com");
            land3.setOwner(landowner1);
            landListingRepository.save(land3);

            logger.info("Sample land listings seeded successfully.");

            // 3. Seed Sample Lease Application & Agreement
            LeaseApplication app1 = new LeaseApplication();
            app1.setLandListing(land1);
            app1.setFarmer(farmer2);
            app1.setRequestedAcreage(5.0);
            app1.setProposedDurationMonths(12);
            app1.setIntendedCrop("Organic Groundnut & Wheat");
            app1.setProposedStartDate(LocalDate.now().plusDays(10));
            app1.setOfferedRentPerAcre(28000.0);
            app1.setTotalOfferedRent(140000.0);
            app1.setMessage("I have 8 years experience in groundnut cultivation and would like to lease 5 acres with drip irrigation.");
            app1.setStatus(ApplicationStatus.APPROVED);
            app1 = leaseApplicationRepository.save(app1);

            LeaseAgreement agreement1 = new LeaseAgreement();
            agreement1.setAgreementNumber("LEA-2026-0001");
            agreement1.setLandListing(land1);
            agreement1.setApplication(app1);
            agreement1.setLandowner(landowner1);
            agreement1.setFarmer(farmer2);
            agreement1.setLeasedAcreage(5.0);
            agreement1.setRentAmount(140000.0);
            agreement1.setStartDate(LocalDate.now().plusDays(10));
            agreement1.setEndDate(LocalDate.now().plusDays(10).plusMonths(12));
            agreement1.setDurationMonths(12);
            agreement1.setStatus(LeaseStatus.ACTIVE);
            agreement1.setTermsAndConditions("1. Lessee shall only cultivate agreed crops.\n2. Lessee shall maintain drip lines.\n3. Rent payable bi-annually.\nNote: This digital agreement records lease terms agreed between parties.");
            leaseAgreementRepository.save(agreement1);

            // 4. Seed Pending Application for Land 2
            LeaseApplication pendingApp = new LeaseApplication();
            pendingApp.setLandListing(land2);
            pendingApp.setFarmer(farmer1);
            pendingApp.setRequestedAcreage(10.0);
            pendingApp.setProposedDurationMonths(24);
            pendingApp.setIntendedCrop("Paddy & Turmeric");
            pendingApp.setProposedStartDate(LocalDate.now().plusDays(15));
            pendingApp.setOfferedRentPerAcre(34000.0);
            pendingApp.setTotalOfferedRent(340000.0);
            pendingApp.setMessage("Interested in 10 acres for organic paddy cultivation. Requesting site visit.");
            pendingApp.setStatus(ApplicationStatus.PENDING);
            leaseApplicationRepository.save(pendingApp);

            logger.info("Sample lease applications and active agreements seeded successfully.");
        }
    }
}

