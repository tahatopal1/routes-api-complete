package com.tech.project.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.tech.project.dto.route.RouteRequestDto;
import com.tech.project.dto.route.RouteResponseDto;
import com.tech.project.service.impl.RouteServiceImpl;
import com.tech.project.service.strategy.RouteCalculationFactory;
import com.tech.project.service.strategy.RouteCalculationStrategy;
import com.tech.project.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import static com.tech.project.dto.route.RouteCalculationType.AIRPORT_TO_VENUE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class RouteServiceTest {

    @Mock
    private RouteCalculationFactory routeCalculationFactory;

    @InjectMocks
    private RouteServiceImpl routeService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() throws IOException {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void testCalculateRoutes() throws IOException {

        RouteCalculationStrategy strategy = mock(RouteCalculationStrategy.class);
        RouteResponseDto response = mock(RouteResponseDto.class);

        InputStream inputStream = getClass().getResourceAsStream("/static/route-request.json");
        RouteRequestDto routeRequestDto = objectMapper.readValue(inputStream, RouteRequestDto.class);

        int day = routeRequestDto.getSearchDate().getDayOfWeek().getValue();

        when(routeCalculationFactory.getStrategy(AIRPORT_TO_VENUE))
                .thenReturn(strategy);
        when(strategy.calculate(routeRequestDto.getOrigin().getId(),
                routeRequestDto.getDestination().getId(), day)).thenReturn(List.of(response));

        List<RouteResponseDto> routes = routeService.calculateRoutes(routeRequestDto);

        assertThat(routes).hasSize(1);
        assertThat(routes.getFirst()).isEqualTo(response);

    }

}
