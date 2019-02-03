package virtualdispatcher.core.scheduling;

import javax.inject.Singleton;

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

//  // Dependencies
//  private final Jdbi jdbi;
//
//  @Inject
//  ZoneLocator(
//      final Jdbi jdbi,
//      final ZoneMapper zoneMapper) {
//
//    this.jdbi = jdbi;
//
//    // Register the mapper if it has not been already
//    if (!jdbi.getConfig().get(RowMappers.class).findFor(Zone.class).isPresent()) {
//      jdbi.registerRowMapper(zoneMapper);
//    }
//  }
//
//  public Optional<Zone> getAvailableZone() {
//    //return the zone the aircraft is currently in
//    return jdbi.withHandle(handle -> handle
//        .createQuery(QUERY)
//        .mapTo(Zone.class)
//        .findFirst());
//  }
}
