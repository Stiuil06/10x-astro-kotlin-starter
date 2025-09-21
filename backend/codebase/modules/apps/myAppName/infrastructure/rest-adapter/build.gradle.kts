dependencies {

    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation(project(":modules:apps:login"))
    implementation(project(":modules:apps:myAppName:openapi-specification"))
}
