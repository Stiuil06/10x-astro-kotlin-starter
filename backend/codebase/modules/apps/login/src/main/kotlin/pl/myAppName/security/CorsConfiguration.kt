package pl.myAppName.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.stereotype.Component
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.CorsConfigurationSource
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource



@Component
@ConfigurationProperties(prefix = "cors")
data class CorsConfig(
    var allowedOrigins: List<String> = emptyList(),
    var allowedMethods: List<String> = emptyList(),
    var allowedHeaders: List<String> = emptyList(),
    var allowCredentials: Boolean = false
)

@Configuration
class CorsConfiguration(
    private val corsConfig:CorsConfig
) {

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOriginPatterns = corsConfig.allowedOrigins
        configuration.allowedMethods = corsConfig.allowedMethods
        configuration.allowedHeaders = corsConfig.allowedHeaders
        configuration.allowCredentials = corsConfig.allowCredentials

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}
