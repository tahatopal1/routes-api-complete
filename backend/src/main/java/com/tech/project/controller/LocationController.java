package com.tech.project.controller;

import com.tech.project.dto.location.LocationDto;
import com.tech.project.dto.location.LocationSearchDto;
import com.tech.project.service.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/locations")
public class LocationController {

  private final LocationService locationService;

  @GetMapping
  public ResponseEntity<Page<LocationDto>> getAllLocations(LocationSearchDto locationSearchDto,
      Pageable pageable) {
    Page<LocationDto> locations = locationService.getAllLocations(locationSearchDto, pageable);
    return ResponseEntity.ok(locations);
  }

  @GetMapping("/{id}")
  public ResponseEntity<LocationDto> getLocationById(@PathVariable Integer id) {
    LocationDto locationDto = locationService.getLocationById(id);
    return ResponseEntity.ok(locationDto);
  }

  @PostMapping
  public ResponseEntity<LocationDto> createLocation(@Valid @RequestBody LocationDto locationDto) {
    LocationDto savedLocation = locationService.createLocation(locationDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedLocation);
  }

  @PutMapping("/{id}")
  public ResponseEntity<LocationDto> updateLocation(@PathVariable Integer id,
      @Valid @RequestBody LocationDto locationDto) {
    LocationDto updatedLocation = locationService.updateLocation(id, locationDto);
    return ResponseEntity.ok(updatedLocation);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<LocationDto> deleteLocation(@PathVariable Integer id) {
    locationService.deleteLocation(id);
    return ResponseEntity.noContent().build();
  }


}
