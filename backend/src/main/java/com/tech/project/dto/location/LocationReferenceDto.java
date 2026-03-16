package com.tech.project.dto.location;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LocationReferenceDto {

  @NotNull(message = "Location ID is required")
  private Integer id;

  @NotBlank(message = "Location name is required")
  private LocationType locationType;

}
