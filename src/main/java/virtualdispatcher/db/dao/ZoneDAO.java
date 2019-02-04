package virtualdispatcher.db.dao;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import org.springframework.jdbc.core.JdbcTemplate;
import virtualdispatcher.api.Zone;
import virtualdispatcher.db.mapper.ZoneMapper;

import javax.sql.DataSource;
import java.util.List;

/**
 * {@link Zone} Data access object.
 *
 * @author Grayson Kuhns
 */
@Singleton
public class ZoneDAO {

  // Dependencies
  private final JdbcTemplate jdbcTemplate;
  private final ZoneMapper zoneMapper;

  @Inject
  ZoneDAO(final DataSource dataSource, final ZoneMapper zoneMapper) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
    this.zoneMapper = zoneMapper;
  }

  public List<Zone> list() {
    return this.jdbcTemplate.query("SELECT * FROM zones", new ZoneMapper());
  }
}
