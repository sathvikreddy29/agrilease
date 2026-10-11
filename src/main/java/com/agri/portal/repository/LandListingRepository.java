package com.agri.portal.repository;

import com.agri.portal.entity.LandListing;
import com.agri.portal.entity.LandStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LandListingRepository extends JpaRepository<LandListing, Long> {

    List<LandListing> findByOwnerId(Long ownerId);

    List<LandListing> findByStatus(LandStatus status);

    long countByStatus(LandStatus status);

    @Query("SELECT l FROM LandListing l WHERE " +
           "(:status IS NULL OR l.status = :status) AND " +
           "(:state IS NULL OR :state = '' OR LOWER(l.state) LIKE LOWER(CONCAT('%', :state, '%'))) AND " +
           "(:district IS NULL OR :district = '' OR LOWER(l.district) LIKE LOWER(CONCAT('%', :district, '%'))) AND " +
           "(:village IS NULL OR :village = '' OR LOWER(l.village) LIKE LOWER(CONCAT('%', :village, '%'))) AND " +
           "(:soilType IS NULL OR :soilType = '' OR LOWER(l.soilType) LIKE LOWER(CONCAT('%', :soilType, '%'))) AND " +
           "(:waterAvailability IS NULL OR :waterAvailability = '' OR LOWER(l.waterAvailability) LIKE LOWER(CONCAT('%', :waterAvailability, '%'))) AND " +
           "(:minAcreage IS NULL OR l.availableAcreage >= :minAcreage) AND " +
           "(:maxAcreage IS NULL OR l.availableAcreage <= :maxAcreage) AND " +
           "(:maxBudget IS NULL OR l.rentPerAcrePerYear <= :maxBudget)")
    Page<LandListing> searchLands(
            @Param("status") LandStatus status,
            @Param("state") String state,
            @Param("district") String district,
            @Param("village") String village,
            @Param("soilType") String soilType,
            @Param("waterAvailability") String waterAvailability,
            @Param("minAcreage") Double minAcreage,
            @Param("maxAcreage") Double maxAcreage,
            @Param("maxBudget") Double maxBudget,
            Pageable pageable
    );
}

