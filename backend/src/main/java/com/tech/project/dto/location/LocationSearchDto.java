package com.tech.project.dto.location;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LocationSearchDto {

  private String locationName;
  private String locationCode;
  private String country;
  private String city;
  private String locationType;

}
