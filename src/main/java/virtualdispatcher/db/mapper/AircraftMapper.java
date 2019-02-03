package virtualdispatcher.db.mapper;

import org.springframework.jdbc.core.RowMapper;
import virtualdispatcher.api.Aircraft;
import virtualdispatcher.api.AircraftFactory;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * {@link Aircraft} mapper.
 *
 * @author Grayson Kuhns
 */
@Singleton
public class AircraftMapper implements RowMapper<Aircraft> {

    // Constants
    private static final String KEY_ID = "id";
    private static final String KEY_OPERATIONAL = "operational";

    // Dependencies
    private final AircraftFactory aircraftFactory;

    /**
     * Constructor.
     *
     * @param aircraftFactory The {@link AircraftFactory}.
     */
    @Inject
    AircraftMapper(final AircraftFactory aircraftFactory) {
        this.aircraftFactory = aircraftFactory;
    }

    @Override
    public Aircraft mapRow(ResultSet rs, int rowNum) throws SQLException {
        return aircraftFactory.create(
                rs.getInt(KEY_ID),
                rs.getBoolean(KEY_OPERATIONAL));
    }
}
