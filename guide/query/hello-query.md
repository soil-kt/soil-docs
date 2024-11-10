# Hello, Query

Learn the basics of using Query.
If you haven't completed the [setup](/guide/getting-started.html#download) yet, please do so before proceeding.

## Step 1 - SwrClientProvider

When using Query, it is necessary to define `SwrClientProvider` within the Composable.
The `SwrClient` specified here should ideally be a single instance shared across the application.

```kotlin
// Minimal default settings
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
It is possible to create multiple SwrClients and use them separately for different screens, 
but since data fetching and cache management, among many other features, are handled at this client level, it is not recommended.
:::

## Step 2 - QueryKey

To execute asynchronous data processing through Query, defining a Key is necessary.
Here, let's create a Key that simulates an API and returns the string `Hello, Query!` as a result after 2 seconds.

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
There are currently three types of Keys:

- `QueryKey<T>`
- `InfiniteQueryKey<T, S>`
- `MutationKey<T, S>`
:::

## Step 3 - Remember API

Now that you are prepared to execute the Key within the Composable, let's run it and display the result.
Query provides APIs named `rememberXxx` for each type of Key.

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

Did it display `Hello, Query!` 2 seconds after execution? Congratulations :tada: <br/>
The return value of the Remember API is a sealed class, so you can determine the query state.


## Step 4 - Compose Runtime

In the previous step, we manually handled the query state, 
but now let's introduce the query.compose.runtime package, which is Compose-first.

``` kotlin
@Composable
fun App() {
    SwrClientProvider(client = swrClient) {
        MaterialTheme {
            ErrorBoundary(fallback = { Text("Error :(") }) {
                Suspense(fallback = { Text("Loading...") }) {
                    val key = remember { HelloQueryKey() }
                    val query = rememberQuery(key)
                    Await(query) { result ->
                        Text(result)
                    }
                    Catch(query) { e ->
                        // Custom error handling
                        // if (e is MyCustomError) {
                        //    ...
                        // }
                        Throw(e)
                    }
                }
            }
        }
    }
}
```

This setup allows for flexible control over multiple query states on a component basis, 
and commonalizes error and loading control on higher components within the screen.

::: tip
Internally, the following components collaborate automatically to control according to the query states below:

- `Suspense <- Await#1(query1, query2, ..), Await#2(query1, query2, ..)`
- `ErrorBoundary <- Catch#1(query1, query2, ..), Catch#2(query1, query2, ..)`
:::


## Step 5 - QueryReceiver

In Step 2, we defined a Key and directly wrote the return value within the `fetch` function block. 
However, Query itself does not have an interface for fetching remote data. 
Therefore, practical code needs to refer to external instances like an HTTP client.

There are three ways to refer to external instances within the `fetch` block:

1. Use QueryReceiver
2. Pass as a constructor argument when generating the Key
3. Manage Key generation through DI (e.g. [Assisted injection](https://dagger.dev/dev-guide/assisted-injection.html) with Dagger Hilt for Android platform)

Here, let's use `QueryReceiver` which can be passed only during the generation of `SwrClient` as one of the options of `SwrCachePolicy`.

```kotlin
class KtorReceiver(
    val client: HttpClient
) : QueryReceiver

private val swrClient = SwrCache(
    policy = SwrCachePolicy(
        coroutineScope = SwrCacheScope(),
        queryReceiver = KtorReceiver(client = createHttpClient())
    )
)
```

Inside Query, the `fetch` function block is invoked as [Extension functions](https://kotlinlang.org/docs/extensions.html#extension-functions) of `QueryReceiver`.
Therefore, a type conversion to the intended receiver type is necessary within the `fetch` function block.

```kotlin
class HelloQueryKey : QueryKey<String> by buildQueryKey(
    id = QueryId("demo/hello-query"),
    fetch = {
        this as KtorReceiver
        client.get("https://httpbin.org/headers").bodyAsText()
    }
)
```

## Step 6 - QueryOptions

The data fetched by Query is briefly mentioned in [What is Soil?](/guide/what-is-soil.md), and is managed through a stale-while-revalidate mechanism for refetching and caching.
Settings that can be adjusted for the entire `SwrClient` or for each Key are included in `QueryOptions`.

```kotlin
// Query Options applied to the entire instance
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

// Query Options applied to individual Keys
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

The key settings in `QueryOptions` are as follows:

- **staleTime** - The duration after which the returned value of the `fetch` function block is considered stale
- **gcTime** - The period during which the Key's return value, if not referenced anywhere, is temporarily cached in memory
- **keepAliveTime** - The temporary measure to keep the state active once it's no longer referenced anywhere


## Finish :checkered_flag:

Have you understood the basics of using Query? This concludes the tutorial :confetti_ball:

If you wish to continue learning, it would be a good idea to try running the `QueryScreen` found in the [sample](https://github.com/soil-kt/soil/tree/1.0.0-alpha07/sample/) code.
If you have any concerns, please feel free to provide feedback on [Github discussions](https://github.com/soil-kt/soil/discussions).

Love the project? :star: it on [GitHub](https://github.com/soil-kt/soil) and help us make it even better!
