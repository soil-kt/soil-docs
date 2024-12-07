# Hello, Query

Query の基本的な使い方を身につけましょう。
[セットアップ](/ja/guide/getting-started.html#download) がまだ完了していない場合は事前に実施してください。
このチュートリアルでは、*query-core* と *query-compose* と *query-receivers-ktor* パッケージを使います。


## Step 1 - SwrClientProvider

Query を利用する場合には、必ず `SwrClientProvider` の定義が Composable 内に必要になります。
ここで指定する `SwrClient` は原則としてアプリケーション内で共有する1つのインスタンスとなるようにしてください。

```kotlin
// 最小のデフォルト設定
private val swrClient = SwrCache(SwrCacheScope())

@Composable
fun App() {
    SwrClientProvider(client = swrClient) {
        MaterialTheme {
            // ...
        }
    }
}
```

::: info
SwrClient を複数作成して、画面ごとに分けることも可能ですが、データフェッチングやキャッシュ管理、他多数の機能がこの Client 単位で行なわれますので、オススメはしません。
:::


## Step 2 - QueryKey

Query を通じて、非同期データ処理を実行するには Key の定義が必要になります。
ここでは、擬似的なAPIを想定して、2秒後に `Hello, Query!` の文字列を戻り値として返す Key を作成してみましょう。

```kotlin
class HelloQueryKey : QueryKey<String> by buildQueryKey(
    id = QueryId("demo/hello-query"),
    fetch = { // suspend block
        delay(2000)
        "Hello, Query!"
    }
)
```

::: tip
Key は現在3つのタイプが存在します。

- `QueryKey<T>`
- `InfiniteQueryKey<T, S>`
- `MutationKey<T, S>`

※SwrCacheの代わりに、実験的なSwrCachePlusを利用すると、もう1つのタイプが加わります。

- `SubscriptionKey<T>`

:::


## Step 3 - Remember API

これで、Composable 内で Key を実行する準備が整ったので、さっそく実行して結果を表示してみましょう。
Query には、 Key のタイプごとに `rememberXxx` という API が用意されています。

```kotlin
@Composable
fun App() {
    SwrClientProvider(client = swrClient) {
        MaterialTheme {
            val key = remember { HelloQueryKey() }
            when (val query = rememberQuery(key)) {
                is QuerySuccessObject -> Text(query.data)
                is QueryLoadingObject -> Text("Loading...")
                is QueryLoadingErrorObject,
                is QueryRefreshErrorObject -> Text("Error :(")
            }
        }
    }
}
```

実行から2秒後に、 `Hello, Query!` と表示されましたか？ おめでとう :tada: <br/>
Remember APIの戻り値は、sealed class なので query 状態を判断することが可能です。


## Step 4 - QueryReceiver

Step 2 で、Key を定義しましたが、 `fetch` 関数ブロック内で直接的に戻り値を書いていました。
Query 自体には、リモートデータを取得する I/F を持っていません。そのため、実用的なコードでは HTTP クライアントなど、外部インスタンスを参照する必要があります。

`fetch` ブロック内で外部インスタンスを参照する方法は3つあります。

1. QueryReceiver を使う
2. Key 生成時にコンストラクタ引数として渡す
3. DIでKeyの生成を管理する (e.g. Androidプラットフォーム限定ですが、Dagger Hilt なら [Assisted injection](https://dagger.dev/dev-guide/assisted-injection.html) )

ここでは、Composable 関数内から依存など気にせずに直接 Key 生成できる `QueryReceiver` を使います。
`QueryReceiver` は、Step 1 で指定した `SwrClient` の生成時にのみ渡すことができる `SwrCachePolicy` のオプションの1つです。

```kotlin
private val swrClient = SwrCache(
    policy = SwrCachePolicy(
        coroutineScope = SwrCacheScope(),
        queryReceiver = QueryReceiver { 
            httpClient = createHttpClient()
        }
    )
)
```

::: tip
httpClientは、*query-receivers-ktor* パッケージが提供するレシーバ型の拡張プロパティです。
`ContextPropertyKey` で独自の型を渡すためのインスタンスを生成し、拡張プロパティを定義することで任意のインスタンスをレシーバ型へ含めることが可能になります。
:::

Query 内部では、`QueryReceiver` の [Extension functions](https://kotlinlang.org/docs/extensions.html#extension-functions) として `fetch` 関数ブロックを呼び出します。 ここでは、`buildQueryKey` の代わりに `buildKtorQueryKey` を利用してみます。
すると `SwrCachePolicy` で渡したHttpClientインスタンスが `fetch` 関数ブロックのレシーバ型になりました。

```kotlin
class HelloQueryKey : QueryKey<String> by buildKtorQueryKey(
    id = QueryId("demo/hello-query"),
    fetch = { // HttpClient.() -> String
        get("https://httpbin.org/headers").bodyAsText()
    }
)
```

関数内で `QueryReceiver` がどのように処理されているか、*query-receivers-ktor* パッケージが提供する `buildKtorQueryKey` の関数定義を調べてみましょう。
この関数は、 `buildQueryKey` 関数をラップしたインライン関数として定義されています。
`QueryReceiver` から `httpClient` 拡張プロパティを参照し、`QueryReceiver` の代わりに `HttpClient` をレシーバ型にした `fetch` ブロックを提供しています。

```kotlin
inline fun <T> buildKtorQueryKey(
    id: QueryId<T>,
    crossinline fetch: suspend HttpClient.() -> T
): QueryKey<T> = buildQueryKey(
    id = id,
    fetch = {
        val client = checkNotNull(httpClient) { "httpClient isn't available. Did you forget to set it up?" }
        with(client) { fetch() }
    }
)
```

このように `QueryReceiver` を利用すると、独自の拡張プロパティ定義で柔軟に外部リソースクライアントのインスタンスを渡す仕組みを構築できます。


## Step 5 - QueryOptions

Queryの取得済みデータは、[What is Soil?](/ja/guide/what-is-soil.md) で少し触れていますが、 stale-while-revalidate の仕組みで再フェッチやキャッシングが行なわれています。
全体の `SwrClient` または各 Key で調整できる設定値が `QueryOptions` に含まれています。

```kotlin
// 全体に適用する Query Options
private val swrClient = SwrCache(
    policy = SwrCachePolicy(
        coroutineScope = SwrCacheScope(),
        queryOptions = QueryOptions(
            staleTime = Duration.ZERO,
            gcTime = 5.minutes,
            keepAliveTime = 5.seconds,
            // ..
        )
    )
)

// Key に適用する Query Options
class HelloQueryKey : QueryKey<String> by buildQueryKey(
    id = QueryId("demo/hello-query"),
    fetch = { /* .. */ },
) {
    override fun onConfigureOptions(): QueryOptionsOverride = {
        it.copy(
            staleTime = Duration.ZERO,
            gcTime = 5.minutes,
            keepAliveTime = 5.seconds,
            // ..
        )
    }
}
```

`QueryOptions` の重要な設定値は、以下の3つです。

- **staleTime** - `fetch` 関数ブロックを正常終了した戻り値を *stale* と見なすまでの経過期間
- **gcTime** - Key の戻り値がどこからも参照がない *inactive* 状態になると保持期間の間はメモリキャッシュへ一時待避される
- **keepAliveTime** - どこからも参照がなくなったときに一定時間 *active* 状態をキープするための維持期間


## Finish :checkered_flag:

Query の基本的な使い方は理解できましたか？ これでチュートリアルは完了です :confetti_ball:

学習を続けたい場合は、[sample](https://github.com/soil-kt/soil/tree/1.0.0-alpha09/sample/) コード内の `QueryScreen` を動かしてみるのがよいでしょう。
ぜひ、試して気になるところがあれば [Github discussions](https://github.com/soil-kt/soil/discussions) にフィードバックをお寄せください。

Soil プロジェクトに興味がありますか？<br/>
[GitHub](https://github.com/soil-kt/soil) で :star: を付けてもらえると今後の励みになります！
