# Getting Started

## Try It Online

Soil の Kotlin Multiplatform ライブラリは、実験的な [Kotlin Wasm](https://kotlinlang.org/docs/wasm-overview.html) をサポートしています。
ご利用のブラウザが [WasmGC](https://github.com/WebAssembly/gc) に対応しているなら、そのままブラウザ上でサンプルアプリを動かすことができます。

:point_right: [Sample App](https://play.soil-kt.com/)

Source code: <https://github.com/soil-kt/soil/tree/1.0.0-alpha15/sample/>


## Download

1. Kotlin Multiplatform プロジェクトまたは Android プロジェクトを用意する

::: tip おすすめ
新規に Kotlin Multiplatform プロジェクトを作成して試すなら、[Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/) や [Compose Multiplatform Wizard](https://terrakok.github.io/Compose-Multiplatform-Wizard/) が役立ちます。
:::

2. Maven Central をリポジトリに追加する

```kts{2}
repositories {
    mavenCentral()
}
```

3. ライブラリパッケージの依存関係をモジュールの build.gradle ファイルに追加する

::: code-group

```kts [Dependencies]
dependencies {
    val soil = "1.0.0-alpha15"

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
soil = "1.0.0-alpha15"

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

対応しているターゲット:

- Android
- iOS
- Desktop (JVM)
- Web (Wasm)


## What's Next?

気になる機能をさっそく使ってみましょう！

:seedling: [Query](./query/hello-query) - 宣言的なデータ取得とキャッシュ機構を提供する

:seedling: [Form](./form/hello-form) - フォームの状態管理と拡張性に優れたバリデーション機構を提供する

:seedling: [Space](./space/hello-space) - 柔軟なスコープレベルの状態管理機能を提供する

<br/>

Soil プロジェクトに興味がありますか？<br/>
[GitHub](https://github.com/soil-kt/soil) で :star: を付けてもらえると今後の励みになります！

