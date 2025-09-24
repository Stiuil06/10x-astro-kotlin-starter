import org.openapitools.generator.gradle.plugin.tasks.GenerateTask

plugins {
    kotlin("jvm")
    id("org.openapi.generator") version "7.2.0"
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.16.0")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.16.0")
    implementation("jakarta.validation:jakarta.validation-api:3.0.2")
    implementation("jakarta.annotation:jakarta.annotation-api:2.1.1")
    implementation("io.swagger.core.v3:swagger-annotations:2.2.21")
}

val globalPropertiesMap = mapOf(
    "models" to "",
    "modelDocs" to "false",
    "useJakartaEe" to "true"
)
val typeMappingsMap = mapOf(
    "DateTime" to "OffsetDateTime",
    "double" to "BigDecimal",
    "Day" to "DayOfWeek"
)
val importMappingsMap = mapOf(
    "OffsetDateTime" to "java.time.OffsetDateTime",
    "BigDecimal" to "java.math.BigDecimal",
    "DayOfWeek" to "java.time.DayOfWeek"
)
val configOptionsMap = mapOf(
    "enumPropertyNaming" to "UPPERCASE",
    "generateApis" to "true",
    "generateApiTests" to "false",
    "generateModels" to "true",
    "generateModelTests" to "false",
    "useSpringBoot3" to "true"
)

tasks.withType<GenerateTask> {
    generatorName.set("kotlin-spring")
    inputSpec.set("${project.projectDir}/../../../../../../contracts/openapi.yaml")
    outputDir.set("${project.projectDir}/")
    generateAliasAsModel.set(true)
    modelNameSuffix.set("View")
    globalProperties.set(globalPropertiesMap)
    typeMappings.set(typeMappingsMap)
    importMappings.set(importMappingsMap)
    additionalProperties.set(mapOf("enumPropertyNaming" to "UPPERCASE"))
    configOptions.set(configOptionsMap)
    modelPackage.set("pl.okrzei41b.model")
    apiPackage.set("pl.okrzei41b.api")

}

tasks.compileKotlin {
    dependsOn("openApiGenerate")
}

tasks.detekt {
    dependsOn("openApiGenerate")
    // Wyłącz detekt dla wygenerowanych klas OpenAPI
    enabled = false
}
