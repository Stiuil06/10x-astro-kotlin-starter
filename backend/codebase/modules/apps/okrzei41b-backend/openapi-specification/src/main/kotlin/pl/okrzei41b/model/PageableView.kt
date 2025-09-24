package pl.okrzei41b.model

import java.util.Objects
import com.fasterxml.jackson.annotation.JsonProperty
import pl.okrzei41b.model.SortView
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
 * @param sort 
 * @param pageNumber Page number
 * @param pageSize Page size
 * @param offset Offset
 * @param paged Is paged
 * @param unpaged Is unpaged
 */
data class PageableView(

    @field:Valid
    @Schema(example = "null", description = "")
    @get:JsonProperty("sort") val sort: SortView? = null,

    @Schema(example = "0", description = "Page number")
    @get:JsonProperty("pageNumber") val pageNumber: kotlin.Int? = null,

    @Schema(example = "10", description = "Page size")
    @get:JsonProperty("pageSize") val pageSize: kotlin.Int? = null,

    @Schema(example = "0", description = "Offset")
    @get:JsonProperty("offset") val offset: kotlin.Int? = null,

    @Schema(example = "true", description = "Is paged")
    @get:JsonProperty("paged") val paged: kotlin.Boolean? = null,

    @Schema(example = "false", description = "Is unpaged")
    @get:JsonProperty("unpaged") val unpaged: kotlin.Boolean? = null
) {

}

