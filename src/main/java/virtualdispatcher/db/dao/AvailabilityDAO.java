package virtualdispatcher.db.dao;

import com.google.inject.Inject;
import org.springframework.jdbc.core.JdbcTemplate;
import virtualdispatcher.api.Availability;
import virtualdispatcher.api.Pilot;
import virtualdispatcher.db.mapper.AvailabilityMapper;

import javax.sql.DataSource;
import java.util.List;

/**
 * {@link Availability}
 */

public class AvailabilityDAO {

    // Dependencies
    private final AvailabilityMapper availabilityMapper;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Constructor.
     *
     * @param availabilityMapper The {@link AvailabilityMapper}.
     */
    @Inject
    AvailabilityDAO(
            final DataSource dataSource,
            final AvailabilityMapper availabilityMapper) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        this.availabilityMapper = availabilityMapper;
    }

    /**
     * Creates an {@link Availability}.
     *
     * @param pilotId The pilot ID.
     */
    public void create(final int pilotId) {
        this.jdbcTemplate.update("INSERT INTO availability (pilot_id) VALUES (?)", pilotId);
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
    public void delete(final Availability availability) {
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
        return this.jdbcTemplate.query("SELECT * FROM availability", new AvailabilityMapper());
    }
}
