package com.tech.project.service.strategy;

import com.tech.project.dto.route.RouteCalculationType;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
public class RouteCalculationFactory {

  Map<RouteCalculationType, RouteCalculationStrategy> strategyMap = new HashMap<>();

  public RouteCalculationFactory(Set<RouteCalculationStrategy> routeCalculationStrategies) {
    registerStrategies(routeCalculationStrategies);
  }

  private void registerStrategies(Set<RouteCalculationStrategy> routeCalculationStrategies) {
    routeCalculationStrategies.forEach(routeCalculationStrategy
        -> strategyMap.put(
        routeCalculationStrategy.getCalculationType(), routeCalculationStrategy));
  }

  public RouteCalculationStrategy getStrategy(RouteCalculationType routeCalculationType) {
    return strategyMap.get(routeCalculationType);
  }

}
