package virtualdispatcher;

import virtualdispatcher.core.scheduling.FlightScheduler;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.Timer;
import java.util.TimerTask;

@Singleton
public class ApplicationRunner {

  // Constants
  private final long FLIGHT_SCHEDULER_INTERVAL_SECONDS = 3L;

  // Dependencies
  private final FlightScheduler flightScheduler;

  @Inject
  ApplicationRunner(
      final FlightScheduler flightScheduler) {

    this.flightScheduler = flightScheduler;
  }

  /**
   * Run the application.
   *
   * @param configuration The {@link VirtualDispatcherConfiguration}.
   */
  public void run(
      final VirtualDispatcherConfiguration configuration) {

    // Register resources
    //resources.forEach(resource -> environment.jersey().register(resource));

    startFlightScheduler();
  }

  private void startFlightScheduler() {
    TimerTask schedulerTask = new TimerTask() {
      @Override
      public void run() {
        flightScheduler.scheduleFlights();
      }
    };

    Timer timer = new Timer("Flight Scheduler Timer");

    long intervalMilli = 1000L * FLIGHT_SCHEDULER_INTERVAL_SECONDS;
    timer.scheduleAtFixedRate(schedulerTask, intervalMilli, intervalMilli);
  }
}
