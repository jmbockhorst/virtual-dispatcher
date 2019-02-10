package virtualdispatcher.api;

/**
 * {@link Flight} factory.
 *
 * @author Grayson Kuhns
 */
public interface FlightFactory {

  /**
   * Creates a {@link Flight}.
   *
   * @param id The ID.
   * @param completed True if the flight is complete.
   * @param started True if the flight has been started.
   * @param pilotId The pilot ID.
   * @param aircraftId The aircraft associated with the flight.
   * @param zoneId The zone ID.
   *
   * @return The {@link Flight}.
   */
  Flight create(
      Integer id,
      boolean completed,
      boolean started,
      int pilotId,
      int aircraftId,
      int zoneId);
}
