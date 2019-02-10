package virtualdispatcher.core.scheduling;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import virtualdispatcher.api.*;
import virtualdispatcher.db.dao.AvailabilityDAO;
import virtualdispatcher.db.dao.FlightDAO;

import java.util.Optional;

@Component
public class FlightScheduler {

  // Dependencies
  private final AvailabilityDAO availabilityDAO;
  private final PilotQueue pilotQueue;
  private final AircraftLocator aircraftLocator;
  private final ZoneLocator zoneLocator;
  private final FlightDAO flightDAO;
  private final FlightFactory flightFactory;

  @Autowired
  FlightScheduler(
      final AvailabilityDAO availabilityDAO,
      final PilotQueue pilotQueue,
      final AircraftLocator aircraftLocator,
      final ZoneLocator zoneLocator,
      final FlightDAO flightDAO,
      final FlightFactory flightFactory) {

    this.availabilityDAO = availabilityDAO;
    this.pilotQueue = pilotQueue;
    this.aircraftLocator = aircraftLocator;
    this.zoneLocator = zoneLocator;
    this.flightDAO = flightDAO;
    this.flightFactory = flightFactory;
  }

  public void scheduleFlights() {
    boolean cont = true;
    Optional<Pilot> pilot = pilotQueue.getNextPilot();

    while (pilot.isPresent() && cont) {
      // Schedule a flight for the pilot
      cont = scheduleFlightFor(pilot.get());

      // Look for another pilot
      if (cont) {
        pilot = pilotQueue.getNextPilot();
      }
    }
  }

  private boolean scheduleFlightFor(final Pilot pilot) {
    Optional<Aircraft> aircraft = aircraftLocator.getNextAvailableAircraft();
    if (!aircraft.isPresent()) {
      // No aircraft are available
      return false;
    }

    Optional<Zone> zone = zoneLocator.getAvailableZone();
    if (!zone.isPresent()) {
      // We can't fly anywhere
      return false;
    }

    // We can schedule the flight
    Flight flight = flightFactory.create(
        null,
        false,
        false,
        pilot.getId(),
        aircraft.get().getId(),
        zone.get().getId());
    flightDAO.create(flight);

    // Remove the pilot from the waiting queue
    availabilityDAO.delete(pilot);

    // A flight was scheduled
    return true;
  }
}
