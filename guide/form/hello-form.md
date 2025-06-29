# Hello, Form

Learn the basics of using Form.
If you haven't completed the [setup](/guide/getting-started.html#download) yet, please do so before proceeding.
This tutorial covers the *form* package.


## Step 1 - Form

First, use the `rememberForm` API to obtain a `Form` instance that manages form values and the state of each input field.

```kotlin
@Composable
fun App() {
    MaterialTheme {
        val form = rememberForm(
            initialValue = "",
            onSubmit = { value ->
                println("onSubmit: $value")
            }
        )
    }
}
```

The `Form` infers the type from `initialValue`.
In this example, we create a simple form containing a single text input field by setting the `initialValue` to a string type.

::: warning
If you expect state restoration on the Android platform, please ensure the type specified in `initialValue` is restorable.
The Form internally uses `rememberSaveable` to manage form values, and runtime errors will be thrown for unsupported types.

Reference: [RememberSaveable.kt;l=242](https://cs.android.com/androidx/platform/frameworks/support/+/d0c824e32f7ac2012d926e7dbc1fc246a72c9bae:compose/runtime/runtime-saveable/src/commonMain/kotlin/androidx/compose/runtime/saveable/RememberSaveable.kt;l=242)
:::


## Step 2 - FormField

The association between the type specified in Form's `initialValue` and each field is defined using FormField generation APIs: `Form<T>.Field` or `Form<T>.rememberField`.

```kotlin
@Composable
fun App() {
    MaterialTheme {
        val form = rememberForm(/* .. */)
        
        Column {
            form.Field(
                selector = { it },
                updater = { it },
                validator = FieldValidator {
                    notBlank { "must not be blank" }
                },
                render = { field -> // field: FormField<String>
                    TextField(
                        value = field.value,
                        onValueChange = field::onValueChange,
                        modifier = Modifier.onFocusChanged { state ->
                            field.handleFocus(state.isFocused || state.hasFocus)
                        },
                        isError = field.hasError,
                        supportingText = {
                            if (field.hasError) {
                                Text(text = field.error.messages.first(), color = MaterialTheme.colorScheme.error)
                            }
                        },
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                        keyboardActions = KeyboardActions(onDone = {
                            // When focus doesn't move to the next field, you need to manually trigger validation
                            field.trigger(FieldValidationMode.Blur)
                            defaultKeyboardAction(ImeAction.Done)
                        })
                    )
                }
            )
        }
    }
}
```

In this example, we use the headless component `Form<T>.Field` to connect the actual input component with the `FormField` interface.
The `selector` extracts the field value from the form data, while the `updater` specifies how to update the form data when the field changes.

The *form* package controls state and behavior but does not provide UI components. This allows maximum flexibility in designing your input components.

::: tip
Built-in validation rules available within the `FieldValidator` block are defined in [form.rule](https://github.com/soil-kt/soil/tree/main/soil-form/src/commonMain/kotlin/soil/form/rule).
All validation rules are extension functions, so you can define custom validation rules within your project and use them in the validator block.
:::


## Step 3 - Submit

Form submission is controlled using `Form<T>.handleSubmit` and can be combined with any component for flexible control.

```kotlin
@Composable
fun App() {
    MaterialTheme {
        val form = rememberForm(
            initialValue = "",
            onSubmit = { value -> 
                // This will only be called if validation passes
                println("onSubmit: $value") 
            }
        )
        
        Column {
            // ..
            
            Button(
                onClick = form::handleSubmit,
                enabled = form.meta.canSubmit
            ) {
                Text("Submit")
            }
        }
    }
}
```

The `handleSubmit` function automatically validates all fields and calls the `onSubmit` callback only if validation passes.
For controlling the submit button, `meta.canSubmit` is useful as it indicates whether the form is ready for submission based on validation rules and form state.

::: info
Button controls during submission (after `onSubmit` invocation) are outside the scope of the *form* package.
Please effectively utilize processing states and other features provided by the *query* package's Mutation functionality.
:::


## Step 4 - FormPolicy

You can fine-tune when and how validation is executed with `FormPolicy`.

```kotlin
@Composable
fun App() {
    MaterialTheme {
        val form = rememberForm(
            initialValue = "",
            policy = FormPolicy(
                formOptions = FormOptions(
                    preValidationDelayOnChange = 300.milliseconds
                ),
                fieldOptions = FieldOptions(
                    validationStrategy = FieldValidationStrategy(
                        initial = FieldValidationMode.Mount,
                        next = { current, isValid ->
                            if (isValid) FieldValidationMode.Blur else FieldValidationMode.Change
                        }
                    ),
                    validationDelayOnChange = 300.milliseconds
                )
            ),
            onSubmit = { value -> println("onSubmit: $value") }
        )
    }
}
```

We provide preset policies to accommodate different UX requirements:

- **FormPolicy()** (Default) - Executes initial validation when fields lose focus, then performs delayed validation on each field value change
- **FormPolicy.Minimal** - Executes initial validation when the submit button is pressed (`meta.canSubmit` always returns `true`)


## Step 5 - FormState

In Step 1, we specified initial values directly in `rememberForm`.
Using `FormState<T>` is helpful for more advanced scenarios or when integrating with external state management.

```kotlin
@Composable  
fun App() {
    MaterialTheme {
        val formState = rememberFormState(
            initialValue = ""
        )
        val formWithState = rememberForm(
            state = formState,
            onSubmit = { value -> 
                println("onSubmit: $value")
                formState.reset("")
            }
        )
        
        // For mutable state types (like TextFieldState)
        val nameState = rememberTextFieldState()
        val emailState = rememberTextFieldState()
        val formMeta = rememberFormMetaState()
        val customFormState = remember(formMeta.key) {
            FormState(
                value = MutableFormData(name = nameState, email = emailState),
                meta = formMeta
            )
        }
        val customForm = rememberForm(
            state = customFormState,
            onSubmit = { value -> println("onSubmit: $value") }
        )
        
        Column {
            // Use any of the form instances created above
            // ... fields and submit button
        }
    }
}
```

There are APIs that can only be called via FormState:

- **reset**: Returns all state within the Form to its initial state
- **setError**: Allows setting validation errors from outside the Form (e.g., reflecting validation errors from API submission results)

For typical scenarios, the `rememberForm`-only approach is sufficient. You should use them selectively based on your requirements.


## Finish :checkered_flag:

Do you understand the basics of using Form? This concludes the tutorial :confetti_ball:

If you wish to continue learning, try running the `FormScreen` found in the [sample](https://github.com/soil-kt/soil/tree/1.0.0-alpha11/sample/) code.
If you have any concerns, please feel free to provide feedback on [Github discussions](https://github.com/soil-kt/soil/discussions).

Love the project? :star: it on [GitHub](https://github.com/soil-kt/soil) and help us make it even better!
