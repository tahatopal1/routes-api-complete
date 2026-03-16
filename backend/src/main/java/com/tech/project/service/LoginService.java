package com.tech.project.service;

import com.tech.project.dto.login.AuthRequest;

public interface LoginService {

  String login(AuthRequest request);

}
