# What is Soil?

Soil は、一般的なユースケースの状態管理を簡素化し、開発をより加速するために設計された Compose Multiplatform ライブラリです。
一言で言えば、非同期のデータ管理、フォームのデータ入力と検証、要素間のデータ共有を Compose-first な方法でより簡単に実装できるようにサポートします。

## Motivation

長年、私は Android プラットフォーム向けのモバイルアプリケーションを開発してきました。
2016年、AAC (Android Architecture Components) が Google I/O で発表され、それ以降 ViewModel は Android のアプリ開発において欠かせないものになりました。(ViewModel ありがとう！)
2021年、ネイティブ UI を構築するための Google の最新ツールキット Jetpack Compose 1.0 がリリースされ、React や SwiftUI と同じく宣言的 UI パラダイムをもたらしました。
2024年、ViewModel は Jetpack Compose を採用した開発でも一般的に広く利用されています。 

- [Compose UI Architecture](https://developer.android.com/develop/ui/compose/architecture)
- [Architecture Learning Journey - Now in Android App](https://github.com/android/nowinandroid/blob/main/docs/ArchitectureLearningJourney.md)

ViewModel は、慣習的にリモートからデータを取得する画面では必ずセットで用意することになります。
みなさん、宣言的 UI 上でもっと手軽にデータ取得処理が書ける Compose-first な選択肢がほしいと思ったことはありませんか？

私のこれまでの経験上、全画面のうち7-8割ぐらいは API から取得したデータに対して何かアクションをするシンプルな画面要素になることが多いです。
このような単純な画面に対して、もっと Compose-first なコードで簡素化できないか？という疑問が生まれ、Soil ライブラリ開発の出発点となりました。

Jetpack Compose より数年先行して宣言的 UI で SPA (Single Page Application) を構築してきた React 界隈のベストプラクティスに着目しました。

- [State Management - bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/docs/state-management.md)

データ取得の観点から見ると、Server State と呼ばれている状態管理の概念をもち、アプリケーション全体で効率的にデータ状態を共有しています。
SWR というライブラリ名の由来にもなっている stale-while-revalidate 方式によるデータフェッチングとキャッシングが、Compose のまだ足りていないピースを埋められる優れた体験になると確信し、
このアプローチを Compose Multiplatform でも実現したいと思いました。

明確にしておきたいのは、決して「ViewModel が不要」と言いたいわけではありません。引き続き、ViewModel は役立ちます。
しかし、使いどころを少し見直すタイミングにきていると感じています。なにがなんでも ViewModel 上で UI 状態を管理するという考えは宣言的 UI と少し合ってないように感じています。
Compose の良さは Composable の中にあります。

Soil に興味をもってくれてありがとう！

[@ogaclejapan](https://github.com/ogaclejapan/)


## Acknowledgments

状態管理のアプローチについては、React界隈のベストプラクティスなツールから多くのインスピレーションを得ました。

Query

- [Tanstack Query](https://github.com/tanstack/query)
- [SWR](https://github.com/vercel/swr)
- [RTK Query](https://github.com/reduxjs/redux-toolkit/blob/master/docs/rtk-query/overview.md)

Form

- [React Hook Form](https://github.com/react-hook-form/react-hook-form)

Space

- [Recoil](https://github.com/facebookexperimental/Recoil)
- [Jotai](https://github.com/pmndrs/jotai)

