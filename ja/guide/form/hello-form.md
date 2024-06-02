# Hello, Form

Form の基本的な使い方を身につけましょう。
[セットアップ](/ja/guide/getting-started.html#download) がまだ完了していない場合は事前に実施してください。


## Step 1 - FormScope

Form を利用する場合には、入力フィールドの状態やアクションを管理する `Form` を定義し、`FormScope` の子ブロックを作ります。

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

`Form` は `initialValue` から型を推論します。
ここでは、1つのテキスト入力フィールドが含まれる簡易的なフォームを作るため、`initialValue` は文字列型にします。

::: warning
Androidプラットフォーム向けの状態復元を期待している場合は `initialValue` に指定する型が復元可能かどうか確認してください。
Formの内部では、入力値の管理に `rememberSaveable` を利用しているため、未対応な型だと実行時エラーが API から投げられます。
参考: [RememberSaveable.kt;l=242](https://cs.android.com/androidx/platform/frameworks/support/+/d0c824e32f7ac2012d926e7dbc1fc246a72c9bae:compose/runtime/runtime-saveable/src/commonMain/kotlin/androidx/compose/runtime/saveable/RememberSaveable.kt;l=242)
:::


## Step 2 - FieldControl

`Form` の `initialValue` に指定した型と各フィールドの関連付けは `FieldControl` を生成する Remember API で定義します。
Remember API には、いくつかのバリエーションを用意していますが、ここでは `rememberFieldRuleControl` を利用します。

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
`ValidationRuleBuilder<T>` のブロック内で呼び出し可能なビルトインのバリデーションルールは [form.rule](https://github.com/soil-kt/soil/tree/main/soil-form/src/commonMain/kotlin/soil/form/rule) に定義されています。バリデーションルールはすべて拡張関数のため、独自のバリデーションルールをプロジェクト内に定義してブロック内で呼び出すことも可能です。
:::


## Step 3 - Controller

入力値の更新にともなう re-composition の範囲を最小限に抑えるため、 Step 2 で生成した `FieldControl` は `Controller` へ渡し、子ブロック内で実際の入力コンポーネントと `Field` の I/F を繋ぎます。
ここでは、Material3 の `TextField` を入力用のUIコンポーネントとして定義しています。

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

Step 2の `FieldControl` と同様に、フォームの入力項目内容を提出するボタンとの関連付けは `SubmissionControl` を生成する Remember API で定義します。
`Controller` を利用する理由は Step 3 と同じで、Submitの状態変化による re-composition 範囲を最小限に抑えるためです。

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

ここまでのステップでフォームの基本的な実装は完了しています。
Submit ボタンを押下したタイミングで入力値が空白の場合のみ入力フィールドがバリデーションエラーになります。


## Step 5 - FormPolicy

これまでのステップでは、`FormPolicy.Minimal` を指定してきました。
`FormPolicy` には、バリデーションを実行するタイミングを調整するための設定値がいくつか含まれています。
簡易的な選択肢として2つのプリセットを用意しています。

- **Default** - 入力フィールドごとにフォーカスのロスト後から入力値に応じてバリデーションを自動的に呼び出す
- **Minimal** - 実行ボタン押下後から入力値に応じてバリデーションを自動的に呼び出す

次のコードのように `policy` をコメントアウトし、 `Button` 状態を `submission.canSubmit` で制御すると、
バリデーションルールを満たすまでボタンを押すことができない制御に変わります。　

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

Form の基本的な使い方は理解できましたか？ これでチュートリアルは完了です :confetti_ball:

学習を続けたい場合は、[sample](https://github.com/soil-kt/soil/tree/1.0.0-alpha02/sample/) コード内の `FormScreen` を動かしてみるのがよいでしょう。
ぜひ、試して気になるところがあれば [Github discussions](https://github.com/soil-kt/soil/discussions) にフィードバックをお寄せください。

Soil プロジェクトに興味がありますか？<br/>
[GitHub](https://github.com/soil-kt/soil) で :star: を付けてもらえると今後の励みになります！
