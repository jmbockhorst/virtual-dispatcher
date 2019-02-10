package virtualdispatcher;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import virtualdispatcher.handler.AircraftHandler;
import virtualdispatcher.handler.AvailabilityHandler;
import virtualdispatcher.handler.FlightHandler;
import virtualdispatcher.handler.PilotHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry webSocketHandlerRegistry) {
        webSocketHandlerRegistry.addHandler(aircraftHandler(), "ws/aircraft");
        webSocketHandlerRegistry.addHandler(availabilityHandler(), "ws/availability");
        webSocketHandlerRegistry.addHandler(flightHandler(), "ws/flights");
        webSocketHandlerRegistry.addHandler(pilotHandler(), "ws/pilots");
    }

    @Bean
    public AircraftHandler aircraftHandler(){
        return new AircraftHandler();
    }

    @Bean
    public AvailabilityHandler availabilityHandler(){
        return new AvailabilityHandler();
    }

    @Bean
    public FlightHandler flightHandler(){
        return new FlightHandler();
    }

    @Bean
    public PilotHandler pilotHandler(){
        return new PilotHandler();
    }
}
