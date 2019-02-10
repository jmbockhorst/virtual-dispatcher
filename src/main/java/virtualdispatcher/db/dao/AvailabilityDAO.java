package virtualdispatcher.db.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import virtualdispatcher.api.Availability;
import virtualdispatcher.api.Pilot;
import virtualdispatcher.core.request.CreateAvailabilityRequest;
import virtualdispatcher.core.request.DeleteAvailabilityRequest;
import virtualdispatcher.db.mapper.AvailabilityMapper;

import java.util.List;

/** {@link Availability} */
@RestController
@RequestMapping(value = "/api/availability")
public class AvailabilityDAO {

  // Dependencies
  private final JdbcTemplate jdbcTemplate;
  private final AvailabilityMapper availabilityMapper;

  /**
   * Constructor.
   *
   * @param availabilityMapper The {@link AvailabilityMapper}.
   */
  @Autowired
  AvailabilityDAO(final JdbcTemplate jdbcTemplate, final AvailabilityMapper availabilityMapper) {
    this.jdbcTemplate = jdbcTemplate;
    this.availabilityMapper = availabilityMapper;
  }

  /** Creates an {@link Availability}. */
  @RequestMapping(method = RequestMethod.POST)
  public void create(@RequestBody CreateAvailabilityRequest availability) {
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
  @RequestMapping(method = RequestMethod.DELETE)
  public void delete(@RequestBody DeleteAvailabilityRequest availability) {
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
