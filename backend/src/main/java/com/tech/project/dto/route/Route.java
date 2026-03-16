package com.tech.project.dto.route;

import com.tech.project.entity.Transportation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {

  private Transportation preFlight;
  private Transportation flight;
  private Transportation postFlight;

  public List<Transportation> getItinerary() {
    return Arrays.asList(preFlight, flight, postFlight);
  }

}
