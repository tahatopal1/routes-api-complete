package com.tech.project.repository;

import com.tech.project.dto.route.Route;
import com.tech.project.entity.Transportation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TransportationRepository extends JpaRepository<Transportation, Integer> {

  @Query("""
      select t from Transportation t 
      left join fetch t.origin 
      left join fetch t.destination 
      left join fetch t.opDays 
      WHERE t.id = :id
      """)
  Optional<Transportation> findTransportationById(@Param("id") Integer id);

  @Query("""
      SELECT new com.tech.project.dto.route.Route(t1,t2,t3)
          FROM Transportation t1 
          INNER JOIN Transportation t2 ON t1.destination = t2.origin 
          AND t1.origin.id = :origin 
          AND t2.transportationType = 'FLIGHT'
          AND :day MEMBER OF t1.opDays 
          AND :day MEMBER OF t2.opDays 
          INNER JOIN Transportation t3 ON t2.destination = t3.origin 
          AND t3.destination.id = :dest AND :day MEMBER OF t3.opDays
                     """)
  List<Route> findRouteVenueToVenue(@Param("origin") Integer origin, @Param("dest") Integer dest,
      @Param("day") Integer day);

  @Query("""
      SELECT new com.tech.project.dto.route.Route(t1,t2,null)
          FROM Transportation t1
          INNER JOIN Transportation t2 ON t1.destination = t2.origin 
              and t1.origin.id = :origin 
              and t2.destination.id = :dest 
              and t2.transportationType = 'FLIGHT'
              and :day MEMBER OF t1.opDays
      """)
  List<Route> findRouteVenueToAirport(@Param("origin") Integer origin, @Param("dest") Integer dest,
      @Param("day") Integer day);

  @Query("""
      SELECT new com.tech.project.dto.route.Route(null,t1,t2)
          FROM Transportation t1
          INNER JOIN Transportation t2 ON t1.destination = t2.origin 
              and t1.origin.id = :origin and t2.destination.id = :dest and t1.transportationType = 'FLIGHT'
      """)
  List<Route> findRouteAirportToVenue(@Param("origin") Integer origin, @Param("dest") Integer dest,
      @Param("day") Integer day);

  @Query("""
      SELECT new com.tech.project.dto.route.Route(null,t1,null)
          FROM Transportation t1 
          LEFT JOIN FETCH t1.origin
          LEFT JOIN FETCH t1.destination
          WHERE t1.transportationType = "FLIGHT" 
          AND t1.origin.id = :origin AND t1.destination.id = :dest
      """)
  List<Route> findRouteAirportToAirport(@Param("origin") Integer origin,
      @Param("dest") Integer dest, @Param("day") Integer day);


}
