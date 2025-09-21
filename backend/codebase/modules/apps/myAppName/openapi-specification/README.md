# OpenAPI Specification Module

Ten moduł odpowiada za automatyczne generowanie klas Kotlin z specyfikacji OpenAPI. Zapewnia type safety i spójność między kontraktem API a implementacją backend.

## Jak to działa

1. **Źródło**: Specyfikacja OpenAPI jest czytana z `/contracts/openapi.yaml`
2. **Generator**: Używa generatora `kotlin-spring` do tworzenia klas kompatybilnych ze Spring Boot
3. **Wyjście**: Wygenerowane klasy są umieszczane w `src/main/kotlin/pl/myAppName/model/` z sufiksem "View"
4. **Konfiguracja**: Zarządzana w `build.gradle.kts`

## Regenerowanie klas

Po aktualizacji specyfikacji OpenAPI uruchom:

```bash
cd backend/codebase
./gradlew :modules:apps:myAppName:openapi-specification:openApiGenerate
```

## Wygenerowane klasy

Generator tworzy:
- **Klasy modeli**: Data classes z adnotacjami Jackson i Jakarta Validation
- **Klasy API**: Kontrolery Spring Boot i interfejsy serwisów (gdy włączone)
- **Infrastruktura**: Serializacja, walidacja i narzędzia klienta HTTP

## Konfiguracja

Generowanie jest skonfigurowane z:
- **Generator**: `kotlin-spring` dla kompatybilności ze Spring Boot
- **Pakiet**: `pl.myAppName.model` dla wygenerowanych modeli
- **Sufiks**: "View" dodawany do wszystkich nazw klas modeli
- **Walidacja**: Adnotacje Jakarta Validation włączone
- **Serializacja**: Adnotacje Jackson dla obsługi JSON

## Workflow

1. Zaktualizuj `/contracts/openapi.yaml` o nowe endpointy lub schematy
2. Uruchom polecenie generowania powyżej
3. Przejrzyj wygenerowane klasy w `src/main/kotlin/pl/myAppName/model/`
4. Użyj wygenerowanych klas w kodzie aplikacji
5. Zaimplementuj kontrolery i serwisy używając wygenerowanych modeli

## Przykład wygenerowanej klasy

```kotlin
data class HelloResponseView(
    @Schema(example = "null", required = true, description = "The hello message")
    @get:JsonProperty("message", required = true) val message: kotlin.String
)
```

## Zależności

Moduł używa następujących zależności:
- `org.openapi.generator` - Plugin Gradle do generowania kodu
- `jackson-module-kotlin` - Serializacja JSON
- `jakarta.validation-api` - Walidacja danych
- `kotlin-stdlib` - Standardowa biblioteka Kotlin

## Uwagi

- Wygenerowane klasy mają sufiks "View" aby odróżnić je od klas domenowych
- Wszystkie klasy są immutable (data classes)
- Walidacja jest automatycznie dodawana do pól wymaganych
- Serializacja JSON jest obsługiwana przez Jackson
