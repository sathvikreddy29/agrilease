package com.agri.portal.repository;

import com.agri.portal.entity.ReportStatus;
import com.agri.portal.entity.ReportedListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportedListingRepository extends JpaRepository<ReportedListing, Long> {

    List<ReportedListing> findByStatusOrderByCreatedAtDesc(ReportStatus status);

    List<ReportedListing> findAllByOrderByCreatedAtDesc();

    long countByStatus(ReportStatus status);
}

