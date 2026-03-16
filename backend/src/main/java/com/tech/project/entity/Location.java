package com.tech.project.entity;

import com.tech.project.dto.location.LocationType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
@BatchSize(size = 50)
public class Location {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "location_name", length = 100, nullable = false)
  private String locationName;

  @Column(name = "location_code", length = 10, nullable = false)
  private String locationCode;

  @Column(name = "country", length = 60, nullable = false)
  private String country;

  @Column(name = "city", length = 100, nullable = false)
  private String city;

  @Enumerated(EnumType.STRING)
  @Column(name = "location_type", nullable = false)
  private LocationType locationType;


}
