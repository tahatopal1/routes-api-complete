package com.tech.project.dto.transportation;

import com.tech.project.dto.location.LocationDto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
public class TransportationReferenceDto implements Serializable {

  private Integer id;
  private LocationDto origin;
  private LocationDto destination;
  private TransportationType transportationType;

}
