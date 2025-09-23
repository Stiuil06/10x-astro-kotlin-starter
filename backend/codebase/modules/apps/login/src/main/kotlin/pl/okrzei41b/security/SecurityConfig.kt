package pl.okrzei41b.security

import org.springframework.security.config.web.server.invoke
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.access.hierarchicalroles.RoleHierarchy
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.web.cors.reactive.CorsConfigurationSource

@Configuration
@EnableWebFluxSecurity
class SecurityConfig(
    private val authenticationManager: JwtAuthenticationManager,
    private val securityContextRepository: SecurityContextRepository,
    private val corsConfigurationSource: CorsConfigurationSource
) {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun roleHierarchy(): RoleHierarchy {
        return RoleHierarchyImpl.withDefaultRolePrefix()
            .role(Role.ZARZAD.name).implies(Role.MIESZKANIEC.name)
            .role(Role.ADMINISTRATOR.name).implies(Role.ZARZAD.name)
            .build()
    }

    @Bean
    fun securityWebFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        return http {
            csrf { disable() }
            cors { configurationSource = corsConfigurationSource }
            authenticationManager = this@SecurityConfig.authenticationManager
            securityContextRepository = this@SecurityConfig.securityContextRepository

            authorizeExchange {
                authorize("/_status", permitAll)
                authorize("/login", permitAll)
                authorize("/mieszkaniec/**", hasRole(Role.MIESZKANIEC.name))
                authorize("/zarzad/**", hasRole(Role.ZARZAD.name))
                authorize("/administrator/**", hasRole(Role.ADMINISTRATOR.name))
                authorize(anyExchange, authenticated)
            }
        }
    }
}
