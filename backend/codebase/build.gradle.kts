val kotlinVersion: String by project
val kotlinVersionForDetekt: String by project
val jvmVersion: String by project
val projectGroup: String by project
val projectVersion: String by project
val detektVersion: String by project
val springBootVersion: String by project
val springDependencyManagementVersion: String by project

plugins {
    kotlin("jvm") version "1.9.22" apply true
    id("org.springframework.boot") version "3.2.3" apply false
    id("io.spring.dependency-management") version "1.1.4" apply true
    id("org.jetbrains.kotlin.plugin.spring") version "1.9.22" apply true
    id("io.gitlab.arturbosch.detekt") version "1.23.5" apply true
}
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath("com.fasterxml.jackson.dataformat:jackson-dataformat-yaml") {
            version { strictly("2.14.2") }
        }
    }
}

allprojects {
    group = projectGroup
    version = projectVersion

    repositories {
        mavenLocal()
        mavenCentral()
        maven("https://plugins.gradle.org/m2/")
        maven("https://repo.spring.io/milestone")
        maven("https://repo.spring.io/snapshot")
    }

    configurations {
        all {
            exclude(module = "android-json", group = "com.vaadin.external.google")
        }
    }

}
subprojects {
    apply(plugin = "io.gitlab.arturbosch.detekt")
    apply(plugin = "org.jetbrains.kotlin.jvm")
    apply(plugin = "org.jetbrains.kotlin.plugin.spring")
    apply(plugin = "io.spring.dependency-management")


    tasks.withType<Test> {
        useJUnitPlatform()

        systemProperty("junit.jupiter.extensions.autodetection.enabled", true)
    }

    kotlin {
        jvmToolchain(jvmVersion.toInt())
    }

    apply(plugin = "io.spring.dependency-management")
    
    configure<io.spring.gradle.dependencymanagement.dsl.DependencyManagementExtension> {
        imports {
            mavenBom(org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES) {
                bomProperty("kotlin.version", kotlinVersion)
            }
        }
    }
    // use other kotlin version for detekt plugin
    configurations.matching { it.name == "detekt" }.all {
        resolutionStrategy.eachDependency {
            if (requested.group == "org.jetbrains.kotlin") {
                useVersion(kotlinVersionForDetekt)
            }
        }
    }
    detekt {
        config = files("${rootDir}/detekt/detekt-config.yml")
        baseline = file("${rootDir}/detekt/detekt-baseline.xml")
        source = files("${projectDir}/src/main/kotlin")
    }
    
    tasks.withType<io.gitlab.arturbosch.detekt.Detekt> {
        reports {
            html.required.set(true)
            xml.required.set(true)
            txt.required.set(true)
            sarif.required.set(true)
            md.required.set(true)
            reportsDir.set(file("${rootDir}/detekt/generated-reports/detekt-report"))
        }
    }
    tasks.withType<io.gitlab.arturbosch.detekt.Detekt> {
        exclude(
            ".*/resources/.*,.*/tmp/.*",
            "**/generated/**"
        )
        jvmTarget = jvmVersion
        classpath.setFrom(project.configurations.getByName("detekt"))
    }
    dependencies {
        implementation("io.github.microutils:kotlin-logging:${project.property("kotlinLoggingVersion")}") {
            exclude("org.jetbrains.kotlin")
        }
    }
}