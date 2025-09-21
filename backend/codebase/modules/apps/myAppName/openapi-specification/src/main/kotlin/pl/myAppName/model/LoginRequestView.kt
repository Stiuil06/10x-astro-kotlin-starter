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
 * @param username Username for authentication
 * @param password Password for authentication
 */
data class LoginRequestView(

    @Schema(example = "user", required = true, description = "Username for authentication")
    @get:JsonProperty("username", required = true) val username: kotlin.String,

    @Schema(example = "user123", required = true, description = "Password for authentication")
    @get:JsonProperty("password", required = true) val password: kotlin.String
) {

}

