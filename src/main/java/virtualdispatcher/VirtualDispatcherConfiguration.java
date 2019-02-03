package virtualdispatcher;

import javafx.concurrent.Task;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;
import virtualdispatcher.api.AvailabilityFactory;
import virtualdispatcher.api.Pilot;
import virtualdispatcher.db.dao.AircraftDAO;
import virtualdispatcher.db.dao.AvailabilityDAO;
import virtualdispatcher.db.dao.FlightDAO;
import virtualdispatcher.db.dao.PilotDAO;
import virtualdispatcher.db.mapper.AircraftMapper;
import virtualdispatcher.db.mapper.AvailabilityMapper;
import virtualdispatcher.db.mapper.FlightMapper;
import virtualdispatcher.db.mapper.PilotMapper;

import javax.sql.DataSource;

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
    public AircraftMapper aircraftMapper(){
        return new AircraftMapper();
    }

    @Bean
    public AvailabilityMapper availabilityMapper(){
        return new AvailabilityMapper();
    }

    @Bean
    public FlightMapper flightMapper(){
        return new FlightMapper();
    }

    @Bean
    public PilotMapper pilotMapper(){
        return new PilotMapper();
    }

    @Bean
    public AircraftDAO aircraftDAO(){
        return new AircraftDAO(dataSource(), aircraftMapper());
    }

    @Bean
    public AvailabilityDAO availabilityDAO(){
        return new AvailabilityDAO(dataSource(), availabilityMapper());
    }

    @Bean
    public FlightDAO flightDAO(){
        return new FlightDAO(dataSource(), flightMapper());
    }

    @Bean
    public PilotDAO pilotDAO(){
        return new PilotDAO(dataSource(), pilotMapper());
    }

    @Bean
    public TaskScheduler taskScheduler(){
        return new ConcurrentTaskScheduler();
    }
}
