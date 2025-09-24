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
 * @param sorted Is sorted
 * @param unsorted Is unsorted
 * @param empty Is empty
 */
data class SortView(

    @Schema(example = "true", description = "Is sorted")
    @get:JsonProperty("sorted") val sorted: kotlin.Boolean? = null,

    @Schema(example = "false", description = "Is unsorted")
    @get:JsonProperty("unsorted") val unsorted: kotlin.Boolean? = null,

    @Schema(example = "false", description = "Is empty")
    @get:JsonProperty("empty") val empty: kotlin.Boolean? = null
) {

}

