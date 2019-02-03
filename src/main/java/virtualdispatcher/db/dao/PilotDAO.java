package virtualdispatcher.db.dao;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import org.springframework.jdbc.core.JdbcTemplate;
import virtualdispatcher.api.Pilot;
import virtualdispatcher.db.mapper.PilotMapper;

import javax.sql.DataSource;
import java.util.List;

/**
 * {@link Pilot} Data access object.
 *
 * @author Grayson Kuhns
 */
@Singleton
public class PilotDAO {

  // Dependencies
  private final JdbcTemplate jdbcTemplate;

  @Inject
  PilotDAO(
          final DataSource dataSource,
          final PilotMapper pilotMapper) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
  }

  public List<Pilot> list() {
    return this.jdbcTemplate.query("SELECT * FROM pilot", new PilotMapper());
  }
}
