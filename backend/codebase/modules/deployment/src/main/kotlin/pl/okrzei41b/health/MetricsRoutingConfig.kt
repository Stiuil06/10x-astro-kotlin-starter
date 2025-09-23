package pl.okrzei41b.health

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.server.RouterFunction
import org.springframework.web.reactive.function.server.RouterFunctions
import org.springframework.web.reactive.function.server.ServerResponse


@Configuration
class MetricsRoutingConfig {
    @Bean
    fun routes(healthHandler: HealthHandler): RouterFunction<ServerResponse> =
        RouterFunctions.route()
            .GET("/_status", healthHandler::status)
            .build()
}