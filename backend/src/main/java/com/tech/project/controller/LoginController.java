package com.tech.project.controller;

import com.tech.project.dto.login.AuthRequest;
import com.tech.project.service.LoginService;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@SecurityRequirements()
public class LoginController {

  @Value("${jwt.expiration}")
  private long expiration;

  private final LoginService loginService;

  @PostMapping("/login")
  public ResponseEntity<Void> login(@Valid @RequestBody AuthRequest request) {

    String authToken = loginService.login(request);

    String cookie = ResponseCookie.from("jwt", authToken)
        .httpOnly(true)
        .secure(false)
        .path("/")
        .maxAge(expiration)
        .sameSite("Lax")
        .build()
        .toString();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie)
        .build();

  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout() {

    String cookie = ResponseCookie.from("jwt", "")
        .httpOnly(true)
        .secure(false)
        .path("/")
        .maxAge(0)
        .sameSite("Lax")
        .build()
        .toString();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie)
        .build();

  }
}
