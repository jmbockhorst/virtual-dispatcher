package virtualdispatcher.db.mapper;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import virtualdispatcher.api.Pilot;
import virtualdispatcher.api.PilotFactory;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * {@link Pilot} mapper.
 *
 * @author Grayson Kuhns
 */
@Component
public class PilotMapper implements RowMapper<Pilot> {

    // Constants
    private static final String KEY_ID = "id";
    private static final String KEY_FIRSTNAME = "f_name";
    private static final String KEY_LASTNAME = "l_name";

    // Dependencies
    private final PilotFactory pilotFactory;

    PilotMapper(PilotFactory pilotFactory) {
        this.pilotFactory = pilotFactory;
    }

    @Override
    public Pilot mapRow(ResultSet rs, int rowNum) throws SQLException {
        return pilotFactory.create(
                rs.getInt(KEY_ID),
                rs.getString(KEY_FIRSTNAME),
                rs.getString(KEY_LASTNAME));
    }
}
