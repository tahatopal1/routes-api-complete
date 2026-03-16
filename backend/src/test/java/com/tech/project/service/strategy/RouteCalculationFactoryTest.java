package com.tech.project.service.strategy;

import com.tech.project.dto.route.RouteCalculationType;
import com.tech.project.repository.TransportationRepository;
import com.tech.project.service.strategy.impl.AirportToAirportCalculationStrategy;
import com.tech.project.service.strategy.impl.AirportToVenueCalculationStrategy;
import com.tech.project.service.strategy.impl.VenueToAirportCalculationStrategy;
import com.tech.project.service.strategy.impl.VenueToVenueCalculationStrategy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;

@ExtendWith(SpringExtension.class)
@Import({
        AirportToAirportCalculationStrategy.class,
        AirportToVenueCalculationStrategy.class,
        VenueToAirportCalculationStrategy.class,
        VenueToVenueCalculationStrategy.class,
        RouteCalculationFactory.class,
})
public class RouteCalculationFactoryTest {

    @MockitoBean
    private TransportationRepository transportationRepository;

    @MockitoBean
    private ModelMapper modelMapper;

    @Autowired
    private RouteCalculationFactory routeCalculationFactory;

    @Test
    void getStrategyTest() {
        RouteCalculationStrategy airportToAirportCalculationStrategy = routeCalculationFactory.getStrategy(RouteCalculationType.AIRPORT_TO_AIRPORT);
        RouteCalculationStrategy airportToVenueCalculationStrategy = routeCalculationFactory.getStrategy(RouteCalculationType.AIRPORT_TO_VENUE);
        RouteCalculationStrategy venueToAirportCalculationStrategy = routeCalculationFactory.getStrategy(RouteCalculationType.VENUE_TO_AIRPORT);
        RouteCalculationStrategy venueToVenueCalculationStrategy = routeCalculationFactory.getStrategy(RouteCalculationType.VENUE_TO_VENUE);

        assertInstanceOf(AirportToAirportCalculationStrategy.class, airportToAirportCalculationStrategy);
        assertInstanceOf(AirportToVenueCalculationStrategy.class, airportToVenueCalculationStrategy);
        assertInstanceOf(VenueToAirportCalculationStrategy.class, venueToAirportCalculationStrategy);
        assertInstanceOf(VenueToVenueCalculationStrategy.class, venueToVenueCalculationStrategy);

    }



}
