package virtualdispatcher.core.scheduling;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import virtualdispatcher.api.Zone;
import virtualdispatcher.db.mapper.ZoneMapper;

import javax.sql.DataSource;
import java.util.Optional;

@Component
public class ZoneLocator {

  // Constants
  private static final String QUERY =
      "SELECT\n" +
      "  id\n" +
      "FROM\n" +
      "  zones\n" +
      "WHERE\n" +
      "  id NOT IN (\n" +
      "    SELECT\n" +
      "      zone_id\n" +
      "    FROM\n" +
      "      flights\n" +
      "    WHERE\n" +
      "      completed = False\n" +
      "    GROUP BY\n" +
      "       zone_id\n" +
      "    HAVING COUNT(*) > 1\n" +
      "  )\n" +
      "LIMIT\n" +
      "  1";

  // Dependencies
  private final JdbcTemplate jdbcTemplate;
  private final ZoneMapper zoneMapper;

  @Autowired
  ZoneLocator(final DataSource dataSource, final ZoneMapper zoneMapper) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
    this.zoneMapper = zoneMapper;
  }

  public Optional<Zone> getAvailableZone() {
    //return the zone the aircraft is currently in
    return this.jdbcTemplate.query(QUERY, zoneMapper)
            .stream()
            .findFirst();
  }
}
