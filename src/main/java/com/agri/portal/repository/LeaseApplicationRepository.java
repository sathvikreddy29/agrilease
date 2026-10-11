package com.agri.portal.repository;

import com.agri.portal.entity.ApplicationStatus;
import com.agri.portal.entity.LeaseApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaseApplicationRepository extends JpaRepository<LeaseApplication, Long> {

    List<LeaseApplication> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);

    List<LeaseApplication> findByLandListingOwnerIdOrderByCreatedAtDesc(Long ownerId);

    List<LeaseApplication> findByLandListingId(Long landListingId);

    boolean existsByFarmerIdAndLandListingIdAndStatus(Long farmerId, Long landListingId, ApplicationStatus status);

    long countByStatus(ApplicationStatus status);
}

