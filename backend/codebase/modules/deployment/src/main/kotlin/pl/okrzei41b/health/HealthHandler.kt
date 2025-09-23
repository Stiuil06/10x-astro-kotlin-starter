package pl.okrzei41b.health

import io.netty.handler.codec.http.HttpResponseStatus.OK
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.BodyInserters.fromValue
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.ServerResponse.ok
import pl.okrzei41b.DeploymentConfig
import reactor.core.publisher.Mono

@Component
class HealthHandler(private val deploymentConfig: DeploymentConfig) {

    fun status(request: ServerRequest): Mono<ServerResponse> =
        ok().body(
            fromValue(
                Status(
                    code = OK.code(),
                    status = OK.reasonPhrase(),
                    commit = deploymentConfig.commitNumber
                )
            )
        )
}

data class Status(val code: Int, val status: String, val commit: String)