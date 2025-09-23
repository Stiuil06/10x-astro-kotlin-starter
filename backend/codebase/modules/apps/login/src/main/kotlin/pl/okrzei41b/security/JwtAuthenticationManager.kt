package pl.okrzei41b.security

import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono

@Component
class JwtAuthenticationManager(
    private val jwtTokenService: JwtTokenService
) : ReactiveAuthenticationManager {

    override fun authenticate(authentication: Authentication): Mono<Authentication> {
        val token = authentication.credentials.toString()

        return Mono.fromCallable {
            if (jwtTokenService.validateToken(token)) {
                val username = jwtTokenService.getUsernameFromToken(token)
                val roles = jwtTokenService.getRolesFromToken(token)
                val authorities = roles.map { SimpleGrantedAuthority("ROLE_${it.name}") }

                UsernamePasswordAuthenticationToken(username, null, authorities)
            } else {
                null
            }
        }
    }
}
