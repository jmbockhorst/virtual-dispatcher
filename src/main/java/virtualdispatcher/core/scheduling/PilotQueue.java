package virtualdispatcher.core.scheduling;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import virtualdispatcher.api.Pilot;
import virtualdispatcher.db.dao.AvailabilityDAO;
import virtualdispatcher.db.dao.PilotDAO;

import java.util.List;
import java.util.Optional;

@Component
public class PilotQueue {

  // Dependencies
  private final PilotDAO pilotDAO;
  private final AvailabilityDAO availabilityDAO;

  @Autowired
  PilotQueue(
      final PilotDAO pilotDAO,
      final AvailabilityDAO availabilityDAO) {

    this.pilotDAO = pilotDAO;
    this.availabilityDAO = availabilityDAO;
  }

  public Optional<Pilot> getNextPilot() {
    List<Pilot> pilots = pilotDAO.list();

    // Find the next pilot
    Optional<Pilot> nextPilot = availabilityDAO
        .list()
        .stream()
        .sorted()
        .map(avail -> pilots
              .stream()
              .filter(pilot -> pilot.getId() == avail.getPilotId())
              .findFirst()
              .orElseThrow(() -> new RuntimeException("Pilot not found matching availability record")))
        .findFirst();

    return nextPilot;
  }
}
