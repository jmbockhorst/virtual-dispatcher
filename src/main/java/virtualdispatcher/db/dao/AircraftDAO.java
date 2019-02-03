package virtualdispatcher.db.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import virtualdispatcher.api.Aircraft;
import virtualdispatcher.db.mapper.AircraftMapper;

import javax.inject.Singleton;
import javax.sql.DataSource;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class AircraftDAO {

  private final JdbcTemplate jdbcTemplate;

  @Autowired
  AircraftDAO(final DataSource dataSource) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
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
  public void updateOperationalStatus(@PathVariable("id") int id, @RequestBody Aircraft aircraft) {
    this.jdbcTemplate.update("UPDATE aircraft SET operational = ? WHERE id = ?", aircraft.isOperational(), id);
  }

  public List<Aircraft> list(final Boolean operational) {
    List<Aircraft> aircraft = this.jdbcTemplate.query("SELECT * FROM aircraft", new AircraftMapper());

    return aircraft
        .stream()
        .filter(craft -> operational == null || craft.isOperational() == operational)
        .collect(Collectors.toList());
  }
}
