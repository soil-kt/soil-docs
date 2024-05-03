# Getting Started

## Try It Online

Soil の Kotlin Multiplatform ライブラリは、実験的な [Kotlin Wasm](https://kotlinlang.org/docs/wasm-overview.html) をサポートしています。
ご利用のブラウザが [WasmGC](https://github.com/WebAssembly/gc) に対応しているなら、そのままブラウザ上でサンプルアプリを動かすことができます。

:point_right: [Sample App](https://play.soil-kt.com/)

Source code: <https://github.com/soil-kt/soil/tree/main/sample/>

::: info ブラウザの WasmGC 対応状況について
現在、WasmGC に対応しているブラウザは Chrome と Firefox のみです。
最新の対応状況は https://webassembly.org/features/ を確認してください。
:::


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
    val soil = "1.0.0-alpha01"
    implementation("com.soil-kt.soil:query-core:$soil")
    implementation("com.soil-kt.soil:query-compose:$soil")
    implementation("com.soil-kt.soil:query-compose-runtime:$soil")
    implementation("com.soil-kt.soil:form:$soil")
    implementation("com.soil-kt.soil:space:$soil")
}
```

```yaml [Version Catalog]
[versions]
soil = "1.0.0-alpha01"

[libraries]
soil-query-core = { module = "com.soil-kt.soil:query-core", version.ref = "soil" }
soil-query-compose = { module = "com.soil-kt.soil:query-compose", version.ref = "soil" }
soil-query-compose-runtime = { module = "com.soil-kt.soil:query-compose-runtime", version.ref = "soil" }
soil-form = { module = "com.soil-kt.soil:form", version.ref = "soil" }
soil-space = { module = "com.soil-kt.soil:space", version.ref = "soil" }
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

