package com.tech.project.service.impl;

import com.tech.project.dto.location.LocationReferenceDto;
import com.tech.project.dto.location.LocationType;
import com.tech.project.dto.route.RouteRequestDto;
import com.tech.project.dto.route.RouteResponseDto;
import com.tech.project.service.RouteService;
import com.tech.project.service.strategy.RouteCalculationFactory;
import com.tech.project.service.strategy.RouteCalculationStrategy;
import com.tech.project.dto.route.RouteCalculationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

  private final RouteCalculationFactory routeCalculationFactory;

  @Cacheable(
      value = "routes",
      key = "#routeRequestDto.cacheKey"
  )
  public List<RouteResponseDto> calculateRoutes(RouteRequestDto routeRequestDto) {

    LocationReferenceDto origin = routeRequestDto.getOrigin();
    LocationReferenceDto dest = routeRequestDto.getDestination();
    int day = routeRequestDto.getSearchDate().getDayOfWeek().getValue();

    RouteCalculationType routeCalculationType = resolveRouteCalculationType(
        origin.getLocationType(), dest.getLocationType());
    RouteCalculationStrategy calculationStrategy = routeCalculationFactory.getStrategy(
        routeCalculationType);
    return calculationStrategy.calculate(origin.getId(), dest.getId(), day);

  }

  private RouteCalculationType resolveRouteCalculationType(LocationType originLocationType,
      LocationType destLocationType) {

    if (originLocationType == LocationType.AIRPORT && destLocationType == LocationType.AIRPORT) {
      return RouteCalculationType.AIRPORT_TO_AIRPORT;
    } else if (originLocationType == LocationType.VENUE
        && destLocationType == LocationType.AIRPORT) {
      return RouteCalculationType.VENUE_TO_AIRPORT;
    } else if (originLocationType == LocationType.AIRPORT
        && destLocationType == LocationType.VENUE) {
      return RouteCalculationType.AIRPORT_TO_VENUE;
    } else {
      return RouteCalculationType.VENUE_TO_VENUE;
    }

  }


}
