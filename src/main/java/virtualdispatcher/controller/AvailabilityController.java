package virtualdispatcher.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import virtualdispatcher.core.request.CreateAvailabilityRequest;
import virtualdispatcher.core.request.DeleteAvailabilityRequest;
import virtualdispatcher.db.dao.AvailabilityDAO;

@RestController
@RequestMapping(value = "/api/availability")
public class AvailabilityController {

    // Dependencies
    private final AvailabilityDAO availabilityDAO;

    @Autowired
    public AvailabilityController(AvailabilityDAO availabilityDAO) {
        this.availabilityDAO = availabilityDAO;
    }

    @RequestMapping(method = RequestMethod.POST)
    public void createAvailability(@RequestBody CreateAvailabilityRequest availability){
        availabilityDAO.create(availability);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public void deleteAvailability(@RequestBody DeleteAvailabilityRequest availability){
        availabilityDAO.delete(availability);
    }
}
