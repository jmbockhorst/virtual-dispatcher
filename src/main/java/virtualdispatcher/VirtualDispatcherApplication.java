package virtualdispatcher;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import virtualdispatcher.core.scheduling.FlightScheduler;

import java.util.Timer;
import java.util.TimerTask;

@SpringBootApplication
public class VirtualDispatcherApplication implements ApplicationRunner {
    @Autowired
    private FlightScheduler flightScheduler;

    public static void main(final String[] args) throws Exception {
        SpringApplication.run(VirtualDispatcherApplication.class, args);
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        TimerTask schedulerTask = new TimerTask() {
            @Override
            public void run() {
                flightScheduler.scheduleFlights();
            }
        };

        Timer timer = new Timer("Flight Scheduler Timer");

        long intervalMilli = 3000L;
        timer.scheduleAtFixedRate(schedulerTask, intervalMilli, intervalMilli);
    }
}
