package virtualdispatcher.db.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import virtualdispatcher.api.Availability;
import virtualdispatcher.api.Pilot;
import virtualdispatcher.core.request.CreateAvailabilityRequest;
import virtualdispatcher.core.request.DeleteAvailabilityRequest;
import virtualdispatcher.db.mapper.AvailabilityMapper;

import java.util.List;

/** {@link Availability} */
@Component
public class AvailabilityDAO {

  // Dependencies
  private final JdbcTemplate jdbcTemplate;
  private final AvailabilityMapper availabilityMapper;

  /**
   * Constructor.
   *
   * @param jdbcTemplate the jdbc template
   * @param availabilityMapper The {@link AvailabilityMapper}.
   */
  @Autowired
  AvailabilityDAO(final JdbcTemplate jdbcTemplate, final AvailabilityMapper availabilityMapper) {
    this.jdbcTemplate = jdbcTemplate;
    this.availabilityMapper = availabilityMapper;
  }

  /** Creates an {@link Availability}. @param availability the availability */
  public void create(CreateAvailabilityRequest availability) {
    this.jdbcTemplate.update(
        "INSERT INTO availability (pilot_id) VALUES (?)", availability.getPilotId());
  }

  /**
   * Deletes an availability for a pilot.
   *
   * @param pilot The pilot.
   */
  public void delete(final Pilot pilot) {
    delete(pilot.getId());
  }

  /**
   * Deletes an availability.
   *
   * @param availability The {@link Availability}.
   */
  public void delete(DeleteAvailabilityRequest availability) {
    delete(availability.getPilotId());
  }

  /**
   * Deletes an {@link Availability}.
   *
   * @param pilotId The pilot ID.
   */
  public void delete(final int pilotId) {
    this.jdbcTemplate.update("DELETE FROM availability WHERE pilot_id = ?", pilotId);
  }

  /**
   * List availabilities.
   *
   * @return The availabilities.
   */
  public List<Availability> list() {
    return this.jdbcTemplate.query("SELECT * FROM availability", availabilityMapper);
  }
}
