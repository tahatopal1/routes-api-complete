package com.tech.project.service.strategy.impl;

import com.tech.project.dto.route.Route;
import com.tech.project.dto.route.RouteCalculationType;
import com.tech.project.dto.route.RouteResponseDto;
import com.tech.project.dto.transportation.TransportationReferenceDto;
import com.tech.project.repository.TransportationRepository;
import com.tech.project.service.strategy.RouteCalculationStrategy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static com.tech.project.util.TestUtil.generateRouteList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@Import({VenueToVenueCalculationStrategy.class})
public class VenueToVenueCalculationStrategyTest {

    @MockitoBean
    private TransportationRepository transportationRepository;

    @MockitoBean
    private ModelMapper modelMapper;

    @Autowired
    private RouteCalculationStrategy routeCalculationStrategy;

    private List<Route> routeList;

    @BeforeEach
    void setUp() {
        routeList = generateRouteList();
    }

    @Test
    void getCalculationTypeTest() {
        assertThat(routeCalculationStrategy.getCalculationType())
                .isEqualTo(RouteCalculationType.VENUE_TO_VENUE);
    }

    @Test
    void calculateTest() {

        when(transportationRepository.findRouteVenueToVenue(anyInt(), anyInt(), anyInt()))
                .thenReturn(routeList);

        List<RouteResponseDto> routes = routeCalculationStrategy.calculate(1, 2, 1);

        assertThat(routes).hasSize(1);
        verify(modelMapper, times(3)).map(routeList.getFirst().getFlight(), TransportationReferenceDto.class);

    }



}
