package com.tech.project.service.strategy.impl;

import com.tech.project.repository.TransportationRepository;
import com.tech.project.service.strategy.RouteCalculationStrategy;
import com.tech.project.dto.route.RouteCalculationType;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class VenueToAirportCalculationStrategy extends RouteCalculationStrategy {

  public VenueToAirportCalculationStrategy(TransportationRepository transportationRepository,
      ModelMapper modelMapper) {
    super(transportationRepository, modelMapper);
  }

  @Override
  public RouteCalculationType getCalculationType() {
    return RouteCalculationType.VENUE_TO_AIRPORT;
  }

  public RouteCalculationLogic getCalculationLogic() {
    return transportationRepository::findRouteVenueToAirport;
  }

}
