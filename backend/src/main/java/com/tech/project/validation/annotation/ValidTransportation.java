package com.tech.project.validation.annotation;

import com.tech.project.validation.TransportationValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TransportationValidator.class)
public @interface ValidTransportation {

  String message() default "Invalid transportation";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

}
