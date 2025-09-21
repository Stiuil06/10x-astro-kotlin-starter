package pl.myAppName.model

import java.util.Objects
import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.DecimalMax
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import jakarta.validation.Valid
import io.swagger.v3.oas.annotations.media.Schema

/**
 * 
 * @param token JWT token for authentication
 * @param type Token type
 */
data class LoginResponseView(

    @Schema(example = "eyJhbGciOiJIUzI1NiJ9...", required = true, description = "JWT token for authentication")
    @get:JsonProperty("token", required = true) val token: kotlin.String,

    @Schema(example = "Bearer", required = true, description = "Token type")
    @get:JsonProperty("type", required = true) val type: kotlin.String
) {

}

