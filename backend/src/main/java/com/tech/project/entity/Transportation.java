package com.tech.project.entity;

import com.tech.project.dto.transportation.TransportationType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transportations", uniqueConstraints = {
    @UniqueConstraint(
        name = "uk_transportation_od",
        columnNames = {"origin", "destination", "transportation_type"}
    )
})
@Data
@NoArgsConstructor
public class Transportation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "origin", nullable = false)
  private Location origin;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "destination", nullable = false)
  private Location destination;

  @Enumerated(EnumType.STRING)
  @Column(name = "transportation_type", nullable = false)
  private TransportationType transportationType;

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(
      name = "transportation_op_days",
      joinColumns = @JoinColumn(name = "transportation_id")
  )
  @Column(name = "day")
  @BatchSize(size = 50)
  private List<Integer> opDays = new ArrayList<>();

}
