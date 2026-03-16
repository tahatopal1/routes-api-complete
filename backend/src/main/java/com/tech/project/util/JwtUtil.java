package com.tech.project.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

public class JwtUtil {

  public static String extractUsername(String token, String secret) {
    return extractClaim(token, secret, Claims::getSubject);
  }

  public static List<String> extractRoles(String token, String secret) {
    final Claims claims = extractAllClaims(token, secret);
    return claims.get("roles", List.class);
  }

  public static <T> T extractClaim(String token, String secret,
      Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token, secret);
    return claimsResolver.apply(claims);
  }

  public static String generateToken(UserDetails userDetails, String secretKey, long expiration) {
    return buildToken(userDetails, secretKey, expiration);
  }

  private static String buildToken(
      UserDetails userDetails,
      String secret,
      long expiration) {

    List<String> roles = userDetails.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .toList();

    return Jwts
        .builder()
        .claim("roles", roles)
        .setSubject(userDetails.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(getSignInKey(secret), SignatureAlgorithm.HS256)
        .compact();

  }

  private static Claims extractAllClaims(String token, String secret) {
    return Jwts
        .parserBuilder()
        .setSigningKey(getSignInKey(secret))
        .build()
        .parseClaimsJws(token)
        .getBody();
  }


  private static Key getSignInKey(String secretKey) {
    byte[] keyBytes = Decoders.BASE64.decode(secretKey);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
