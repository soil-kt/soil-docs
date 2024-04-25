# Hello, Form

Learn the basics of using Form.
If you haven't completed the [setup](/guide/getting-started.html#download) yet, please do so before proceeding.


## Step 1 - FormScope

When using a Form, define a `Form` to manage the state and actions of input fields, and create a child block of `FormScope`.

```kotlin
@Composable
fun App() {
    MaterialTheme {
        Form(
            onSubmit = {
                delay(2000)
                println("onSubmit: $it")
            },
            initialValue = "",
            policy = FormPolicy.Minimal
        ) { // this: FormScope<String>

        }
    }
}
```

The `Form` infers the type from `initialValue`.
Here, to create a simple form containing a single text input field, the `initialValue` is set as a string type.

::: warning
If you are expecting state restoration on the Android platform, please check if the type specified in `initialValue` is restorable.
Inside the Form, `rememberSaveable` is used to manage input values, and runtime errors will be thrown from the API for unsupported types.

Reference: [RememberSaveable.kt;l=242](https://cs.android.com/androidx/platform/frameworks/support/+/d0c824e32f7ac2012d926e7dbc1fc246a72c9bae:compose/runtime/runtime-saveable/src/commonMain/kotlin/androidx/compose/runtime/saveable/RememberSaveable.kt;l=242)
:::


## Step 2 - FieldControl

The association of the type specified in Form's `initialValue` with each field is defined using the Remember API that generates FieldControl. While there are several variations of the Remember API, here we use `rememberFieldRuleControl`.

```kotlin
@Composable
fun App() {
    MaterialTheme {
        Form(
            onSubmit = { /* .. */ },
            initialValue = "",
            policy = FormPolicy.Minimal
        ) { // this: FormScope<String>
            Column {
                val control = rememberFieldRuleControl(
                    name = "email",
                    select = { this }, // T.() -> V
                    update = { it },   // T.(V) -> T
                ) { // this: ValidationRuleBuilder<String>
                    notBlank { "must not be blank" }
                }
                // ..
            }
        }
    }
}
```

::: tip
Built-in validation rules callable within the `ValidationRuleBuilder<T>` block are defined in [form.rule](https://github.com/soil-kt/soil/tree/main/soil-form/src/commonMain/kotlin/soil/form/rule).
All validation rules are extension functions, so it is possible to define custom validation rules within your project and call them within this block.
:::


## Step 3 - Controller

To minimize the impact of re-composition due to updates in input values, the `FieldControl` created in Step 2 is passed to a `Controller`, which then connects the actual input component with the `Field` interface. Here, we define `TextField` from Material3 as the UI component for input.

```kotlin
@Composable
fun App() {
    MaterialTheme {
        Form(
            onSubmit = { /* .. */ },
            initialValue = "",
            policy = FormPolicy.Minimal
        ) { // this: FormScope<String>
            Column {
                val control = ..
                Controller(control) { field -> // Field<String>
                    TextField(
                        value = field.value,
                        onValueChange = field.onChange,
                        placeholder = { Text(field.name) },
                        modifier = Modifier.fillMaxWidth().onFocusChanged(field),
                        enabled = field.isEnabled,
                        isError = field.hasError,
                        singleLine = true,
                        supportingText = {
                            if (field.hasError) {
                                Text(text = field.errors.first(), color = MaterialTheme.colorScheme.error)
                            }
                        },
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Text,
                            imeAction = ImeAction.Next
                        )
                    )
                }
            }
        }
    }
}
```

## Step 4 - SubmissionControl

Similar to `FieldControl` in Step 2, the association of the form submission button with the form input items is defined using the Remember API that generates `SubmissionControl`.
The reason for using a `Controller` is the same as in Step 3, to minimize the impact of re-composition due to changes in the Submit state.

```kotlin
@Composable
fun App() {
    MaterialTheme {
        Form(
            onSubmit = { /* .. */ },
            initialValue = "",
            policy = FormPolicy.Minimal
        ) {
            Column {
                // ..
                Controller(control = rememberSubmissionRuleAutoControl()) { submission ->
                    Button(
                        onClick = submission.onSubmit,
                        modifier = Modifier.focusable(),
                        enabled = !submission.isSubmitting
                    ) {
                        Text("Submit")
                    }
                }
            }
        }
    }
}
```

The basic implementation of the form is complete with these steps. When the Submit button is pressed,
validation errors will only occur if the input value is blank.


## Step 5 - FormPolicy

In the previous steps, we have been specifying `FormPolicy.Minimal`.
`FormPolicy` includes several settings to adjust the timing of validation execution. We provide two presets as simple options:

- **Default** - Automatically invokes validation based on input values after each input field loses focus.
- **Minimal** - Automatically invokes validation based on input values after the submission button is clicked.

By commenting out `policy` as in the following code and controlling the Button state with `submission.canSubmit`,
the button can only be pressed when the validation rules are satisfied.


```kotlin
@Composable
fun App() {
    MaterialTheme {
        Form(
            onSubmit = { /* .. */ },
            initialValue = "",
            policy = FormPolicy.Minimal // [!code --]
        ) {
            Column {
                // ..
                Controller(control = rememberSubmissionRuleAutoControl()) { submission ->
                    Button(
                        onClick = submission.onSubmit,
                        modifier = Modifier.focusable(),
                        enabled = !submission.isSubmitting // [!code --]
                        enabled = submission.canSubmit // [!code ++]
                    ) {
                        Text("Submit")
                    }
                    if (submission.isSubmitting) { // [!code ++]
                        Text("Submitting...") // [!code ++]
                    } // [!code ++]
                }
            }
        }
    }
}
```


## Finish :checkered_flag:

Have you understood the basics of using Query? This concludes the tutorial :confetti_ball:

If you wish to continue learning, it would be a good idea to try running the `FormScreen` found in the [sample](https://github.com/soil-kt/soil/tree/main/sample/) code.
If you have any concerns, please feel free to provide feedback on [Github discussions](https://github.com/soil-kt/soil/discussions).

Love the project? :star: it on [GitHub](https://github.com/soil-kt/soil) and help us make it even better!
