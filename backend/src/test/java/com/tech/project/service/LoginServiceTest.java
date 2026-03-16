package com.tech.project.service;

import com.tech.project.dto.login.AuthRequest;
import com.tech.project.entity.User;
import com.tech.project.service.impl.LoginServiceImpl;
import com.tech.project.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import com.tech.project.dto.location.LocationDto;
import com.tech.project.dto.location.LocationSearchDto;
import com.tech.project.entity.Location;
import com.tech.project.repository.LocationRepository;
import com.tech.project.repository.search.LocationSearchRepository;
import com.tech.project.service.impl.LocationServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LoginServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private LoginServiceImpl loginService;

    String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    long expiration = 86400000L;

    AuthRequest authRequest;

    @BeforeEach
    void setUp() {
        authRequest = new AuthRequest("username", "password");

        ReflectionTestUtils.setField(loginService, "secret", secret);
        ReflectionTestUtils.setField(loginService, "expiration", expiration);
    }

    @Test
    void loginTest() {

        User mockUser = new User();
        mockUser.setEmail(authRequest.getUsername());

        Authentication successfulAuthentication = new UsernamePasswordAuthenticationToken(
                mockUser,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenReturn(successfulAuthentication);

        String token = loginService.login(authRequest);

        assertThat(JwtUtil.extractUsername(token, secret))
                .isEqualTo(authRequest.getUsername());

    }

}
