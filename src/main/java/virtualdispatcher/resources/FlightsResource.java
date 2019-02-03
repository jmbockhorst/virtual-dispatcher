package virtualdispatcher.resources;

import com.codahale.metrics.annotation.Timed;
import virtualdispatcher.api.Flight;
import virtualdispatcher.core.request.UpdateFlightStatusRequest;
import virtualdispatcher.core.scheduling.FlightScheduler;
import virtualdispatcher.db.dao.FlightDAO;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

/**
 * {@link Flight}s resource.
 *
 * @author Grayson Kuhns
 */
@Singleton
@Path("/flights")
@Produces(MediaType.APPLICATION_JSON)
public class FlightsResource implements Resource {

  // Dependencies
  private final FlightDAO flightDAO;
  private final FlightScheduler flightScheduler;

  @Inject
  FlightsResource(
      final FlightDAO flightDAO,
      final FlightScheduler flightScheduler) {

    this.flightDAO = flightDAO;
    this.flightScheduler = flightScheduler;
  }

  @GET
  @Timed
  public List<Flight> getFlights(
      @QueryParam("aircraftId") final Integer aircraftId,
      @QueryParam("completed") final Boolean completed,
      @QueryParam("started") final Boolean started) {

    return flightDAO
        .list(completed, started)
        .stream()
        .filter(flight -> aircraftId == null || flight.getAircraftId() == aircraftId)
        .collect(Collectors.toList());
  }

  @POST
  @Timed
  @Path("{id}")
  public Response updateFlight(@PathParam("id") String idStr, final UpdateFlightStatusRequest request) {
    int id = Integer.parseInt(idStr);

    if (request.getStarted() != null) {
      flightDAO.changeStartedStatus(id, request.getStarted());
    }

    if (request.getCompleted() != null) {
      flightDAO.changeCompletedStatus(id, request.getCompleted());
    }

    return Response
        .ok()
        .build();
  }

  @GET
  @Timed
  @Path("/schedule")
  public Response scheduleFlight() {
    flightScheduler.scheduleFlights();

    return Response
        .ok()
        .build();
  }
}
