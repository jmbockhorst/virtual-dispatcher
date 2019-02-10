package virtualdispatcher.db.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import virtualdispatcher.api.Pilot;
import virtualdispatcher.db.mapper.PilotMapper;

import java.util.List;

/**
 * {@link Pilot} Data access object.
 *
 * @author Grayson Kuhns
 */
@Component
public class PilotDAO {

  // Dependencies
  private final JdbcTemplate jdbcTemplate;
  private final PilotMapper pilotMapper;

  @Autowired
  PilotDAO(final JdbcTemplate jdbcTemplate, final PilotMapper pilotMapper) {
    this.jdbcTemplate = jdbcTemplate;
    this.pilotMapper = pilotMapper;
  }

  public List<Pilot> list() {
    return this.jdbcTemplate.query("SELECT * FROM pilot", pilotMapper);
  }
}
