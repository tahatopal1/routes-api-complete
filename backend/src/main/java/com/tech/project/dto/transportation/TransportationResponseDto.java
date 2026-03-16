package com.tech.project.dto.transportation;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TransportationResponseDto extends TransportationReferenceDto {

  private List<Integer> opDays = new ArrayList<>();

}
