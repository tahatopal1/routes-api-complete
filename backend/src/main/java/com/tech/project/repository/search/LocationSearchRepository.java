package com.tech.project.repository.search;

import com.tech.project.dto.location.LocationSearchDto;
import com.tech.project.entity.Location;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.apache.logging.log4j.util.Strings;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Repository
public class LocationSearchRepository {

  @PersistenceContext
  private EntityManager entityManager;

  public List<Location> search(LocationSearchDto searchDto, Pageable pageable) {
    StringBuilder queryStr = new StringBuilder("SELECT DISTINCT l FROM Location l");
    Map<String, Object> params = buildQueryParams(queryStr, searchDto);

    TypedQuery<Location> query = entityManager.createQuery(queryStr.toString(), Location.class);
    params.forEach(query::setParameter);

    if (Objects.nonNull(pageable) && pageable.isPaged()) {
      query.setFirstResult((int) pageable.getOffset());
      query.setMaxResults(pageable.getPageSize());
    }

    return query.getResultList();

  }

  public long count(LocationSearchDto searchDto) {
    StringBuilder queryStr = new StringBuilder("SELECT COUNT(l.id) FROM Location l ");
    Map<String, Object> params = buildQueryParams(queryStr, searchDto);

    TypedQuery<Long> query = entityManager.createQuery(queryStr.toString(), Long.class);
    params.forEach(query::setParameter);

    return query.getSingleResult();

  }

  private Map<String, Object> buildQueryParams(StringBuilder queryStr,
      LocationSearchDto searchDto) {
    queryStr.append(" WHERE 1=1 ");

    Map<String, Object> params = new HashMap<>();

    if (Strings.isNotBlank(searchDto.getLocationName())) {
      queryStr.append("AND l.locationName LIKE CONCAT(:locationName, '%') ");
      params.put("locationName", searchDto.getLocationName().trim());
    }

    if (Strings.isNotBlank(searchDto.getLocationCode())) {
      queryStr.append("AND l.locationCode LIKE CONCAT(:locationCode, '%') ");
      params.put("locationCode", searchDto.getLocationCode().trim());
    }

    if (Strings.isNotBlank(searchDto.getCountry())) {
      queryStr.append("AND l.country LIKE CONCAT(:country, '%') ");
      params.put("country", searchDto.getCountry().trim());
    }

    if (Strings.isNotBlank(searchDto.getCity())) {
      queryStr.append("AND l.city LIKE CONCAT(:city, '%') ");
      params.put("city", searchDto.getCity().trim());
    }

    if (Strings.isNotBlank(searchDto.getLocationType())) {
      queryStr.append("AND l.locationType LIKE CONCAT(:locationType, '%') ");
      params.put("locationType", searchDto.getLocationType().trim());
    }

    return params;
  }


}
