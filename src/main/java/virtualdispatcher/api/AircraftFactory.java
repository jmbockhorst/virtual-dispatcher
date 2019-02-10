package virtualdispatcher.api;


/**
 * {@link Aircraft} factory.
 *
 * @author Grayson Kuhns
 */
public interface AircraftFactory {

    /**
     * Creates a {@link Aircraft}.
     *
     * @param id The ID.
     * @param operational True if the Aircraft is operational.
     *
     * @return The {@link Aircraft}.
     */
    Aircraft create(int id, boolean operational);
}
