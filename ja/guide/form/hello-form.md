# Hello, Form

Form の基本的な使い方を身につけましょう。
[セットアップ](/ja/guide/getting-started.html#download) がまだ完了していない場合は事前に実施してください。
このチュートリアルでは、*form* パッケージを使います。


## Step 1 - Form

はじめに、`rememberForm` APIを利用し、Form値と各入力フィールドの状態を管理する `Form` インスタンスを取得します。

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

`Form` は `initialValue` から型を推論します。
この例では、1つのテキスト入力フィールドが含まれる簡易的なフォームを作るため、`initialValue` は文字列型にします。

::: warning
Androidプラットフォーム向けの状態復元を期待している場合は、`initialValue` に指定する型が復元可能かどうか確認してください。
Formの内部では、フォーム値の管理に `rememberSaveable` を利用しているため、未対応な型だと実行時エラーが投げられます。

参考: [RememberSaveable.kt;l=242](https://cs.android.com/androidx/platform/frameworks/support/+/d0c824e32f7ac2012d926e7dbc1fc246a72c9bae:compose/runtime/runtime-saveable/src/commonMain/kotlin/androidx/compose/runtime/saveable/RememberSaveable.kt;l=242)
:::


## Step 2 - FormField

Form の `initialValue` に指定した型と各フィールドの関連付けは FormField を生成する `Form<T>.Field` または `Form<T>.rememberField` API で定義します。

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
                    notBlank { "入力は必須です" }
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
                            // フォーカスが次へ移動しないケースでは、手動でトリガーを呼び出す必要があります
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

この例では、ヘッドレスコンポーネントとして提供する `Form<T>.Field` を利用し、実際の入力コンポーネントと `FormField` のI/F を繋ぎます。
`selector` はフォームデータからフィールド値を抽出し、`updater` はフィールドが変更されたときにフォームデータを更新する方法を指定します。

*form* パッケージでは、状態と振る舞いを制御しますが、UIは提供しません。これにより、入力コンポーネントのデザインに最大限の柔軟性を持たせることができます。

::: tip
`FieldValidator` ブロック内で使用可能なビルトインのバリデーションルールは [form.rule](https://github.com/soil-kt/soil/tree/main/soil-form/src/commonMain/kotlin/soil/form/rule) に定義されています。
すべてのバリデーションルールは拡張関数のため、プロジェクト内で独自のバリデーションルールを定義してバリデーターブロック内で使用することができます。
:::


## Step 3 - Submit

フォームの送信は、`Form<T>.handleSubmit` を利用し、任意のコンポーネントと組み合わせて制御します。

```kotlin
@Composable
fun App() {
    MaterialTheme {
        val form = rememberForm(
            initialValue = "",
            onSubmit = { value -> 
                // バリデーションが通った場合のみ呼ばれます
                println("onSubmit: $value") 
            }
        )
        
        Column {
            // ..
            
            Button(
                onClick = form::handleSubmit,
                enabled = form.meta.canSubmit
            ) {
                Text("送信")
            }
        }
    }
}
```

`handleSubmit` 関数は、自動的にすべてのフィールドをバリデーションし、バリデーションが通った場合のみ `onSubmit` コールバックを呼び出します。
送信ボタンの制御には、`meta.canSubmit` が役立ちます。バリデーションルールとフォーム状態に基づいて、フォームが送信準備ができているかどうかを示します。

::: info
`onSubmit` 呼び出し後の送信中などのボタン制御は、*form* パッケージの範囲外です。
*query* パッケージの Mutation 機能に備わっている処理状態などを有効的に活用してください。
:::


## Step 4 - FormPolicy

バリデーションがいつ、どのように実行されるかを `FormPolicy` で細かく調整できます。

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

異なるUX要件に対応するためのプリセットポリシーを提供しています。

- **FormPolicy()** (デフォルト) - フィールドがフォーカスを失ったときに初回バリデーションを実行し、以降はフィールド値の変更都度バリデーションを遅延実行します
- **FormPolicy.Minimal** - 送信ボタンが押されたときに初回バリデーションを実行します（`meta.canSubmit` はつねに `true` を返します）


## Step 5 - FormState

Step 1 では、`rememberForm` に初期値を指定していました。
`FormState<T>` を活用すると、より高度なシナリオや外部状態管理との連携時に役立ちます。

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
        
        // ミュータブルな状態タイプ（TextFieldState など）の場合
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
            // 上記で作成したいずれかのformインスタンスを使用
            // ... フィールドと送信ボタン
        }
    }
}
```

FormState 経由でのみ呼び出せるAPIが存在します。

- **reset** - Form内の状態をすべて初期状態へ戻す
- **setError** - Form外のバリデーションエラーを設定できます（例えば、APIへの送信結果のバリデーションエラーの反映など）

一般的なシナリオでは、`rememberForm` のみのアプローチで十分です。要件に応じて部分的に使い分けられるといいでしょう。


## Finish :checkered_flag:

Form の基本的な使い方は理解できましたか？ これでチュートリアルは完了です :confetti_ball:

学習を続けたい場合は、[sample](https://github.com/soil-kt/soil/tree/1.0.0-alpha15/sample/) コード内の `FormScreen` を動かしてみるのがよいでしょう。
ぜひ、試して気になるところがあれば [Github discussions](https://github.com/soil-kt/soil/discussions) にフィードバックをお寄せください。

Soil プロジェクトに興味がありますか？<br/>
[GitHub](https://github.com/soil-kt/soil) で :star: を付けてもらえると今後の励みになります！
