package com.tech.project.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.tech.project.dto.location.LocationDto;
import com.tech.project.dto.transportation.TransportationRequestDto;
import com.tech.project.dto.transportation.TransportationResponseDto;
import com.tech.project.dto.transportation.TransportationSearchDto;
import com.tech.project.entity.Location;
import com.tech.project.entity.Transportation;
import com.tech.project.repository.LocationRepository;
import com.tech.project.repository.TransportationRepository;
import com.tech.project.repository.search.TransportationSearchRepository;
import com.tech.project.service.impl.TransportationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.never;


@ExtendWith(MockitoExtension.class)
public class TransportationServiceTest {

    @Mock
    private TransportationRepository transportationRepository;

    @Mock
    private TransportationSearchRepository transportationSearchRepository;

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private TransportationServiceImpl transportationService;

    private Transportation transportation;
//    private TransportationRequestDto transportationRequestDto;
    private TransportationResponseDto transportationResponseDto;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        transportation = mock(Transportation.class);
//        transportationRequestDto = mock(TransportationRequestDto.class);
        transportationResponseDto = mock(TransportationResponseDto.class);

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }


    @Test
    void getAllTransportation() {

        PageRequest pageRequest = PageRequest.of(0, 5);
        TransportationSearchDto searchDto = mock(TransportationSearchDto.class);

        Transportation entityMock1 = mock(Transportation.class);
        Transportation entityMock2 = mock(Transportation.class);

        TransportationResponseDto dtoMock1 = mock(TransportationResponseDto.class);
        TransportationResponseDto dtoMock2 = mock(TransportationResponseDto.class);

        when(modelMapper.map(entityMock1, TransportationResponseDto.class)).thenReturn(dtoMock1);
        when(modelMapper.map(entityMock2, TransportationResponseDto.class)).thenReturn(dtoMock2);

        when(transportationSearchRepository.search(searchDto, pageRequest))
                .thenReturn(List.of(entityMock1, entityMock2));
        when(transportationSearchRepository.count(searchDto))
                .thenReturn(2L);

        Page<TransportationResponseDto> transportationsRes =
                transportationService.getAllTransportations(searchDto, pageRequest);

        assertThat(transportationsRes.getTotalElements()).isEqualTo(2);

        List<TransportationResponseDto> transportations = transportationsRes.getContent();
        assertThat(transportations.getFirst()).isEqualTo(dtoMock1);
        assertThat(transportations.getLast()).isEqualTo(dtoMock2);

    }

    @Test
    void getTransportationByIdTest() {
        when(transportationRepository.findTransportationById(anyInt()))
                .thenReturn(Optional.of(transportation));
        when(modelMapper.map(transportation, TransportationResponseDto.class))
                .thenReturn(transportationResponseDto);

        TransportationResponseDto found = transportationService.getTransportationById(1);
        assertThat(found).isEqualTo(transportationResponseDto);
    }

    @Test
    void getTransportationByIdTest_entityNotFound() {

        when(transportationRepository.findTransportationById(anyInt()))
                .thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> transportationService.getTransportationById(1));

        verify(modelMapper, never()).map(transportation, LocationDto.class);

    }

    @Test
    void createTransportationTest() throws IOException {

        InputStream inputStream = getClass().getResourceAsStream("/static/transportation-request.json");
        TransportationRequestDto transportationRequestDto
                = objectMapper.readValue(inputStream, TransportationRequestDto.class);

        Location origin = mock(Location.class);
        Location dest = mock(Location.class);

        when(modelMapper.map(transportationRequestDto, Transportation.class))
                .thenReturn(transportation);
        when(locationRepository.getReferenceById(transportationRequestDto.getOrigin().getId()))
                .thenReturn(origin);
        when(locationRepository.getReferenceById(transportationRequestDto.getDestination().getId()))
                .thenReturn(dest);
        when(transportationRepository.save(any(Transportation.class)))
                .thenReturn(transportation);
        when(modelMapper.map(transportation, TransportationResponseDto.class))
                .thenReturn(transportationResponseDto);

        TransportationResponseDto created =
                transportationService.createTransportation(transportationRequestDto);

        assertThat(created).isEqualTo(transportationResponseDto);


    }

    @Test
    void updateTransportationTest() throws IOException {

        InputStream inputStream = getClass().getResourceAsStream("/static/transportation-request.json");
        TransportationRequestDto transportationRequestDto
                = objectMapper.readValue(inputStream, TransportationRequestDto.class);

        Location origin = mock(Location.class);
        Location dest = mock(Location.class);


        when(transportationRepository.findTransportationById(anyInt()))
                .thenReturn(Optional.of(transportation));
        doNothing().when(modelMapper)
                .map(transportationRequestDto, transportation);
        when(locationRepository.getReferenceById(transportationRequestDto.getOrigin().getId()))
                .thenReturn(origin);
        when(locationRepository.getReferenceById(transportationRequestDto.getDestination().getId()))
                .thenReturn(dest);
        when(modelMapper.map(transportation, TransportationResponseDto.class))
                .thenReturn(transportationResponseDto);

        TransportationResponseDto updated =
                transportationService.updateTransportation(1, transportationRequestDto);

        assertThat(updated).isEqualTo(transportationResponseDto);

    }

    @Test
    void updateTransportationTest_entityNotFound() {
        TransportationRequestDto request = mock(TransportationRequestDto.class);

        when(transportationRepository.findTransportationById(anyInt()))
                .thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> transportationService.updateTransportation(1, request));

        verify(modelMapper, never()).map(any(), any());

    }

    @Test
    void deleteLocationTest() {
        doNothing().when(transportationRepository).deleteById(anyInt());
        transportationService.deleteTransportation(1);
        verify(transportationRepository, times(1)).deleteById(anyInt());
    }


}
