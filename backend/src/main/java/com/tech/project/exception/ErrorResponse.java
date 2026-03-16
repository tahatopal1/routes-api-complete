package com.tech.project.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class ErrorResponse {

  private LocalDateTime timestamp;
  private int status;
  private String message;
  private String path;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String error;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private Map<String, String> validationErrors;

}
