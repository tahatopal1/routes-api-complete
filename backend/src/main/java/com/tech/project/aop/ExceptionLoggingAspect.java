package com.tech.project.aop;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class ExceptionLoggingAspect {

    @After("execution(* com.tech.project.exception.GlobalExceptionHandler.*(..))")
    public void logAfterExceptionHandled(JoinPoint joinPoint) {


        Object[] args = joinPoint.getArgs();
        Exception ex = (Exception) args[0];
        HttpServletRequest request = (HttpServletRequest) args[1];

        log.info("An {} occurred on {} ({}). Details: {}", ex.getClass().getSimpleName(), request.getRequestURI(), request.getMethod(), ex.getMessage());
        ex.printStackTrace();

    }

}
