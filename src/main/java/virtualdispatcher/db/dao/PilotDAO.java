package virtualdispatcher.db.dao;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.mapper.RowMappers;
import virtualdispatcher.api.Pilot;
import virtualdispatcher.db.mapper.PilotMapper;

import java.util.List;

/**
 * {@link Pilot} Data access object.
 *
 * @author Grayson Kuhns
 */
@Singleton
public class PilotDAO {

  // Dependencies
  private final Jdbi jdbi;

  @Inject
  PilotDAO(
      final Jdbi jdbi,
      final PilotMapper pilotMapper) {

    this.jdbi = jdbi;

    // Register the mapper if it has not been already
    if (!jdbi.getConfig().get(RowMappers.class).findFor(Pilot.class).isPresent()) {
      jdbi.registerRowMapper(pilotMapper);
    }
  }

  public List<Pilot> list() {
    return jdbi.withHandle(handle -> handle
      .createQuery("SELECT * FROM pilot")
      .mapTo(Pilot.class)
      .list());
  }
}
