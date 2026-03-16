package com.tech.project.service.impl;

import com.tech.project.dto.login.AuthRequest;
import com.tech.project.entity.User;
import com.tech.project.service.LoginService;
import com.tech.project.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

  @Value("${jwt.secret}")
  private String secret;

  @Value("${jwt.expiration}")
  private long expiration;

  private final AuthenticationManager authenticationManager;

  public String login(AuthRequest request) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
    );

    User user = (User) authentication.getPrincipal();
    return JwtUtil.generateToken(user, secret, expiration);

  }

}
