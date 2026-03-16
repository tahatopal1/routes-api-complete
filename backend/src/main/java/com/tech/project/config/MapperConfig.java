package com.tech.project.config;

import com.tech.project.dto.transportation.TransportationRequestDto;
import com.tech.project.entity.Transportation;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

  @Bean
  public ModelMapper modelMapper() {
    ModelMapper modelMapper = new ModelMapper();
    modelMapper.getConfiguration()
        .setSkipNullEnabled(true)
        .setMatchingStrategy(MatchingStrategies.STRICT);

    modelMapper.emptyTypeMap(TransportationRequestDto.class, Transportation.class)
        .addMappings(m -> {
          m.skip(Transportation::setOrigin);
          m.skip(Transportation::setDestination);
        })
        .implicitMappings();

    return modelMapper;
  }

}
