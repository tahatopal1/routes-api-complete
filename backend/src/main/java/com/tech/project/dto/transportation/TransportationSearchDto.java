package com.tech.project.dto.transportation;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TransportationSearchDto {

  private String origin;
  private String destination;
  private TransportationType transportationType;
  private int day;

}
