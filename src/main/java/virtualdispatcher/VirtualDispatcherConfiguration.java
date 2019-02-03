package virtualdispatcher;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import virtualdispatcher.db.mapper.PilotMapper;

import javax.sql.DataSource;

@Configuration
public class VirtualDispatcherConfiguration {

    @Bean
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSource(){
        return DataSourceBuilder.create().build();
    }

    @Bean
    public PilotMapper pilotMapper(){
        return new PilotMapper();
    }
}
