package pl.okrzei41b.model

import java.util.Objects
import com.fasterxml.jackson.annotation.JsonProperty
import pl.okrzei41b.model.DecisionView
import pl.okrzei41b.model.PageableView
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
 * @param content 
 * @param totalElements Total number of elements
 * @param totalPages Total number of pages
 * @param propertySize Page size
 * @param number Current page number
 * @param first Is first page
 * @param last Is last page
 * @param numberOfElements Number of elements in current page
 * @param pageable 
 */
data class DecisionLogResponseView(

    @field:Valid
    @Schema(example = "null", required = true, description = "")
    @get:JsonProperty("content", required = true) val content: kotlin.collections.List<DecisionView>,

    @Schema(example = "25", required = true, description = "Total number of elements")
    @get:JsonProperty("totalElements", required = true) val totalElements: kotlin.Int,

    @Schema(example = "3", required = true, description = "Total number of pages")
    @get:JsonProperty("totalPages", required = true) val totalPages: kotlin.Int,

    @Schema(example = "10", required = true, description = "Page size")
    @get:JsonProperty("size", required = true) val propertySize: kotlin.Int,

    @Schema(example = "0", required = true, description = "Current page number")
    @get:JsonProperty("number", required = true) val number: kotlin.Int,

    @Schema(example = "true", required = true, description = "Is first page")
    @get:JsonProperty("first", required = true) val first: kotlin.Boolean,

    @Schema(example = "false", required = true, description = "Is last page")
    @get:JsonProperty("last", required = true) val last: kotlin.Boolean,

    @Schema(example = "10", required = true, description = "Number of elements in current page")
    @get:JsonProperty("numberOfElements", required = true) val numberOfElements: kotlin.Int,

    @field:Valid
    @Schema(example = "null", description = "")
    @get:JsonProperty("pageable") val pageable: PageableView? = null
) {

}

