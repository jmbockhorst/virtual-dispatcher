package virtualdispatcher;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;
import virtualdispatcher.api.*;

import javax.sql.DataSource;
import java.time.Instant;

@Configuration
@EnableScheduling
public class VirtualDispatcherConfiguration {
    @Bean
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSource(){
        return DataSourceBuilder.create().build();
    }

    @Bean
    public JdbcTemplate jdbcTemplate(){
        return new JdbcTemplate(dataSource());
    }

    @Bean
    AircraftFactory aircraftFactory(){
        return new AircraftFactory() {
            @Override
            public Aircraft create(int id, boolean operational) {
                return new DefaultAircraft(id, operational);
            }
        };
    }

    @Bean
    AvailabilityFactory availabilityFactory(){
        return new AvailabilityFactory() {
            @Override
            public Availability create(int pilotId, Instant timeCreated) {
                return new DefaultAvailability(pilotId, timeCreated);
            }
        };
    }

    @Bean
    FlightFactory flightFactory(){
        return new FlightFactory() {
            @Override
            public Flight create(Integer id, boolean completed, boolean started, int pilotId, int aircraftId, int zoneId) {
                return new DefaultFlight(id, completed, started, pilotId, aircraftId, zoneId);
            }
        };
    }

    @Bean
    PilotFactory pilotFactory(){
        return new PilotFactory() {
            @Override
            public Pilot create(int id, String firstName, String lastName) {
                return new DefaultPilot(id, firstName, lastName);
            }
        };
    }

    @Bean
    ZoneFactory zoneFactory(){
        return new ZoneFactory() {
            @Override
            public Zone create(int id) {
                return new DefaultZone(id);
            }
        };
    }

    @Bean
    public TaskScheduler taskScheduler(){
        return new ConcurrentTaskScheduler();
    }
}