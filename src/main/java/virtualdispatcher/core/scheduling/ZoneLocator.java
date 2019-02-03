package virtualdispatcher.core.scheduling;

import org.springframework.jdbc.core.JdbcTemplate;
import virtualdispatcher.api.Zone;
import virtualdispatcher.db.mapper.ZoneMapper;

import javax.inject.Singleton;
import javax.sql.DataSource;
import java.util.Optional;

@Singleton
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

  public ZoneLocator(final DataSource dataSource) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
  }

  public Optional<Zone> getAvailableZone() {
    //return the zone the aircraft is currently in
    return this.jdbcTemplate.query(QUERY, new ZoneMapper())
            .stream()
            .findFirst();
  }
}
