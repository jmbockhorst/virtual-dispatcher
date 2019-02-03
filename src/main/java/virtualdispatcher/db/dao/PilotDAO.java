package virtualdispatcher.db.dao;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
@RestController
public class PilotDAO {

  // Dependencies
  private final JdbcTemplate jdbcTemplate;
  private final PilotMapper pilotMapper;

  @Inject
  PilotDAO(
          final DataSource dataSource,
          final PilotMapper pilotMapper) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
    this.pilotMapper = pilotMapper;
  }

  @RequestMapping(value = "/api/pilots")
  public List<Pilot> list() {
    return this.jdbcTemplate.query("SELECT * FROM pilot", pilotMapper);
  }
}
