package pl.okrzei41b.model

import java.util.Objects
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonValue
import pl.okrzei41b.model.VotesView
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
 * @param id Unique decision identifier
 * @param title Decision title
 * @param description Decision description
 * @param date Decision creation date
 * @param category Decision category
 * @param status Decision status
 * @param votes 
 * @param approvalDate Decision approval date
 * @param documents List of document filenames
 */
data class DecisionView(

    @Schema(example = "1", required = true, description = "Unique decision identifier")
    @get:JsonProperty("id", required = true) val id: kotlin.String,

    @Schema(example = "Remont klatki schodowej", required = true, description = "Decision title")
    @get:JsonProperty("title", required = true) val title: kotlin.String,

    @Schema(example = "Zatwierdzenie planu remontu klatki schodowej A", required = true, description = "Decision description")
    @get:JsonProperty("description", required = true) val description: kotlin.String,

    @field:Valid
    @Schema(example = "Mon Jan 15 01:00:00 CET 2024", required = true, description = "Decision creation date")
    @get:JsonProperty("date", required = true) val date: java.time.LocalDate,

    @Schema(example = "Remonty", required = true, description = "Decision category")
    @get:JsonProperty("category", required = true) val category: kotlin.String,

    @Schema(example = "active", required = true, description = "Decision status")
    @get:JsonProperty("status", required = true) val status: DecisionView.Status,

    @field:Valid
    @Schema(example = "null", required = true, description = "")
    @get:JsonProperty("votes", required = true) val votes: VotesView,

    @field:Valid
    @Schema(example = "Sat Jan 20 01:00:00 CET 2024", description = "Decision approval date")
    @get:JsonProperty("approvalDate") val approvalDate: java.time.LocalDate? = null,

    @Schema(example = "[\"Plan_remontu.pdf\",\"Kosztorys.pdf\"]", description = "List of document filenames")
    @get:JsonProperty("documents") val documents: kotlin.collections.List<kotlin.String>? = null
) {

    /**
    * Decision status
    * Values: ACTIVE,COMPLETED,CANCELLED
    */
    enum class Status(val value: kotlin.String) {

        @JsonProperty("active") ACTIVE("active"),
        @JsonProperty("completed") COMPLETED("completed"),
        @JsonProperty("cancelled") CANCELLED("cancelled")
    }

}

