package pl.myAppName.security

data class User(
    val id: String,
    val username: String,
    val password: String,
    val roles: Set<Role>
)

enum class Role {
    USER,
    MODERATOR,
    ADMINISTRATOR
}
