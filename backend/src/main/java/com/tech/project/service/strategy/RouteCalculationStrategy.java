package com.tech.project.service.strategy;

import com.tech.project.dto.route.Route;
import com.tech.project.dto.route.RouteCalculationType;
import com.tech.project.dto.route.RouteResponseDto;
import com.tech.project.dto.transportation.TransportationReferenceDto;
import com.tech.project.repository.TransportationRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
public abstract class RouteCalculationStrategy {

  protected final TransportationRepository transportationRepository;
  protected final ModelMapper modelMapper;

  public List<RouteResponseDto> calculate(Integer origin, Integer dest, Integer day) {
    return this.getCalculationLogic().calculate(origin, dest, day)
        .stream()
        .map(this::mapRouteResponse)
        .toList();
  }

  private RouteResponseDto mapRouteResponse(Route route) {

    RouteResponseDto routeResponseDto = new RouteResponseDto();

    route.getItinerary().stream()
        .filter(Objects::nonNull)
        .map(transportation -> modelMapper.map(transportation, TransportationReferenceDto.class))
        .forEach(r -> routeResponseDto.getItinerary().add(r));

    return routeResponseDto;

  }

  public abstract RouteCalculationType getCalculationType();

  public abstract RouteCalculationLogic getCalculationLogic();

  @FunctionalInterface
  public interface RouteCalculationLogic {

    List<Route> calculate(Integer origin, Integer dest, Integer day);
  }

}
