package com.tech.project.service;

import com.tech.project.dto.transportation.TransportationRequestDto;
import com.tech.project.dto.transportation.TransportationResponseDto;
import com.tech.project.dto.transportation.TransportationSearchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransportationService {

  Page<TransportationResponseDto> getAllTransportations(
      TransportationSearchDto transportationSearchDto, Pageable pageable);

  TransportationResponseDto getTransportationById(Integer transportationId);

  TransportationResponseDto createTransportation(TransportationRequestDto transportationRequestDto);

  TransportationResponseDto updateTransportation(Integer transportationId,
      TransportationRequestDto transportationDto);

  void deleteTransportation(Integer transportationId);

}
