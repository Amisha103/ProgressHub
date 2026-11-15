
package com.progresshub.calendar;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.Optional;

public interface GoogleCalendarOAuthStateRepository
        extends JpaRepository<GoogleCalendarOAuthState, Long> {

    Optional<GoogleCalendarOAuthState> findByStateHashAndExpiresAtAfter(
            String stateHash,
            OffsetDateTime now
    );

    void deleteByStateHash(String stateHash);
}
