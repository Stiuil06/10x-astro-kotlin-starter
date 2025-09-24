package pl.okrzei41b.rest.adapter

import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pl.okrzei41b.model.DecisionLogResponseView
import pl.okrzei41b.model.DecisionView
import pl.okrzei41b.model.VotesView
import pl.okrzei41b.model.PageableView
import pl.okrzei41b.model.SortView
import java.time.LocalDate
import reactor.core.publisher.Mono

@Suppress("LongMethod", "CyclomaticComplexMethod", "MagicNumber")

@RestController
@RequestMapping("/mieszkaniec/decision-log")
class DecisionLogController {

    @GetMapping(produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getDecisionLog(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @RequestParam(defaultValue = "date") sort: String,
        @RequestParam(required = false) category: String?,
        @RequestParam(required = false) status: String?
    ): Mono<ResponseEntity<DecisionLogResponseView>> {
        
        // Przykładowe dane - w rzeczywistej aplikacji pochodziłyby z bazy danych
        val mockDecisions = listOf(
            DecisionView(
                id = "1",
                title = "Remont klatki schodowej",
                description = "Zatwierdzenie planu remontu klatki schodowej A, obejmującego malowanie ścian, wymianę oświetlenia i naprawę poręczy.",
                date = LocalDate.of(2024, 1, 15),
                category = "Remonty",
                status = DecisionView.Status.ACTIVE,
                votes = VotesView(votesFor = 45, against = 12, abstain = 8),
                approvalDate = LocalDate.of(2024, 1, 20),
                documents = listOf("Plan_remontu.pdf", "Kosztorys.pdf")
            ),
            DecisionView(
                id = "2",
                title = "Wymiana systemu ogrzewania",
                description = "Decyzja o wymianie przestarzałego systemu ogrzewania na nowoczesny system gazowy z indywidualnymi licznikami.",
                date = LocalDate.of(2024, 1, 10),
                category = "Infrastruktura",
                status = DecisionView.Status.COMPLETED,
                votes = VotesView(votesFor = 52, against = 8, abstain = 5),
                approvalDate = LocalDate.of(2024, 1, 15),
                documents = listOf("Analiza_kosztów.pdf", "Umowa_z_firmą.pdf")
            ),
            DecisionView(
                id = "3",
                title = "Zwiększenie opłat za administrację",
                description = "Podwyższenie miesięcznych opłat za administrację o 15% w związku z rosnącymi kosztami utrzymania budynku.",
                date = LocalDate.of(2024, 1, 5),
                category = "Finanse",
                status = DecisionView.Status.ACTIVE,
                votes = VotesView(votesFor = 38, against = 25, abstain = 2),
                approvalDate = null,
                documents = listOf("Analiza_finansowa.pdf")
            ),
            DecisionView(
                id = "4",
                title = "Instalacja systemu monitoringu",
                description = "Zatwierdzenie instalacji systemu kamer monitoringu w częściach wspólnych budynku.",
                date = LocalDate.of(2023, 12, 20),
                category = "Bezpieczeństwo",
                status = DecisionView.Status.COMPLETED,
                votes = VotesView(votesFor = 48, against = 15, abstain = 2),
                approvalDate = LocalDate.of(2023, 12, 25),
                documents = listOf("Specyfikacja_techniczna.pdf", "Umowa_instalacyjna.pdf")
            ),
            DecisionView(
                id = "5",
                title = "Zmiana regulaminu wspólnoty",
                description = "Aktualizacja regulaminu wspólnoty mieszkaniowej w związku z nowymi przepisami prawa.",
                date = LocalDate.of(2023, 12, 10),
                category = "Regulamin",
                status = DecisionView.Status.ACTIVE,
                votes = VotesView(votesFor = 42, against = 18, abstain = 5),
                approvalDate = null,
                documents = listOf("Nowy_regulamin.pdf", "Porównanie_zmian.pdf")
            )
        )

        // Filtrowanie
        var filteredDecisions = mockDecisions
        if (category != null) {
            filteredDecisions = filteredDecisions.filter { it.category == category }
        }
        if (status != null) {
            val statusEnum = when (status) {
                "active" -> DecisionView.Status.ACTIVE
                "completed" -> DecisionView.Status.COMPLETED
                "cancelled" -> DecisionView.Status.CANCELLED
                else -> null
            }
            if (statusEnum != null) {
                filteredDecisions = filteredDecisions.filter { it.status == statusEnum }
            }
        }

        // Sortowanie
        filteredDecisions = when (sort) {
            "date" -> filteredDecisions.sortedByDescending { it.date }
            "category" -> filteredDecisions.sortedBy { it.category }
            "status" -> filteredDecisions.sortedBy { it.status.name }
            else -> filteredDecisions
        }

        // Paginacja
        val totalElements = filteredDecisions.size
        val totalPages = (totalElements + size - 1) / size
        val startIndex = page * size
        val endIndex = minOf(startIndex + size, totalElements)
        val pageContent = filteredDecisions.subList(startIndex, endIndex)

        val response = DecisionLogResponseView(
            content = pageContent,
            totalElements = totalElements,
            totalPages = totalPages,
            propertySize = size,
            number = page,
            first = page == 0,
            last = page >= totalPages - 1,
            numberOfElements = pageContent.size,
            pageable = PageableView(
                sort = SortView(sorted = true, unsorted = false, empty = false),
                pageNumber = page,
                pageSize = size,
                offset = startIndex,
                paged = true,
                unpaged = false
            )
        )

        return Mono.just(ResponseEntity.ok(response))
    }
}