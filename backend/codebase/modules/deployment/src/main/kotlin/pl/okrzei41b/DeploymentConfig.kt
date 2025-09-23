package pl.okrzei41b

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "application")
data class DeploymentConfig(
    var commitNumber: String = "",
    var environment: String = ""
)
