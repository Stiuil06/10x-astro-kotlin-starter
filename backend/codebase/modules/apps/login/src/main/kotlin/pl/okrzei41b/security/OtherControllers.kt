package pl.okrzei41b.security

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/mieszkaniec")
class MieszkaniecController {

    @GetMapping
    fun getData(): Mono<String> {
        return Mono.just("Data for mieszkaniec")
    }
}

@RestController
@RequestMapping("/zarzad")
class ZarzadController {

    @GetMapping
    fun getData(): Mono<String> {
        return Mono.just("Data for zarząd")
    }
}

@RestController
@RequestMapping("/administrator")
class AdministratorController {

    @GetMapping
    fun getData(): Mono<String> {
        return Mono.just("Data for administrator")
    }
}
