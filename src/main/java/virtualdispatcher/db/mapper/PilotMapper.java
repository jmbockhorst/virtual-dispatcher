package virtualdispatcher.db.mapper;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import virtualdispatcher.api.DefaultPilot;
import virtualdispatcher.api.Pilot;
import virtualdispatcher.api.PilotFactory;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * {@link Pilot} mapper.
 *
 * @author Grayson Kuhns
 */
@Singleton
@Component
public class PilotMapper implements RowMapper<Pilot> {

    // Constants
    private static final String KEY_ID = "id";
    private static final String KEY_FIRSTNAME = "f_name";
    private static final String KEY_LASTNAME = "l_name";


    @Override
    public Pilot mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new DefaultPilot(
                rs.getInt(KEY_ID),
                rs.getString(KEY_FIRSTNAME),
                rs.getString(KEY_LASTNAME));
    }
}
