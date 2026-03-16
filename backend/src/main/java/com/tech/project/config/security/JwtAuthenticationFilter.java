package com.tech.project.config.security;

import com.tech.project.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  @Value("${jwt.secret}")
  private String secret;

  private final UserDetailsService userDetailsService;

  @Override
  protected void doFilterInternal(@NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
      throws ServletException, IOException {
    final String username;
    String jwt = null;

    try {
      Cookie jwtCookie = WebUtils.getCookie(request, "jwt");

      if (Objects.nonNull(jwtCookie)) {
        jwt = jwtCookie.getValue();
      }

      if (Strings.isNotBlank(jwt)) {
        username = JwtUtil.extractUsername(jwt, secret);
        List<String> roles = JwtUtil.extractRoles(jwt, secret);

        List<SimpleGrantedAuthority> roleList = roles.stream().map(SimpleGrantedAuthority::new)
            .toList();

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
            username, null, roleList);

        SecurityContextHolder.getContext().setAuthentication(authToken);
      }

    } catch (Exception e) {
      log.error("An error occurred during JWT authentication: {}", e.getMessage());
    }

    filterChain.doFilter(request, response);

  }
}
