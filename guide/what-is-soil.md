# What is Soil?

Soil is a Compose Multiplatform library designed to simplify state management for common use cases and accelerate development. 
In a nutshell, it supports easier implementation of asynchronous data management, form data entry and validation, and data sharing between elements in a Compose-first approach.

## Motivation

Over the years, I have developed mobile applications for the Android platform. In 2016, the Android Architecture Components (AAC) were announced at Google I/O, and since then, ViewModel has become essential in Android app development. (ViewModel Awesome!). In 2021, Google’s modern toolkit for building native UIs, Jetpack Compose 1.0, introduced a declarative UI paradigm similar to React and SwiftUI. By 2024, ViewModel remains widely used in developments adopting Jetpack Compose.

- [Compose UI Architecture](https://developer.android.com/develop/ui/compose/architecture)
- [Architecture Learning Journey - Now in Android App](https://github.com/android/nowinandroid/blob/main/docs/ArchitectureLearningJourney.md)

Traditionally, a ViewModel is always included as part of the setup for screens that fetch data from remote sources.
Have you ever wished for a Compose-first option that allows for easier data fetching on declarative UIs?

From my experience, about 70-80% of all screens are simple elements that perform some action on data retrieved from APIs. 
This led me to wonder if these simple screens could be simplified further with Compose-first code, which became the starting point for developing the Soil library.

I focused on the best practices from the React community, which has been building Single Page Applications (SPAs) with declarative UIs several years ahead of Jetpack Compose.

- [State Management - bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/docs/state-management.md)

From the perspective of data fetching, it utilize a state management concept called Server State, which efficiently shares data states throughout the application.
The stale-while-revalidate method of data fetching and caching, which inspired the library name SWR, fills a missing piece in Compose, and I am convinced it offers an excellent experience. 
I wanted to implement this approach in the world of Compose Multiplatform as well.

It's important to clarify that I am not suggesting that "ViewModels are unnecessary." ViewModels continue to be useful. 
However, I feel that it is time to reconsider how they are used. The idea of managing all UI states through ViewModels seems somewhat mismatched with the philosophy of declarative UIs. 
The real strength of Compose lies within its Composables.

Thank you for your interest in Soil!

[@ogaclejapan](https://github.com/ogaclejapan/)


## Acknowledgments

Our state management approach has been heavily inspired by the best practices and tools from the React community.

Query

- [Tanstack Query](https://github.com/tanstack/query)
- [SWR](https://github.com/vercel/swr)
- [RTK Query](https://github.com/reduxjs/redux-toolkit/blob/master/docs/rtk-query/overview.md)

Form

- [React Hook Form](https://github.com/react-hook-form/react-hook-form)

Space

- [Recoil](https://github.com/facebookexperimental/Recoil)
- [Jotai](https://github.com/pmndrs/jotai)

