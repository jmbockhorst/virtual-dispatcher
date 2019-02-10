package virtualdispatcher.db.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import virtualdispatcher.api.Aircraft;
import virtualdispatcher.api.AircraftFactory;
import virtualdispatcher.api.DefaultAircraft;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * {@link Aircraft} mapper.
 *
 * @author Grayson Kuhns
 */
@Component
public class AircraftMapper implements RowMapper<Aircraft> {

    // Constants
    private static final String KEY_ID = "id";
    private static final String KEY_OPERATIONAL = "operational";

    // Dependencies
    private final AircraftFactory aircraftFactory;

    @Autowired
    AircraftMapper(final AircraftFactory aircraftFactory){
        this.aircraftFactory = aircraftFactory;
    }

    @Override
    public Aircraft mapRow(ResultSet rs, int rowNum) throws SQLException {
        return aircraftFactory.create(
                rs.getInt(KEY_ID),
                rs.getBoolean(KEY_OPERATIONAL));
    }
}
