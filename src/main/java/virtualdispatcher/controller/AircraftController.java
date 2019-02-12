package virtualdispatcher.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import virtualdispatcher.core.request.OperationalStatusUpdateRequest;
import virtualdispatcher.db.dao.AircraftDAO;


@RestController
public class AircraftController {

    // Dependencies
    private final AircraftDAO aircraftDAO;

    @Autowired
    public AircraftController(AircraftDAO aircraftDAO) {
        this.aircraftDAO = aircraftDAO;
    }

    @RequestMapping(value = "/api/aircraft/{id}", method = RequestMethod.POST)
    public void updateOperationalStatus(@PathVariable("id") int id, @RequestBody OperationalStatusUpdateRequest aircraft){
        aircraftDAO.updateOperationalStatus(id, aircraft);
    }
}
