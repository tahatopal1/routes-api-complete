package com.tech.project.service;

import com.tech.project.dto.location.LocationDto;
import com.tech.project.dto.location.LocationSearchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LocationService {

  Page<LocationDto> getAllLocations(LocationSearchDto locationSearchDto, Pageable pageable);

  LocationDto getLocationById(Integer locationId);

  LocationDto createLocation(LocationDto locationDto);

  LocationDto updateLocation(Integer locationId, LocationDto locationDto);

  void deleteLocation(Integer locationId);
}
