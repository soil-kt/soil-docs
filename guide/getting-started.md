# Getting Started

## Try It Online

The Soil library for Kotlin Multiplatform now includes experimental support for [Kotlin Wasm](https://kotlinlang.org/docs/wasm-overview.html). 
If your browser supports [WasmGC](https://github.com/WebAssembly/gc), you can run the sample app directly in the browser.

:point_right: [Sample App](https://play.soil-kt.com/)

Source code: <https://github.com/soil-kt/soil/tree/1.0.0-alpha04/sample/>

::: info Browser Support for WasmGC
Currently, the only browsers that support WasmGC are Chrome and Firefox. 
For the latest compatibility information, please visit https://webassembly.org/features/.
:::


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
    val soil = "1.0.0-alpha04"
    implementation("com.soil-kt.soil:query-core:$soil")
    implementation("com.soil-kt.soil:query-compose:$soil")
    implementation("com.soil-kt.soil:query-compose-runtime:$soil")
    implementation("com.soil-kt.soil:form:$soil")
    implementation("com.soil-kt.soil:space:$soil")
}
```

```yaml [Version Catalog]
[versions]
soil = "1.0.0-alpha04"

[libraries]
soil-query-core = { module = "com.soil-kt.soil:query-core", version.ref = "soil" }
soil-query-compose = { module = "com.soil-kt.soil:query-compose", version.ref = "soil" }
soil-query-compose-runtime = { module = "com.soil-kt.soil:query-compose-runtime", version.ref = "soil" }
soil-form = { module = "com.soil-kt.soil:form", version.ref = "soil" }
soil-space = { module = "com.soil-kt.soil:space", version.ref = "soil" }
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

