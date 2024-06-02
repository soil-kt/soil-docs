# Hello, Space

Space の基本的な使い方を身につけましょう。
[セットアップ](/ja/guide/getting-started.html#download) がまだ完了していない場合は事前に実施してください。

## Step 1 - Atom

Space は、 `Atom` のインスタンスごとに状態を管理します。まず、`atom` 関数を利用してインスタンスを作成しておく必要があります。

```kotlin
val counter1Atom = atom(0, saverKey = "counter1")
val counter2Atom = atom(0, saverKey = "counter2")
```

::: tip
`saverKey` の指定は任意ですが、Androidプラットフォーム向けの状態復元を期待している場合は必ず指定してください。
プロジェクト内で一意なキーを割り当てる仕組みを準備しておくとよいでしょう。
:::


## Step 2 - AtomSelector

`atom` 関数は、他の `Atom` インスタンスから派生して値を作る `AtomSelector` を作ることもできます。
次コードは、 先ほど定義した `counter1Atom` と `counter2Atom` のいずれかの値が変化したら、関数ブロックを呼び出して値を更新します。

```kotlin
val sumAtom = atom {
    get(counter1Atom) + get(counter2Atom)
}
```

::: info
`AtomSelector` には `saverKey` は存在しません。派生元の値が正しく復元できていれば、派生した値も復元できるはずです。
:::


## Step 3 - AtomRoot

Step 1と2で定義したインスタンスを Composable 関数内で状態値として利用する場合、親ツリーのどこかに `AtomRoot` を定義する必要があります。

```kotlin
@Composable
fun App() {
    AtomRoot(store = rememberSaveableStore()) {
        MaterialTheme {
            // ...
        }
    }
}
```


## Step 4 - AtomState/AtomValue

Step 1と2で定義した `Atom` や `AtomSelector` のインスタンスは、初期値や派生ブロックをもった状態キーに過ぎません。
Composable 関数内では、Space が用意している Remember API を通じて `MutableState<T>` を取得することで、現在の状態値を扱うことができます。

```kotlin
@Composable
fun App() {
    AtomRoot(store = rememberSaveableStore()) {
        MaterialTheme {
            var counter1 by rememberAtomState(counter1Atom)
            var counter2 by rememberAtomState(counter2Atom)
            val sum by rememberAtomValue(sumAtom)
            Column {
                Button(onClick = { counter1++ }) {
                    Text("Counter1: $counter1")
                }
                Button(onClick = { counter2++ }) {
                    Text("Counter2: $counter2")
                }
                Text("$counter1 + $counter2 = $sum")
            }

        }
    }
}
```

::: info
Remember APIは、次のように使い分けます。`AtomSelector` のインスタンスは派生ブロックになるので必ず読み取り専用になります。

- 読み書きできる状態値 - `rememberAtomState`
- 読み取り専用の状態値 - `rememberAtomValue`
:::


## Step 5 - AtomScope

Step 1で定義した `Atom` には `AtomScope` というスコープの概念を設定しておくことが可能です。
こちらもインスタンスごとにスコープを管理する仕組みになっています。

```kotlin
val navGraphScope = atomScope()
val screenScope = atomScope()

val counter1Atom = atom(0, saverKey = "counter1", screenScope)
val counter2Atom = atom(0, saverKey = "counter2", navGraphScope)
```

Step 3で定義した `AtomRoot` には1つの `AtomStore` のみを引数に指定していました。
`AtomRoot` の引数バリエーションとして複数の `AtomStore` と `fallbackScope` を渡すことも可能です。

次のコードはサンプルアプリに利用しているナビゲーションライブラリ [androidx.Navigation](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation-routing.html) の `NavBackStackEntry` に依存した2種類のスコープで状態を管理している例です。

- currentScreen: 現在の画面のBackStackEntryを利用して状態を保存する
- navScreen: ルート画面のBackStackEntryを利用して状態を保存する

```kotlin
// sample - space:
@Composable
fun HelloSpaceScreen(
    navStore: AtomStore
) {
    AtomRoot(
        currentScreen to rememberViewModelStore(),
        navScreen to navStore,
        fallbackScope = { currentScreen }
        // If fallbackScope is set to navScreen, the value of Counter is preserved even if it navigates back and then forward again.
        // fallbackScope = { navScreen }
    ) {
        HelloSpaceContent(
            modifier = Modifier.fillMaxSize()
        )
    }
}
```

必要に応じて `Atom` にスコープを指定しておくことで、状態の生存範囲を `Atom` インスタンスごとに調整できます。
UI上で表現したい状態には、コンポーネントの内部状態からユーザ操作に起因する表示要素の状態、システム起因の状態など様々なものがあります。
これらの状態を常に1つのスコープのみで扱うのは実装観点で厳しい制約となってしまうため、フォールバックの挙動を含めて柔軟なカスタマイズの選択肢を提供しています。


## Finish :checkered_flag:

Space の基本的な使い方は理解できましたか？ これでチュートリアルは完了です :confetti_ball:

学習を続けたい場合は、[sample](https://github.com/soil-kt/soil/tree/1.0.0-alpha02/sample/) コード内の `SpaceScreen` を動かしてみるのがよいでしょう。
ぜひ、試して気になるところがあれば [Github discussions](https://github.com/soil-kt/soil/discussions) にフィードバックをお寄せください。

Soil プロジェクトに興味がありますか？<br/>
[GitHub](https://github.com/soil-kt/soil) で :star: を付けてもらえると今後の励みになります！

