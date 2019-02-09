package virtualdispatcher.db.dao;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import virtualdispatcher.api.DefaultFlight;
import virtualdispatcher.api.Flight;
import virtualdispatcher.core.request.UpdateFlightStatusRequest;
import virtualdispatcher.db.mapper.FlightMapper;

import javax.sql.DataSource;
import java.util.List;
import java.util.stream.Collectors;

/** {@link Flight} */
@Singleton
@RestController
public class FlightDAO {

  // Dependencies
  private final JdbcTemplate jdbcTemplate;

  /**
   * Constructor.
   *
   * @param flightMapper The {@link FlightMapper}.
   */
  @Autowired
  public FlightDAO(final DataSource dataSource, final FlightMapper flightMapper) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
  }

  public List<Flight> list() {
    return list(null, null);
  }

  /**
   * List flights.
   *
   * @return The flights.
   */
  public List<Flight> list(final Boolean completed, final Boolean started) {
    return this.jdbcTemplate.query("SELECT * FROM flights", new FlightMapper()).stream()
        .filter(flight -> completed == null || flight.isCompleted() == completed)
        .filter(flight -> started == null || flight.isStarted() == started)
        .collect(Collectors.toList());
  }

  @RequestMapping(value = "/api/flights/{id}", method = RequestMethod.POST)
  public void updateFlight(
      @PathVariable("id") int id, @RequestBody UpdateFlightStatusRequest request) {
    if (request.getStarted() != null) {
      changeStartedStatus(id, request.getStarted());
    }

    if (request.getCompleted() != null) {
      changeCompletedStatus(id, request.getCompleted());
    }
  }

  public void changeStartedStatus(final int id, final boolean started) {
    this.jdbcTemplate.update(
        "UPDATE flights\n" + "  SET started = ?\n" + "WHERE id = ?", started, id);
  }

  public void changeCompletedStatus(final int id, final boolean completed) {
    this.jdbcTemplate.update(
        "UPDATE flights\n" + "  SET completed = ?\n" + "WHERE id = ?", completed, id);
  }

  public void create(final Flight flight) {
    this.jdbcTemplate.update(
        "INSERT\n"
            + "  INTO flights (completed, started, pilot_id, aircraft_id, zone_id)\n"
            + "  VALUES (?, ?, ?, ?, ?)",
        flight.isCompleted(),
        flight.isStarted(),
        flight.getPilotId(),
        flight.getAircraftId(),
        flight.getZoneId());
  }
}
