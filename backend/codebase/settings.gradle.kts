pluginManagement {
    val kotlinVersion: String by settings
    val springBootVersion: String by settings
    val springDependencyManagementVersion: String by settings
    val detektVersion: String by settings
    val sonarqubeVersion: String by settings

    plugins {
        kotlin("jvm") version kotlinVersion apply false
        id("org.springframework.boot") version springBootVersion apply false
        id("io.spring.dependency-management") version springDependencyManagementVersion apply false
        id("org.jetbrains.kotlin.plugin.spring") version kotlinVersion apply false
        id("io.gitlab.arturbosch.detekt") version detektVersion apply false
    }

    repositories {
        maven { url = uri("https://repo.spring.io/milestone") }
        maven { url = uri("https://repo.spring.io/snapshot") }
        gradlePluginPortal()
    }
    resolutionStrategy {
        eachPlugin {
            if (requested.id.id == "org.springframework.boot") {
                useModule("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
            }
        }
    }
}

rootProject.name = "okrzei41b-backend"
rootProject.buildFileName = "build.gradle.kts"


include("modules:config")
include("modules:deployment")
include("modules:utilities:commons")
include("modules:utilities:commons-test")

include("modules:apps:okrzei41b-backend:application")
include("modules:apps:okrzei41b-backend:assembly")
include("modules:apps:okrzei41b-backend:domain")
include("modules:apps:okrzei41b-backend:infrastructure")
include("modules:apps:okrzei41b-backend:infrastructure:rest-adapter")
include("modules:apps:okrzei41b-backend:openapi-specification")

include("modules:apps:login")