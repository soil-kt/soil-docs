# FAQ

Have a question that isn't part of the FAQ?
Feel free to drop them in the [Github discussions](https://github.com/soil-kt/soil/discussions) thread.

## General

> **What does the name "Soil" mean?**

As you explore Kotlin Multiplatform libraries supporting Wasm, 
you'll come across names like [ktor], [koin], [coil], [haze]... get the drift? :full_moon_with_face:

<br/>

> **What's planned up until version 1.0.0?**

We're not really thinking about adding more features to the codebase. 
The main tasks left are improving performance, ensuring stability through testing, and beefing up the documentation.

## Feature

> **Can I use it with Jetpack Compose in my Android project?**

Yep, just add the same package as a dependency.

<br/>

> **What are the future plans?**

Here's what we're excited to work on:

Query

- Increase query variations (like pagination queries for previous and next pages)
- Introspection tools to understand internal states, similar to [TanStack Query Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools)

Form

- An automatic form builder tool similar to [React Hook Form's Form Builder](https://react-hook-form.com/form-builder)

Space

- Integration with [Jetpack Navigation for Multiplatform](https://github.com/JetBrains/compose-multiplatform/issues/85)

Other

- Implementations in practical applications

[ktor]: https://github.com/ktorio/ktor
[koin]: https://github.com/InsertKoinIO/koin
[coil]: https://github.com/coil-kt/coil
[haze]: https://github.com/chrisbanes/haze
