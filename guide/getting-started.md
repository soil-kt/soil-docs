# Getting Started

## Try It Online

The Soil library for Kotlin Multiplatform now includes experimental support for [Kotlin Wasm](https://kotlinlang.org/docs/wasm-overview.html). 
If your browser supports [WasmGC](https://github.com/WebAssembly/gc), you can run the sample app directly in the browser.

:point_right: [Sample App](https://play.soil-kt.com/)

Source code: <https://github.com/soil-kt/soil/tree/1.0.0-alpha13/sample/>


## Download

1. Prepare a Kotlin Multiplatform project or an Android project

::: tip Recommendation
If you are starting a new Kotlin Multiplatform project, 
tools like the [Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/) or the [Compose Multiplatform Wizard](https://terrakok.github.io/Compose-Multiplatform-Wizard/) can be very helpful.
:::

2. Add Maven Central to your repositories if needed

```kts{2}
repositories {
    mavenCentral()
}
```

3. Add the desired dependencies to your module's build.gradle file

::: code-group

```kts [Dependencies]
dependencies {
    val soil = "1.0.0-alpha13"

    // Query
    implementation("com.soil-kt.soil:query-core:$soil")
    // Query for Compose
    implementation("com.soil-kt.soil:query-compose:$soil")
    // optional - receivers for Ktor (3.x)
    implementation("com.soil-kt.soil:query-receivers-ktor:$soil")
    // optional - Test helpers
    testImplementation("com.soil-kt.soil:query-test:$soil")

    // Form
    implementation("com.soil-kt.soil:form:$soil")

    // Space
    implementation("com.soil-kt.soil:space:$soil")

    // Experimental
    implementation("com.soil-kt.soil:lazyload:$soil")
    implementation("com.soil-kt.soil:optimistic-update:$soil")
    implementation("com.soil-kt.soil:reacty:$soil")
}
```

```yaml [Version Catalog]
[versions]
soil = "1.0.0-alpha13"

[libraries]
# Query
soil-query-core = { module = "com.soil-kt.soil:query-core", version.ref = "soil" }
# Query for Compose
soil-query-compose = { module = "com.soil-kt.soil:query-compose", version.ref = "soil" }
# optional - receivers for Ktor (3.x)
soil-query-receivers-ktor = { module = "com.soil-kt.soil:query-receivers-ktor", version.ref = "soil" }
# optional - Test helpers
soil-query-test = { module = "com.soil-kt.soil:query-test", version.ref = "soil" }
# Form
soil-form = { module = "com.soil-kt.soil:form", version.ref = "soil" }
# Space
soil-space = { module = "com.soil-kt.soil:space", version.ref = "soil" }
# Experimental
soil-lazyload = { module = "com.soil-kt.soil:lazyload", version.ref = "soil" }
soil-optimistic-update = { module = "com.soil-kt.soil:optimistic-update", version.ref = "soil" }
soil-reacty = { module = "com.soil-kt.soil:reacty", version.ref = "soil" }
```

:::


### Compose Multiplatform compatibility

Supported targets:

- Android
- iOS
- Desktop (JVM)
- Web (Wasm)


## What's Next?

Try out the features you're interested in right away!

:seedling: [Query](./query/hello-query) - A seamless data fetching and caching. written more declaratively, leading to more readable code.

:seedling: [Form](./form/hello-form) - A extensible validation control and form state management. minimizes the impact of re-composition.

:seedling: [Space](./space/hello-space) - A flexible scoped state management. collaborating with the navigation library to create new scopes.

Love the project? :star: it on [GitHub](https://github.com/soil-kt/soil) and help us make it even better!

