package pl.okrzei41b.security

import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

data class LoginRequest(val username: String, val password: String)
data class LoginResponse(val token: String, val type: String = "Bearer")

@RestController
class AuthController(
    private val userDetailsService: CustomUserDetailsService,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenService: JwtTokenService
) {

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: LoginRequest): Mono<ResponseEntity<LoginResponse>> {
        return userDetailsService.findUserByUsername(loginRequest.username)
            .flatMap { user ->
                if (passwordEncoder.matches(loginRequest.password, user.password)) {
                    val token = jwtTokenService.generateToken(user.username, user.roles)
                    Mono.just(ResponseEntity.ok(LoginResponse(token)))
                } else {
                    Mono.just(ResponseEntity.status(401).build())
                }
            }
            .switchIfEmpty(Mono.just(ResponseEntity.status(401).build()))
    }
}
