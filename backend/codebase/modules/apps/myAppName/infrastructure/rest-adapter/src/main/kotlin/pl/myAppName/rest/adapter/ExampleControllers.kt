package pl.myAppName.rest.adapter

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/user")
class UserController {

    @GetMapping
    fun getData(): Mono<String> {
        return Mono.just("Data for user")
    }
}

@RestController
@RequestMapping("/moderator")
class ModeratorController {

    @GetMapping
    fun getData(): Mono<String> {
        return Mono.just("Data for moderator")
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
