# FAQ

FAQ で解決できない質問がありますか？ [Github discussions](https://github.com/soil-kt/soil/discussions) の質問スレッドで気軽にコメントしてください。

## General

> **Soil という名前の意味は？**

Wasm に対応した Kotlin Multiplatform ライブラリを調べていくと、[ktor](https://github.com/ktorio/ktor), [koin](https://github.com/InsertKoinIO/koin), [coil](https://github.com/coil-kt/coil), [haze](https://github.com/chrisbanes/haze), つまり…分かるね？ :full_moon_with_face:

<br/>

> **1.0.0 までに計画しているものは？**

コードベースでの追加機能はあまり考えていません。
残りの主な作業は、パフォーマンスの改善やテストコードによる安定性の確保、ドキュメントの拡充になります。

## Feature

> **Android プロジェクトの Jetpack Compose でも使える？**

もちろん、使えます。同じパッケージを依存関係として追加してください。

<br/>

> **Query, Form, Space で今後計画しているものは？**

今後取り組んでいきたいこと：

Query

- Queryバリエーションを増やす（前後へのページネーション用Queryなど） 
- [TanStack Query Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools) のような内部状態を把握できる補助ツール

Form

- [React Hook Form](https://react-hook-form.com/form-builder) の Form Builder のような雛形の自動生成ツール


Space

- Multiplatform 向けの [Jetpack Navigation](https://github.com/JetBrains/compose-multiplatform/issues/85) との連携


Other

- 実用的なアプリケーションへの実装

