package pl.okrzei41b.model

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
 * @param votesFor Number of votes for
 * @param against Number of votes against
 * @param abstain Number of abstain votes
 */
data class VotesView(

    @Schema(example = "45", required = true, description = "Number of votes for")
    @get:JsonProperty("votesFor", required = true) val votesFor: kotlin.Int,

    @Schema(example = "12", required = true, description = "Number of votes against")
    @get:JsonProperty("against", required = true) val against: kotlin.Int,

    @Schema(example = "8", required = true, description = "Number of abstain votes")
    @get:JsonProperty("abstain", required = true) val abstain: kotlin.Int
) {

}

