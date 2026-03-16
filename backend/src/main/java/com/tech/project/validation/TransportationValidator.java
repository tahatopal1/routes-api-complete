package com.tech.project.validation;

import com.tech.project.dto.location.LocationType;
import com.tech.project.dto.transportation.TransportationRequestDto;
import com.tech.project.dto.transportation.TransportationType;
import com.tech.project.validation.annotation.ValidTransportation;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Objects;

public class TransportationValidator implements
    ConstraintValidator<ValidTransportation, TransportationRequestDto> {

  @Override
  public boolean isValid(TransportationRequestDto transportationRequestDto,
      ConstraintValidatorContext context) {

    if (Objects.isNull(transportationRequestDto.getTransportationType())
        || Objects.isNull(transportationRequestDto.getOrigin())
        || Objects.isNull(transportationRequestDto.getDestination())) {
      return true;
    }

    if (transportationRequestDto.getOrigin().getId()
        .equals(transportationRequestDto.getDestination().getId())) {
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate("Origin and destination cannot be the same!")
          .addPropertyNode("origin")
          .addConstraintViolation();

      return false;
    }

    if (transportationRequestDto.getTransportationType() == TransportationType.FLIGHT) {

      boolean isOriginAirport =
          transportationRequestDto.getOrigin().getLocationType() == LocationType.AIRPORT;
      boolean isDestAirport =
          transportationRequestDto.getDestination().getLocationType() == LocationType.AIRPORT;

      if (!isOriginAirport || !isDestAirport) {

        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate("Flights can only operate between AIRPORTS")
            .addPropertyNode("transportationType")
            .addConstraintViolation();

        return false;
      }

    } else {

      boolean isOriginVenue =
          transportationRequestDto.getOrigin().getLocationType() == LocationType.VENUE;
      boolean isDestVenue =
          transportationRequestDto.getDestination().getLocationType() == LocationType.VENUE;

      if (isOriginVenue && isDestVenue) {

        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(
                "Transportations cannot operate between VENUES")
            .addPropertyNode("transportationType")
            .addConstraintViolation();

        return false;
      }
    }

    return true;

  }

}
