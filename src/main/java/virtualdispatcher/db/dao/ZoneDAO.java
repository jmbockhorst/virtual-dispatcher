package virtualdispatcher.db.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import virtualdispatcher.api.Zone;
import virtualdispatcher.db.mapper.ZoneMapper;

import java.util.List;

/**
 * {@link Zone} Data access object.
 *
 * @author Grayson Kuhns
 */
@Component
public class ZoneDAO {

  // Dependencies
  private final JdbcTemplate jdbcTemplate;
  private final ZoneMapper zoneMapper;

  @Autowired
  ZoneDAO(final JdbcTemplate jdbcTemplate, final ZoneMapper zoneMapper) {
    this.jdbcTemplate = jdbcTemplate;
    this.zoneMapper = zoneMapper;
  }

  public List<Zone> list() {
    return this.jdbcTemplate.query("SELECT * FROM zones", zoneMapper);
  }
}
