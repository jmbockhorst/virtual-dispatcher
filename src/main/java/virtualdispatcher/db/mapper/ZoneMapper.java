package virtualdispatcher.db.mapper;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import virtualdispatcher.api.Zone;
import virtualdispatcher.api.ZoneFactory;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * {@link Zone} mapper.
 *
 * @author Grayson Kuhns
 */
@Component
public class ZoneMapper implements RowMapper<Zone> {

    // Constants
    private static final String KEY_ID = "id";

    // Dependencies
    private final ZoneFactory zoneFactory;

    ZoneMapper(ZoneFactory zoneFactory) {
        this.zoneFactory = zoneFactory;
    }

    @Override
    public Zone mapRow(ResultSet rs, int rowNum) throws SQLException {
        return zoneFactory.create(
                rs.getInt(KEY_ID));
    }
}
