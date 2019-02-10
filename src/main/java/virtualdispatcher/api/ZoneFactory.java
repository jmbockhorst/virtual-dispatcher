package virtualdispatcher.api;

/**
 * {@link Zone} factory.
 *
 * @author Grayson Kuhns
 */
public interface ZoneFactory {

    /**
     * Creates a {@link Zone}.
     *
     * @param id The zone ID
     *
     * @return The {@link Zone}.
     */
    Zone create(int id);

}
