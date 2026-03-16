package com.tech.project.dto.route;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tech.project.dto.location.LocationReferenceDto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class RouteRequestDto {

  @NotNull(message = "Origin is required")
  private LocationReferenceDto origin;

  @NotNull(message = "Destination is required")
  private LocationReferenceDto destination;

  @JsonFormat(pattern = "yyyy-MM-dd")
  @NotNull(message = "Date is required")
  private LocalDate searchDate;

  public String getCacheKey() {
    return String.format("%s-%s-%s", origin.getId(), destination.getId(),
        searchDate.getDayOfWeek().getValue());
  }

}
