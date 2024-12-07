# Hello, Space

Learn the basics of using Space.
If you haven't completed the [setup](/guide/getting-started.html#download) yet, please do so before proceeding.
This tutorial uses the *space* package.


## Step 1 - Atom

Space manages the state for each `Atom` instance.
First, you need to create an instance using the `atom` function.

```kotlin
val counter1Atom = atom(0, saverKey = "counter1")
val counter2Atom = atom(0, saverKey = "counter2")
```

::: tip
Specifying a `saverKey` is optional, but if you expect state restoration on the Android platform, it is crucial to specify it.
It's a good practice to prepare a mechanism to assign unique keys within the project.
:::


## Step 2 - AtomSelector

The `atom` function can also be used to create an `AtomSelector` which derived values from other `Atom` instances.
The following code updates the value whenever either `counter1Atom` or `counter2Atom` changes.

```kotlin
val sumAtom = atom {
    get(counter1Atom) + get(counter2Atom)
}
```

::: info
There is no `saverKey` for `AtomSelector`. If the base values are restored correctly, the derived values should also be restorable.
:::


## Step 3 - AtomRoot

When using the instances defined in Step 1 and Step 2 as state values within a Composable function,
you need to define an `AtomRoot` somewhere in the parent tree.

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

Instances of `Atom` and `AtomSelector` defined in Steps 1 and 2 are merely state keys with initial values or derived blocks.
Within a Composable function, Space provides a Remember API to handle the current state value through `MutableState<T>`.

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
Use the Remember API as follows: instances of `AtomSelector` are always read-only as they are derived blocks.

- State values that can be read and written - `rememberAtomState`
- Read-only state values - `rememberAtomValue`
:::


## Step 5 - AtomScope

It is possible to set a scope concept called `AtomScope` for `Atom` defined in Step 1. Each instance manages its scope.

```kotlin
val navGraphScope = atomScope()
val screenScope = atomScope()

val counter1Atom = atom(0, saverKey = "counter1", screenScope)
val counter2Atom = atom(0, saverKey = "counter2", navGraphScope)
```

In Step 3, only one `AtomStore` was specified as an argument for `AtomRoot`.
Multiple `AtomStore` and a `fallbackScope` can also be passed as variations of arguments for `AtomRoot`.

The following code is an example managing state with two different scopes that depend on the `NavBackStackEntry` of the navigation library [androidx.Navigation](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation-routing.html) used in the sample app:

- currentScreen: Saves the state using the `BackStackEntry` of the current screen
- navScreen: Saves the state using the `BackStackEntry` of the root screen

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

By specifying a scope for `Atom` as needed, you can adjust the lifespan of the state for each `Atom` instance.
There are various types of states you might want to represent in the UI, from internal component states to user interaction-driven display elements and system-driven states.
Managing all these states within a single scope can be a strict constraint from an implementation perspective, so we provide flexible customization options including fallback behavior.


## Finish :checkered_flag:

Have you understood the basics of using Space? This concludes the tutorial :confetti_ball:

If you wish to continue learning, it would be a good idea to try running the `SpaceScreen` found in the [sample](https://github.com/soil-kt/soil/tree/1.0.0-alpha09/sample/) code.
If you have any concerns, please feel free to provide feedback on [Github discussions](https://github.com/soil-kt/soil/discussions).

Love the project? :star: it on [GitHub](https://github.com/soil-kt/soil) and help us make it even better!
