package com.tech.project.controller;

import com.tech.project.dto.route.RouteRequestDto;
import com.tech.project.dto.route.RouteResponseDto;
import com.tech.project.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("/routes")
public class RouteController {

  private final RouteService routeService;
  private final CacheManager cacheManager;

  @PostMapping
  public List<RouteResponseDto> calculateRoutes(
      @Valid @RequestBody RouteRequestDto routeRequestDto) {
    return routeService.calculateRoutes(routeRequestDto);
  }

  @GetMapping("/inv")
  @PreAuthorize("hasRole('ADMIN')")
  public void getRoutes() {
    Objects.requireNonNull(cacheManager.getCache("routes")).clear();
  }

}
