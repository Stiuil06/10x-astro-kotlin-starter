package pl.okrzei41b

import mu.KotlinLogging
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

private val log = KotlinLogging.logger {}

@SpringBootApplication
class Application

@Suppress("SpreadOperator")
fun main(args: Array<String>) {
//    Schedulers.enableMetrics()
    runApplication<Application>(*args).let { context ->
//        ReactorDebugAgent.init()
//        Hooks.enableAutomaticContextPropagation()
        val deploymentConfig = context.getBean(DeploymentConfig::class.java)
        log.info { "okrzei41b-backend Starting" }
        log.info { "Commit: ${deploymentConfig.commitNumber}" }
        log.info { context.beanDefinitionNames.sorted() }
    }
}