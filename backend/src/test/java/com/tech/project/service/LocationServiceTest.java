package com.tech.project.service;

import com.tech.project.dto.location.LocationDto;
import com.tech.project.dto.location.LocationSearchDto;
import com.tech.project.entity.Location;
import com.tech.project.repository.LocationRepository;
import com.tech.project.repository.search.LocationSearchRepository;
import com.tech.project.service.impl.LocationServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LocationServiceTest {

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private LocationSearchRepository locationSearchRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private LocationServiceImpl locationService;

    Location location;
    LocationDto locationDto;

    @BeforeEach
    void setUp() {
        location = mock(Location.class);
        locationDto = mock(LocationDto.class);
    }

    @Test
    void getAllLocationsTest() {

        PageRequest pageRequest = PageRequest.of(0, 5);
        LocationSearchDto searchDto = mock(LocationSearchDto.class);

        Location entityMock1 = mock(Location.class);
        Location entityMock2 = mock(Location.class);

        LocationDto dtoMock1 = mock(LocationDto.class);
        LocationDto dtoMock2 = mock(LocationDto.class);

        when(modelMapper.map(entityMock1, LocationDto.class)).thenReturn(dtoMock1);
        when(modelMapper.map(entityMock2, LocationDto.class)).thenReturn(dtoMock2);

        when(locationSearchRepository.search(searchDto, pageRequest))
                .thenReturn(List.of(entityMock1, entityMock2));
        when(locationSearchRepository.count(searchDto))
                .thenReturn(2L);

        Page<LocationDto> locationsRes =
                locationService.getAllLocations(searchDto, pageRequest);

        assertThat(locationsRes.getTotalElements()).isEqualTo(2);

        List<LocationDto> locations = locationsRes.getContent();
        assertThat(locations.getFirst()).isEqualTo(dtoMock1);
        assertThat(locations.getLast()).isEqualTo(dtoMock2);

    }

    @Test
    void getLocationByIdTest() {

        when(locationRepository.findById(anyInt()))
                .thenReturn(Optional.of(location));
        when(modelMapper.map(location, LocationDto.class))
                .thenReturn(locationDto);

        LocationDto found = locationService.getLocationById(1);
        assertThat(found).isEqualTo(locationDto);

    }

    @Test
    void getLocationByIdTest_entityNotFound() {

        when(locationRepository.findById(anyInt()))
                .thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> locationService.getLocationById(1));

        verify(modelMapper, never()).map(location, LocationDto.class);

    }

    @Test
    void createLocationTest() {

        when(modelMapper.map(locationDto, Location.class))
                .thenReturn(location);
        when(locationRepository.save(location))
                .thenReturn(location);
        when(modelMapper.map(location, LocationDto.class))
                .thenReturn(locationDto);

        LocationDto created = locationService.createLocation(locationDto);
        assertThat(created).isEqualTo(locationDto);

    }

    @Test
    void updateLocationTest() {

        when(locationRepository.findById(anyInt()))
                .thenReturn(Optional.of(location));
        when(modelMapper.map(location, LocationDto.class))
                .thenReturn(locationDto);
        doNothing().when(modelMapper).map(locationDto, location);

        LocationDto updated = locationService.updateLocation(1, locationDto);

        verify(modelMapper, times(1))
                .map(locationDto, location);

        assertThat(updated).isEqualTo(locationDto);

    }

    @Test
    void updateLocationTest_entityNotFound() {

        when(locationRepository.findById(anyInt()))
                .thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> locationService.getLocationById(1));

        verify(modelMapper, never()).map(any(), any());

    }

    @Test
    void deleteLocationTest() {
        doNothing().when(locationRepository).deleteById(anyInt());
        locationService.deleteLocation(1);
        verify(locationRepository, times(1)).deleteById(anyInt());
    }


}
