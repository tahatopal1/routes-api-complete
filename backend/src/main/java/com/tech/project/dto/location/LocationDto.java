package com.tech.project.dto.location;

import com.tech.project.validation.annotation.ValidLocation;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@ValidLocation
public class LocationDto implements Serializable {

  private Integer id;

  @NotBlank(message = "Location name is required")
  @Pattern(regexp = "^[a-zA-Z ]+$", message = "Location name must contain only letters")
  @Size(min = 3, max = 100, message = "Location name cannot be more than 100 characters")
  private String locationName;

  @NotBlank(message = "Location code is required")
  @Pattern(regexp = "^[A-Z]+$", message = "Location code must contain only uppercase letters")
  @Size(min = 3, max = 10, message = "Location code cannot be more than 10 characters")
  private String locationCode;

  @NotBlank(message = "Country is required")
  @Pattern(regexp = "^[a-zA-Z ]+$", message = "Country must contain only letters")
  @Size(min = 3, max = 60, message = "Country cannot be more than 60 characters")
  private String country;

  @NotBlank(message = "City is required")
  @Pattern(regexp = "^[a-zA-Z ]+$", message = "City must contain only letters")
  @Size(min = 3, max = 100, message = "City cannot be more than 100 characters")
  private String city;

  @NotNull(message = "Location type is required")
  private LocationType locationType;

}
