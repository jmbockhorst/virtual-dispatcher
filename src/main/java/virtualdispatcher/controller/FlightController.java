package virtualdispatcher.controller;

import org.springframework.web.bind.annotation.*;
import virtualdispatcher.core.request.UpdateFlightStatusRequest;
import virtualdispatcher.db.dao.FlightDAO;

@RestController
public class FlightController {

    // Dependencies
    private final FlightDAO flightDAO;

    public FlightController(FlightDAO flightDAO) {
        this.flightDAO = flightDAO;
    }

    @RequestMapping(value = "/api/flights/{id}", method = RequestMethod.POST)
    public void updateFlightStatus(@PathVariable("id") int id, @RequestBody UpdateFlightStatusRequest request){
        flightDAO.updateFlight(id, request);
    }
}
