package com.tech.project.service.impl;

import com.tech.project.dto.transportation.TransportationRequestDto;
import com.tech.project.dto.transportation.TransportationResponseDto;
import com.tech.project.dto.transportation.TransportationSearchDto;
import com.tech.project.entity.Location;
import com.tech.project.entity.Transportation;
import com.tech.project.repository.LocationRepository;
import com.tech.project.repository.TransportationRepository;
import com.tech.project.repository.search.TransportationSearchRepository;
import com.tech.project.service.TransportationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransportationServiceImpl implements TransportationService {

  private final TransportationRepository transportationRepository;
  private final TransportationSearchRepository transportationSearchRepository;
  private final LocationRepository locationRepository;
  private final ModelMapper modelMapper;

  public Page<TransportationResponseDto> getAllTransportations(
      TransportationSearchDto transportationSearchDto, Pageable pageable) {
    List<TransportationResponseDto> transportations = transportationSearchRepository.search(
            transportationSearchDto, pageable)
        .stream()
        .map(transportation -> modelMapper.map(transportation, TransportationResponseDto.class))
        .toList();
    long count = transportationSearchRepository.count(transportationSearchDto);
    return new PageImpl<>(transportations, pageable, count);
  }

  public TransportationResponseDto getTransportationById(Integer transportationId) {
    return transportationRepository.findTransportationById(transportationId)
        .map(transportation -> modelMapper.map(transportation, TransportationResponseDto.class)
        ).orElseThrow(() -> new EntityNotFoundException(
            "Transportation not found with ID: " + transportationId));
  }

  @Transactional
  public TransportationResponseDto createTransportation(
      TransportationRequestDto transportationDto) {
    Transportation transportation = modelMapper.map(transportationDto, Transportation.class);

    mergeOriginAndDestination(transportationDto, transportation);

    transportation = transportationRepository.save(transportation);
    return modelMapper.map(transportation, TransportationResponseDto.class);
  }

  @Transactional
  public TransportationResponseDto updateTransportation(Integer transportationId,
      TransportationRequestDto transportationDto) {
    Transportation transportation = transportationRepository.findTransportationById(
            transportationId)
        .orElseThrow(() -> new EntityNotFoundException(
            "Transportation not found with ID: " + transportationId));
    modelMapper.map(transportationDto, transportation);

    mergeOriginAndDestination(transportationDto, transportation);

    transportation.getOpDays().clear();
    transportation.getOpDays().addAll(transportationDto.getOpDays());

    return modelMapper.map(transportation, TransportationResponseDto.class);
  }

  @Transactional
  public void deleteTransportation(Integer TransportationId) {
    transportationRepository.deleteById(TransportationId);
  }

  private void mergeOriginAndDestination(TransportationRequestDto transportationDto,
      Transportation transportation) {
    Location origin = locationRepository.getReferenceById(transportationDto.getOrigin().getId());
    Location destination = locationRepository.getReferenceById(
        transportationDto.getDestination().getId());

    transportation.setOrigin(origin);
    transportation.setDestination(destination);
  }

}
