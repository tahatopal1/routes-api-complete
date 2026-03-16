package com.tech.project.service;

import com.tech.project.dto.route.RouteRequestDto;
import com.tech.project.dto.route.RouteResponseDto;

import java.util.List;

public interface RouteService {

  List<RouteResponseDto> calculateRoutes(RouteRequestDto routeRequestDto);

}
