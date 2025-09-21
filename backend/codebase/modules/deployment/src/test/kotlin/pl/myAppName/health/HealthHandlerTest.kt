package pl.myAppName.health

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.reactive.server.WebTestClient

@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = ["application.commit-number = testVersion"],
)
class HealthHandlerTest {

    @Autowired
    private lateinit var webTestClient: WebTestClient

    @Test
    fun `status endpoint returns 200 OK with correct data`() {
        // when
        webTestClient.get()
            .uri("/_status")
            .exchange()
            // then

            .expectStatus().isOk
            .expectBody()
            .jsonPath("$.code").isEqualTo(200)
            .jsonPath("$.status").isEqualTo("OK")
            .jsonPath("$.commit").isEqualTo("testVersion")
    }
}