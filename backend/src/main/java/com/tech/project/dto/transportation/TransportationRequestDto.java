package com.tech.project.dto.transportation;

import com.tech.project.dto.location.LocationReferenceDto;
import com.tech.project.validation.annotation.ValidTransportation;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@ValidTransportation
public class TransportationRequestDto {

  private Integer id;

  @NotNull(message = "Origin is required")
  private LocationReferenceDto origin;

  @NotNull(message = "Destination is required")
  private LocationReferenceDto destination;

  @NotNull(message = "Transportation is required")
  private TransportationType transportationType;

  private List<Integer> opDays = new ArrayList<>();

}
