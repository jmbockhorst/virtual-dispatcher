package virtualdispatcher.resources;

import com.codahale.metrics.annotation.Timed;
import virtualdispatcher.api.Availability;
import virtualdispatcher.core.request.CreateAvailabilityRequest;
import virtualdispatcher.core.request.DeleteAvailabilityRequest;
import virtualdispatcher.db.dao.AvailabilityDAO;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * {@link Availability}s resource.
 *
 * @author Grayson Kuhns/Jerome Tujague
 */
@Singleton
@Path("/availability")
@Produces(MediaType.APPLICATION_JSON)
public class AvailabilityResource implements Resource {

  // Dependencies
  private final AvailabilityDAO availabilityDAO;

  @Inject
  AvailabilityResource(final AvailabilityDAO availabilityDAO) {
    this.availabilityDAO = availabilityDAO;
  }

  @GET
  @Timed
  public List<Availability> getAvailability() {
    return availabilityDAO.list();
  }

  @POST
  @Timed
  @Consumes(MediaType.APPLICATION_JSON)
  public Response createAvailability(final CreateAvailabilityRequest request) {
    availabilityDAO.create(request.getPilotId());

    return Response
        .ok()
        .build();
  }

  @DELETE
  @Timed
  @Consumes(MediaType.APPLICATION_JSON)
  public Response deleteAvailability(final DeleteAvailabilityRequest request) {
    availabilityDAO.delete(request.getPilotId());

    return Response
        .ok()
        .build();
  }
}
