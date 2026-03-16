package com.tech.project.repository.search;

import com.tech.project.dto.transportation.TransportationSearchDto;
import com.tech.project.entity.Transportation;
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
public class TransportationSearchRepository {

  @PersistenceContext
  private EntityManager entityManager;

  public List<Transportation> search(TransportationSearchDto searchDto, Pageable pageable) {
    StringBuilder queryStr = new StringBuilder("SELECT DISTINCT t FROM Transportation t");
    queryStr.append(" LEFT JOIN FETCH t.origin o ");
    queryStr.append(" LEFT JOIN FETCH t.destination d ");

    Map<String, Object> params = buildQueryParams(queryStr, searchDto);

    TypedQuery<Transportation> query = entityManager.createQuery(queryStr.toString(),
        Transportation.class);
    params.forEach(query::setParameter);

    if (Objects.nonNull(pageable) && pageable.isPaged()) {
      query.setFirstResult((int) pageable.getOffset());
      query.setMaxResults(pageable.getPageSize());
    }

    return query.getResultList();

  }

  public long count(TransportationSearchDto searchDto) {
    StringBuilder queryStr = new StringBuilder("SELECT COUNT(t.id) FROM Transportation t ");
    queryStr.append(" LEFT JOIN t.origin o ");
    queryStr.append(" LEFT JOIN t.destination d ");

    Map<String, Object> params = buildQueryParams(queryStr, searchDto);

    TypedQuery<Long> query = entityManager.createQuery(queryStr.toString(), Long.class);
    params.forEach(query::setParameter);

    return query.getSingleResult();

  }

  private Map<String, Object> buildQueryParams(StringBuilder queryStr,
      TransportationSearchDto searchDto) {

    queryStr.append(" WHERE 1=1 ");

    Map<String, Object> params = new HashMap<>();

    if (Strings.isNotBlank(searchDto.getOrigin())) {
      queryStr.append("AND o.locationName LIKE CONCAT(:origin, '%') ");
      params.put("origin", searchDto.getOrigin().trim());
    }

    if (Strings.isNotBlank(searchDto.getDestination())) {
      queryStr.append("AND d.locationName LIKE CONCAT(:destination, '%') ");
      params.put("destination", searchDto.getDestination().trim());
    }

    if (Objects.nonNull(searchDto.getTransportationType())) {
      queryStr.append("AND t.transportationType = :transportationType ");
      params.put("transportationType", searchDto.getTransportationType());
    }

    if (searchDto.getDay() >= 1 && searchDto.getDay() <= 7) {
      queryStr.append("AND :day MEMBER OF t.opDays ");
      params.put("day", searchDto.getDay());
    }

    return params;
  }

}
