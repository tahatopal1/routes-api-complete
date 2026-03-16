package com.tech.project.service.impl;

import com.tech.project.dto.location.LocationDto;
import com.tech.project.dto.location.LocationSearchDto;
import com.tech.project.entity.Location;
import com.tech.project.repository.search.LocationSearchRepository;
import com.tech.project.service.LocationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;


import com.tech.project.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

  private final LocationRepository locationRepository;
  private final LocationSearchRepository locationSearchRepository;
  private final ModelMapper modelMapper;

  public Page<LocationDto> getAllLocations(LocationSearchDto locationSearchDto, Pageable pageable) {
    List<LocationDto> locations = locationSearchRepository.search(locationSearchDto, pageable)
        .stream()
        .map(location -> modelMapper.map(location, LocationDto.class))
        .toList();
    long count = locationSearchRepository.count(locationSearchDto);
    return new PageImpl<>(locations, pageable, count);
  }

  public LocationDto getLocationById(Integer locationId) {
    return locationRepository.findById(locationId)
        .map(location -> modelMapper.map(location, LocationDto.class)
        ).orElseThrow(
            () -> new EntityNotFoundException("Location not found with ID: " + locationId));
  }

  @Transactional
  public LocationDto createLocation(LocationDto locationDto) {
    Location location = modelMapper.map(locationDto, Location.class);
    location = locationRepository.save(location);
    return modelMapper.map(location, LocationDto.class);
  }

  @Transactional
  public LocationDto updateLocation(Integer locationId, LocationDto locationDto) {
    Location location = locationRepository.findById(locationId)
        .orElseThrow(
            () -> new EntityNotFoundException("Location not found with ID: " + locationId));
    modelMapper.map(locationDto, location);
    return modelMapper.map(location, LocationDto.class);
  }

  @Transactional
  public void deleteLocation(Integer locationId) {
    locationRepository.deleteById(locationId);
  }

}
