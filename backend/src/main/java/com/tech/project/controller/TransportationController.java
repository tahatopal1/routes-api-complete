package com.tech.project.controller;

import com.tech.project.dto.transportation.TransportationRequestDto;
import com.tech.project.dto.transportation.TransportationResponseDto;
import com.tech.project.dto.transportation.TransportationSearchDto;
import com.tech.project.service.TransportationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/transportations")
public class TransportationController {

  private final TransportationService transportationService;

  @GetMapping
  public ResponseEntity<Page<TransportationResponseDto>> getAllTransportation(
      TransportationSearchDto transportationSearchDto, Pageable pageable) {
    Page<TransportationResponseDto> transportations = transportationService.getAllTransportations(
        transportationSearchDto, pageable);
    return ResponseEntity.ok(transportations);
  }

  @GetMapping("/{id}")
  public ResponseEntity<TransportationResponseDto> getTransportationById(@PathVariable Integer id) {
    TransportationResponseDto transportationDto = transportationService.getTransportationById(id);
    return ResponseEntity.ok(transportationDto);
  }

  @PostMapping
  public ResponseEntity<TransportationResponseDto> createTransportation(
      @Valid @RequestBody TransportationRequestDto transportationDto) {
    TransportationResponseDto savedTransportation = transportationService.createTransportation(
        transportationDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedTransportation);
  }

  @PutMapping("/{id}")
  public ResponseEntity<TransportationResponseDto> updateTransportation(@PathVariable Integer id,
      @Valid @RequestBody TransportationRequestDto transportationDto) {
    TransportationResponseDto updatedTransportation = transportationService.updateTransportation(id,
        transportationDto);
    return ResponseEntity.ok(updatedTransportation);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<HttpStatus> deleteTransportation(@PathVariable Integer id) {
    transportationService.deleteTransportation(id);
    return ResponseEntity.noContent().build();
  }

}
