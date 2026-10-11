package com.agri.portal.repository;

import com.agri.portal.entity.LeaseAgreement;
import com.agri.portal.entity.LeaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaseAgreementRepository extends JpaRepository<LeaseAgreement, Long> {

    List<LeaseAgreement> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);

    List<LeaseAgreement> findByLandownerIdOrderByCreatedAtDesc(Long landownerId);

    List<LeaseAgreement> findByLandListingId(Long landListingId);

    Optional<LeaseAgreement> findByAgreementNumber(String agreementNumber);

    long countByStatus(LeaseStatus status);

    boolean existsByLandListingIdAndStatus(Long landListingId, LeaseStatus status);
}

