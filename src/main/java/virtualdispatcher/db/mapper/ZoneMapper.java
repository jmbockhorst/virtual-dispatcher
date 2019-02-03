package virtualdispatcher.db.mapper;

import org.springframework.jdbc.core.RowMapper;
import virtualdispatcher.api.DefaultZone;
import virtualdispatcher.api.Zone;
import virtualdispatcher.api.ZoneFactory;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * {@link Zone} mapper.
 *
 * @author Grayson Kuhns
 */
@Singleton
public class ZoneMapper implements RowMapper<Zone> {

    // Constants
    private static final String KEY_ID = "id";

    /**
     * Constructor.
     *
     */
    @Inject
    public ZoneMapper() {

    }

    @Override
    public Zone mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new DefaultZone(
                rs.getInt(KEY_ID));
    }
}
