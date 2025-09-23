package pl.okrzei41b.security

data class User(
    val id: String,
    val username: String,
    val password: String,
    val roles: Set<Role>
)

enum class Role {
    MIESZKANIEC,
    ZARZAD,
    ADMINISTRATOR
}
