package pl.okrzei41b.security

import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.ReactiveUserDetailsService
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class CustomUserDetailsService(
    private val passwordEncoder: PasswordEncoder
) : ReactiveUserDetailsService {

    // Testowi użytkownicy - w produkcji to powinno być w bazie danych
    private val users = mapOf(
        "mieszkaniec" to User("1", "mieszkaniec", passwordEncoder.encode("mieszkaniec123"), setOf(Role.MIESZKANIEC)),
        "zarzad" to User("2", "zarzad", passwordEncoder.encode("zarzad123"), setOf(Role.MIESZKANIEC, Role.ZARZAD)),
        "administrator" to User("3", "administrator", passwordEncoder.encode("admin123"), setOf(Role.MIESZKANIEC, Role.ZARZAD, Role.ADMINISTRATOR))
    )

    override fun findByUsername(username: String): Mono<UserDetails> {
        return Mono.fromCallable {
            users[username]?.let { user ->
                org.springframework.security.core.userdetails.User.builder()
                    .username(user.username)
                    .password(user.password)
                    .authorities(user.roles.map { SimpleGrantedAuthority("ROLE_${it.name}") })
                    .build()
            }
        }
    }

    fun findUserByUsername(username: String): Mono<User> {
        return Mono.fromCallable { users[username] }
    }
}
