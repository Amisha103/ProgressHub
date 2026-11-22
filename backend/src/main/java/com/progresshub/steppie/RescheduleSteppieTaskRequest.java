
package com.progresshub.steppie;

import java.time.LocalDate;

public record RescheduleSteppieTaskRequest(
        LocalDate scheduledDate
) {}
