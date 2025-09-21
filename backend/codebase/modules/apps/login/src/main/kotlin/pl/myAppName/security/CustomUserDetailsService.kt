package pl.myAppName.security

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
        "user" to User("1", "user", passwordEncoder.encode("user123"), setOf(Role.USER)),
        "moderator" to User("2", "moderator", passwordEncoder.encode("moderator123"), setOf(Role.USER, Role.MODERATOR)),
        "administrator" to User("3", "administrator", passwordEncoder.encode("admin123"), setOf(Role.USER, Role.MODERATOR, Role.ADMINISTRATOR))
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
