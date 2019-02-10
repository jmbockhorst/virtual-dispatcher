package virtualdispatcher.db.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import virtualdispatcher.api.Aircraft;
import virtualdispatcher.core.request.OperationalStatusUpdateRequest;
import virtualdispatcher.db.mapper.AircraftMapper;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class AircraftDAO {

  private final JdbcTemplate jdbcTemplate;
  private final AircraftMapper aircraftMapper;

  @Autowired
  AircraftDAO(final JdbcTemplate jdbcTemplate, final AircraftMapper aircraftMapper) {
    this.jdbcTemplate = jdbcTemplate;
    this.aircraftMapper = aircraftMapper;
  }

  public List<Aircraft> list() {
    return list(null);
  }

  /**
   * Updates a {@link Aircraft}.
   *
   * @param id The pilot ID.
   */
  @RequestMapping(value = "/api/aircraft/{id}", method = RequestMethod.POST)
  public void updateOperationalStatus(
      @PathVariable("id") int id, @RequestBody OperationalStatusUpdateRequest aircraft) {
    this.jdbcTemplate.update(
        "UPDATE aircraft SET operational = ? WHERE id = ?", aircraft.getOperational(), id);
  }

  public List<Aircraft> list(final Boolean operational) {
    List<Aircraft> aircraft = this.jdbcTemplate.query("SELECT * FROM aircraft", aircraftMapper);

    return aircraft.stream()
        .filter(craft -> operational == null || craft.isOperational() == operational)
        .collect(Collectors.toList());
  }
}
