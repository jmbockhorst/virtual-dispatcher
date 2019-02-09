package virtualdispatcher.db.mapper;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import virtualdispatcher.api.Availability;
import virtualdispatcher.api.AvailabilityFactory;
import virtualdispatcher.api.DefaultAvailability;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * {@link Availability} mapper.
 *
 * @author Grayson Kuhns
 */
@Singleton
@Component
public class AvailabilityMapper implements RowMapper<Availability> {

    // Constants
    private static final String KEY_CREATED = "created";
    private static final String KEY_PILOT_ID = "pilot_id";

    @Override
    public Availability mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new DefaultAvailability(
                rs.getInt(KEY_PILOT_ID),
                rs.getTimestamp(KEY_CREATED).toInstant());
    }
}
