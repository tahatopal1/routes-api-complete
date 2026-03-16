package com.tech.project.dto.route;

import com.tech.project.dto.transportation.TransportationReferenceDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponseDto implements Serializable {

  List<TransportationReferenceDto> itinerary = new ArrayList<>();

}
