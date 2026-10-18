
package com.progresshub.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.Optional;

public interface RefreshSessionRepository
        extends JpaRepository<RefreshSession, Long> {

    Optional<RefreshSession> findByTokenHashAndRevokedAtIsNullAndExpiresAtAfter(
            String tokenHash,
            OffsetDateTime now
    );
}
