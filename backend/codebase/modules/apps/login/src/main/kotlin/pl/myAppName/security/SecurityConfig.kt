package pl.myAppName.security

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
            .role(Role.MODERATOR.name).implies(Role.USER.name)
            .role(Role.ADMINISTRATOR.name).implies(Role.MODERATOR.name)
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
                authorize("/user/**", hasRole(Role.USER.name))
                authorize("/moderator/**", hasRole(Role.MODERATOR.name))
                authorize("/administrator/**", hasRole(Role.ADMINISTRATOR.name))
                authorize(anyExchange, authenticated)
            }
        }
    }
}
