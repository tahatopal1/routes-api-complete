package com.tech.project.validation;

import com.tech.project.dto.location.LocationDto;
import com.tech.project.validation.annotation.ValidLocation;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.apache.logging.log4j.util.Strings;

import java.util.Objects;

import static com.tech.project.dto.location.LocationType.AIRPORT;

public class LocationValidator implements ConstraintValidator<ValidLocation, LocationDto> {

  @Override
  public boolean isValid(LocationDto locationDto, ConstraintValidatorContext context) {

    if (Strings.isEmpty(locationDto.getLocationName())
        || Objects.isNull(locationDto.getLocationCode())
        || Objects.isNull(locationDto.getLocationType())
        || Objects.isNull(locationDto.getCountry())
        || Objects.isNull(locationDto.getCity())) {
      return true;
    }

    if (AIRPORT.equals(locationDto.getLocationType())
        && locationDto.getLocationCode().length() != 3) {

      context.disableDefaultConstraintViolation();

      context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
          .addPropertyNode("locationCode")
          .addConstraintViolation();

      return false;
    }

    return true;

  }

}
