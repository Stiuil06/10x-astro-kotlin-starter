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
 * @param code HTTP status code
 * @param status Status message
 * @param commit Git commit hash
 */
data class GetStatus200ResponseView(

    @Schema(example = "200", required = true, description = "HTTP status code")
    @get:JsonProperty("code", required = true) val code: kotlin.Int,

    @Schema(example = "OK", required = true, description = "Status message")
    @get:JsonProperty("status", required = true) val status: kotlin.String,

    @Schema(example = "abc123def456", required = true, description = "Git commit hash")
    @get:JsonProperty("commit", required = true) val commit: kotlin.String
) {

}

