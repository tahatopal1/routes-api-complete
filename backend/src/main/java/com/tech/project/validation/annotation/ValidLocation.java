package com.tech.project.validation.annotation;

import com.tech.project.validation.LocationValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = LocationValidator.class)
public @interface ValidLocation {

  String message() default "Location has to be 3 characters for AIRPORT";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

}
