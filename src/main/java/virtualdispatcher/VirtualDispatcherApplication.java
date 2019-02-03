package virtualdispatcher;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VirtualDispatcherApplication {

    public static void main(final String[] args) throws Exception {
        SpringApplication.run(VirtualDispatcherApplication.class, args);
    }

    //@Override
    public String getName() {
        return "VirtualDispatcher";
    }

//    @Override
//    public void initialize(final Bootstrap<VirtualDispatcherConfiguration> bootstrap) {
//        bootstrap.addBundle(new AssetsBundle("/assets", "/", "flightStatus.html"));
//    }
//
//    @Override
//    public void run(final VirtualDispatcherConfiguration configuration,
//                    final Environment environment) {
//        // Serve API resources at /api path
//        environment.jersey().setUrlPattern("/api/*");
//
//        // Run the application
//        Guice
//            .createInjector(new ApplicationModule(environment, configuration))
//            .getInstance(ApplicationRunner.class)
//            .run(environment, configuration);
//    }
}
