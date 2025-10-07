(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/CreationModeSelector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreationModeSelector",
    ()=>CreationModeSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const CreationModeSelector = (param)=>{
    let { value, onChange, onModeChangeRequest, disabled = false } = param;
    const handleModeChange = (newMode)=>{
        if (disabled || newMode === value) {
            return;
        }
        if (onModeChangeRequest) {
            onModeChangeRequest(newMode);
        } else {
            onChange(newMode);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            marginBottom: '20px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                style: {
                    display: 'block',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    fontSize: '14px'
                },
                children: "作成モード"
            }, void 0, false, {
                fileName: "[project]/src/components/CreationModeSelector.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '12px',
                    opacity: disabled ? 0.6 : 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: 'block',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            border: value === 'auto' ? '2px solid #4CAF50' : '2px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            backgroundColor: value === 'auto' ? '#f8fff8' : 'white',
                            transition: 'all 0.2s ease-in-out',
                            flex: '1',
                            minWidth: '0'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'flex-start'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "radio",
                                    name: "creationMode",
                                    value: "auto",
                                    checked: value === 'auto',
                                    onChange: ()=>handleModeChange('auto'),
                                    disabled: disabled,
                                    style: {
                                        marginRight: '12px',
                                        marginTop: '2px',
                                        cursor: disabled ? 'not-allowed' : 'pointer',
                                        transform: 'scale(1.2)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CreationModeSelector.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        flex: 1
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                color: value === 'auto' ? '#2e7d32' : '#333',
                                                marginBottom: '4px'
                                            },
                                            children: "🤖 自動生成"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreationModeSelector.tsx",
                                            lineNumber: 67,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '13px',
                                                color: disabled ? '#999' : '#666',
                                                lineHeight: '1.4'
                                            },
                                            children: "AIが学習項目に基づいて穴埋め箇所と選択肢を自動生成"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreationModeSelector.tsx",
                                            lineNumber: 75,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CreationModeSelector.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CreationModeSelector.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/CreationModeSelector.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: 'block',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            border: value === 'manual' ? '2px solid #4CAF50' : '2px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            backgroundColor: value === 'manual' ? '#f8fff8' : 'white',
                            transition: 'all 0.2s ease-in-out',
                            flex: '1',
                            minWidth: '0'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'flex-start'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "radio",
                                    name: "creationMode",
                                    value: "manual",
                                    checked: value === 'manual',
                                    onChange: ()=>handleModeChange('manual'),
                                    disabled: disabled,
                                    style: {
                                        marginRight: '12px',
                                        marginTop: '2px',
                                        cursor: disabled ? 'not-allowed' : 'pointer',
                                        transform: 'scale(1.2)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CreationModeSelector.tsx",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        flex: 1
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                color: value === 'manual' ? '#2e7d32' : '#333',
                                                marginBottom: '4px'
                                            },
                                            children: "✏️ 手動作成"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreationModeSelector.tsx",
                                            lineNumber: 113,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '13px',
                                                color: disabled ? '#999' : '#666',
                                                lineHeight: '1.4'
                                            },
                                            children: "穴埋め箇所を手動で選択し、選択肢を自分で作成"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreationModeSelector.tsx",
                                            lineNumber: 121,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CreationModeSelector.tsx",
                                    lineNumber: 112,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CreationModeSelector.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/CreationModeSelector.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CreationModeSelector.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CreationModeSelector.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = CreationModeSelector;
var _c;
__turbopack_context__.k.register(_c, "CreationModeSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/quizGenerationService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "quizGenerationService",
    ()=>quizGenerationService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$dist$2f$chat_models$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/dist/chat_models.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$messages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/core/messages.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$human$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/core/dist/messages/human.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$system$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/core/dist/messages/system.js [app-client] (ecmascript)");
;
;
;
const OPENAI_API_KEY = ("TURBOPACK compile-time value", "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");
class QuizGenerationService {
    async generateQuiz(request) {
        const systemPrompt = "\n    あなたは教育用選択式問題作成の専門家です。与えられた問題文、コード、学習項目(".concat(request.learningTopic, ")から、学習者の理解が深まるような選択式問題を作成してください。\n\n    # 指示\n    1. ").concat(request.learningTopic, 'に関連する最も重要な箇所を1つ選んで「__BLANK__」にする\n    2. __BLANK__は**必ずソースコード中から選び**、決してソースコードを追加して__BLANK__にしたりコメントアウト(// の部分)の部分を__BLANK__にしたりしない\n    3. __BLANK__は最大でソースコード1行とし、なるべく短くする\n    4. **正解は絶対に1つのみ（__BLANK__としたソースコードをそのまま出力）**とし、B、C、Dには明らかな誤答を出力する\n    5. 誤答は言語の文法ではなく、学習項目に関連するものとし、学習者が学びのある素晴らしいものにする。\n    6. JSONフォーマットで回答する\n\n    # 出力フォーマット\n    {\n      "problemText": "元の問題文を保持し、末尾に「___BLANK___の部分に当てはまる適切な選択肢を選べ。」を追加した問題文",\n      "codeWithBlanks": "ソースコードの一部を___BLANK___に置き換え、そのほかは変更していないコード",\n      "choices": [\n        {"id": "A", "text": "選択肢A", "isCorrect": true},\n        {"id": "B", "text": "選択肢B", "isCorrect": false},\n        {"id": "C", "text": "選択肢C", "isCorrect": false},\n        {"id": "D", "text": "選択肢D", "isCorrect": false}\n      ],\n      "correctChoiceId": "A"\n    }\n    ');
        const userPrompt = "\n    # 問題文\n    ".concat(request.problemText, "\n\n    # ソースコード (").concat(request.language, ")\n    ```\n    ").concat(request.code, "\n    ```\n\n    # 学習項目\n    ").concat(request.learningTopic, "\n    ");
        try {
            const messages = [
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$system$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SystemMessage"](systemPrompt),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$human$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HumanMessage"](userPrompt)
            ];
            const response = await this.model.invoke(messages);
            const responseText = response.content;
            // JSON部分を抽出
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("AIの応答からJSONを抽出できませんでした");
            }
            const parsedResponse = JSON.parse(jsonMatch[0]);
            // バリデーション
            if (!parsedResponse.codeWithBlanks.includes("___BLANK___")) {
                throw new Error("空欄箇所が正しく設定されていません");
            }
            if (!parsedResponse.choices || parsedResponse.choices.length !== 4) {
                throw new Error("選択肢は4つである必要があります");
            }
            const correctChoices = parsedResponse.choices.filter((choice)=>choice.isCorrect);
            if (correctChoices.length !== 1) {
                throw new Error("正答は1つである必要があります");
            }
            return parsedResponse;
        } catch (error) {
            console.error("Quiz generation error:", error);
            throw new Error("問題の自動生成に失敗しました: ".concat(error));
        }
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "model", void 0);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        this.model = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$dist$2f$chat_models$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatOpenAI"]({
            apiKey: OPENAI_API_KEY,
            model: "gpt-4o",
            temperature: 0
        });
    }
}
const quizGenerationService = new QuizGenerationService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/AutoGenerationMode.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AutoGenerationMode",
    ()=>AutoGenerationMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/react/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ProblemContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ProblemContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$quizGenerationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/quizGenerationService.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const AutoGenerationMode = (param)=>{
    let { learningTopic, onQuizGenerated, onGeneratingStateChange } = param;
    _s();
    const { problemData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ProblemContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProblem"])();
    const [isGenerating, setIsGenerating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 生成中状態の変更を親に通知
    const updateGeneratingState = (generating)=>{
        setIsGenerating(generating);
        if (onGeneratingStateChange) {
            onGeneratingStateChange(generating);
        }
    };
    const [generatedQuiz, setGeneratedQuiz] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleGenerate = async ()=>{
        if (!learningTopic.trim()) {
            setError('学習項目を入力してください');
            return;
        }
        if (!problemData.problem.trim() || !problemData.code.trim()) {
            setError('問題文とコードが必要です');
            return;
        }
        updateGeneratingState(true);
        setError('');
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$quizGenerationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["quizGenerationService"].generateQuiz({
                problemText: problemData.problem,
                code: problemData.code,
                language: problemData.language,
                learningTopic: learningTopic
            });
            // 解説を空にして渡す
            const responseWithoutExplanation = {
                ...response,
                explanation: ''
            };
            setGeneratedQuiz(responseWithoutExplanation);
            onQuizGenerated(responseWithoutExplanation);
        } catch (error) {
            setError(error instanceof Error ? error.message : '問題の生成に失敗しました');
        } finally{
            updateGeneratingState(false);
        }
    };
    const getChoiceStyle = (choice)=>({
            padding: '10px',
            margin: '5px 0',
            border: choice.isCorrect ? '2px solid #4CAF50' : '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: choice.isCorrect ? '#f0f8f0' : 'white',
            fontSize: '14px'
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: '20px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleGenerate,
                    disabled: isGenerating,
                    style: {
                        padding: '12px 24px',
                        backgroundColor: isGenerating ? '#ccc' : '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    },
                    children: isGenerating ? '生成中...' : 'AI で問題を自動生成'
                }, void 0, false, {
                    fileName: "[project]/src/components/AutoGenerationMode.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/AutoGenerationMode.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px',
                    backgroundColor: '#ffebee',
                    border: '1px solid #f44336',
                    borderRadius: '4px',
                    color: '#d32f2f',
                    marginBottom: '20px',
                    fontSize: '14px'
                },
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/AutoGenerationMode.tsx",
                lineNumber: 95,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            generatedQuiz && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        style: {
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '16px'
                        },
                        children: "生成された問題"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AutoGenerationMode.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '20px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                style: {
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    marginBottom: '8px'
                                },
                                children: "問題文"
                            }, void 0, false, {
                                fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                lineNumber: 116,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '12px',
                                    backgroundColor: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap'
                                },
                                children: generatedQuiz.problemText
                            }, void 0, false, {
                                fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                lineNumber: 119,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AutoGenerationMode.tsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '20px',
                            marginBottom: '20px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        style: {
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            marginBottom: '8px'
                                        },
                                        children: "穴埋めコード"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                        lineNumber: 140,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: '600px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                                            height: "100%",
                                            language: problemData.language,
                                            value: generatedQuiz.codeWithBlanks,
                                            onMount: (editor, monaco)=>{
                                                // ___BLANK___をハイライト表示するためのデコレーションを追加
                                                const model = editor.getModel();
                                                if (model) {
                                                    const text = model.getValue();
                                                    const decorations = [];
                                                    const regex = /___BLANK___/g;
                                                    let match;
                                                    while((match = regex.exec(text)) !== null){
                                                        const startPos = model.getPositionAt(match.index);
                                                        const endPos = model.getPositionAt(match.index + match[0].length);
                                                        decorations.push({
                                                            range: new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column),
                                                            options: {
                                                                inlineClassName: 'my-blank-highlight'
                                                            }
                                                        });
                                                    }
                                                    editor.deltaDecorations([], decorations);
                                                }
                                            },
                                            options: {
                                                readOnly: true,
                                                minimap: {
                                                    enabled: false
                                                },
                                                fontSize: 14,
                                                lineNumbers: 'on',
                                                wordWrap: 'on',
                                                scrollBeyondLastLine: false,
                                                automaticLayout: true
                                            },
                                            theme: "vs-light"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                            lineNumber: 144,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                lineNumber: 139,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '600px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            marginBottom: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    marginBottom: '8px'
                                                },
                                                children: "選択肢"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                                lineNumber: 200,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    // border: '1px solid #ddd', 
                                                    borderRadius: '4px',
                                                    padding: '8px',
                                                    backgroundColor: '#fafafa',
                                                    height: '200px',
                                                    overflow: 'auto'
                                                },
                                                children: generatedQuiz.choices.map((choice)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: getChoiceStyle(choice),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: [
                                                                    choice.id,
                                                                    "."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                                                lineNumber: 213,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            " ",
                                                            choice.text,
                                                            choice.isCorrect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: '#4CAF50',
                                                                    marginLeft: '8px'
                                                                },
                                                                children: "✓ 正答"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                                                lineNumber: 215,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, choice.id, true, {
                                                        fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                                        lineNumber: 212,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                                lineNumber: 203,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                        lineNumber: 199,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    marginBottom: '8px'
                                                },
                                                children: "解説"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                                lineNumber: 224,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                placeholder: "問題の解説を入力してください...",
                                                style: {
                                                    width: '96%',
                                                    height: '280px',
                                                    padding: '12px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    lineHeight: '1.6',
                                                    resize: 'none',
                                                    fontFamily: 'inherit'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                                lineNumber: 227,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                        lineNumber: 223,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AutoGenerationMode.tsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AutoGenerationMode.tsx",
                        lineNumber: 133,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AutoGenerationMode.tsx",
                lineNumber: 109,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/AutoGenerationMode.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AutoGenerationMode, "OY73YFyLTGEh8ylMZ8OLdy14fz0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ProblemContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProblem"]
    ];
});
_c = AutoGenerationMode;
var _c;
__turbopack_context__.k.register(_c, "AutoGenerationMode");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ManualCreationMode.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ManualCreationMode",
    ()=>ManualCreationMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const ManualCreationMode = (param)=>{
    let { onManualDataChange } = param;
    _s();
    const [choices, setChoices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: 'A',
            text: '',
            isCorrect: true
        },
        {
            id: 'B',
            text: '',
            isCorrect: false
        },
        {
            id: 'C',
            text: '',
            isCorrect: false
        },
        {
            id: 'D',
            text: '',
            isCorrect: false
        }
    ]);
    const handleChoiceChange = (index, text)=>{
        const updatedChoices = [
            ...choices
        ];
        updatedChoices[index].text = text;
        setChoices(updatedChoices);
    };
    // 編集内容の変更を親に通知
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ManualCreationMode.useEffect": ()=>{
            if (onManualDataChange) {
                const hasChoiceChanges = choices.some({
                    "ManualCreationMode.useEffect.hasChoiceChanges": (choice)=>choice.text.trim() !== ''
                }["ManualCreationMode.useEffect.hasChoiceChanges"]);
                onManualDataChange(hasChoiceChanges);
            }
        }
    }["ManualCreationMode.useEffect"], [
        choices,
        onManualDataChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            gap: '20px',
            marginBottom: '20px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: '12px'
                        },
                        children: "選択肢を入力してください"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ManualCreationMode.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    choices.map((choice, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: '10px'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '14px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            minWidth: '30px',
                                            fontWeight: 'bold'
                                        },
                                        children: [
                                            choice.id,
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ManualCreationMode.tsx",
                                        lineNumber: 54,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: choice.text,
                                        onChange: (e)=>handleChoiceChange(index, e.target.value),
                                        placeholder: index === 0 ? '正答を入力' : '誤答を入力',
                                        style: {
                                            flex: 1,
                                            padding: '8px',
                                            border: choice.isCorrect ? '2px solid #4CAF50' : '1px solid #ddd',
                                            borderRadius: '4px',
                                            backgroundColor: choice.isCorrect ? '#f0f8f0' : 'white',
                                            fontSize: '14px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ManualCreationMode.tsx",
                                        lineNumber: 60,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    choice.isCorrect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: '#4CAF50',
                                            marginLeft: '8px'
                                        },
                                        children: "✓ 正答"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ManualCreationMode.tsx",
                                        lineNumber: 75,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ManualCreationMode.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, choice.id, false, {
                            fileName: "[project]/src/components/ManualCreationMode.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ManualCreationMode.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: '12px'
                        },
                        children: "解説"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ManualCreationMode.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        placeholder: "問題の解説を入力してください...",
                        style: {
                            width: '100%',
                            height: '200px',
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/ManualCreationMode.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ManualCreationMode.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ManualCreationMode.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ManualCreationMode, "SR6iV3FSi5lTs9WjEV1NLFrNhrw=");
_c = ManualCreationMode;
var _c;
__turbopack_context__.k.register(_c, "ManualCreationMode");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/MessageItem.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageItem",
    ()=>MessageItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [app-client] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/remark-gfm/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rehype$2d$highlight$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/rehype-highlight/lib/index.js [app-client] (ecmascript)");
;
;
;
;
const MessageItem = (param)=>{
    let { message } = param;
    const isUser = message.sender === 'user';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '16px'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                backgroundColor: isUser ? '#2196f3' : '#e3f2fd',
                color: isUser ? 'white' : '#333',
                padding: '12px 16px',
                borderRadius: '18px',
                maxWidth: '70%',
                wordBreak: 'break-word'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "message-content",
                    style: isUser ? {
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        fontSize: '13px',
                        lineHeight: '1.4'
                    } : undefined,
                    children: isUser ? message.content : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                        remarkPlugins: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                        ],
                        rehypePlugins: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rehype$2d$highlight$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                        ],
                        children: message.content
                    }, void 0, false, {
                        fileName: "[project]/src/components/MessageItem.tsx",
                        lineNumber: 37,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/MessageItem.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: '12px',
                        opacity: 0.7,
                        marginTop: '4px',
                        textAlign: 'right'
                    },
                    children: message.timestamp.toLocaleTimeString()
                }, void 0, false, {
                    fileName: "[project]/src/components/MessageItem.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/MessageItem.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/MessageItem.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = MessageItem;
var _c;
__turbopack_context__.k.register(_c, "MessageItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/MessageList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageList",
    ()=>MessageList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MessageItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/MessageItem.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const MessageList = (param)=>{
    let { messages, isLoading } = param;
    _s();
    const bottomRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessageList.useEffect": ()=>{
            var _bottomRef_current;
            (_bottomRef_current = bottomRef.current) === null || _bottomRef_current === void 0 ? void 0 : _bottomRef_current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }["MessageList.useEffect"], [
        messages
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            backgroundColor: '#fafafa'
        },
        children: [
            messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: 'center',
                    color: '#666',
                    marginTop: '50px'
                },
                children: "Start a conversation with the AI chatbot!"
            }, void 0, false, {
                fileName: "[project]/src/components/MessageList.tsx",
                lineNumber: 25,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MessageItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageItem"], {
                    message: message
                }, message.id, false, {
                    fileName: "[project]/src/components/MessageList.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))),
            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginBottom: '16px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        backgroundColor: '#e3f2fd',
                        padding: '12px 16px',
                        borderRadius: '18px',
                        maxWidth: '70%',
                        color: '#666'
                    },
                    children: "Thinking..."
                }, void 0, false, {
                    fileName: "[project]/src/components/MessageList.tsx",
                    lineNumber: 44,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/MessageList.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: bottomRef
            }, void 0, false, {
                fileName: "[project]/src/components/MessageList.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/MessageList.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(MessageList, "eaUWg0io6wE0buoFSqU1QLjVsUo=");
_c = MessageList;
var _c;
__turbopack_context__.k.register(_c, "MessageList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/MessageInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageInput",
    ()=>MessageInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const MessageInput = (param)=>{
    let { onSendMessage, isLoading } = param;
    _s();
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleSend = ()=>{
        if (message.trim() && !isLoading) {
            onSendMessage(message.trim());
            setMessage("");
            // テキストエリアの高さをリセット
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };
    // テキストエリアの高さを自動調整
    const adjustTextareaHeight = ()=>{
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessageInput.useEffect": ()=>{
            adjustTextareaHeight();
        }
    }["MessageInput.useEffect"], [
        message
    ]);
    const handleKeyPress = (event)=>{
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: "16px",
            borderTop: "1px solid #ddd",
            backgroundColor: "white"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: "flex",
                gap: "8px",
                alignItems: "flex-end"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    ref: textareaRef,
                    value: message,
                    onChange: (e)=>setMessage(e.target.value),
                    onKeyPress: handleKeyPress,
                    placeholder: "Type your message here... (Shift+Enter for new line)",
                    disabled: isLoading,
                    rows: 1,
                    style: {
                        flex: 1,
                        padding: "5px",
                        border: "1px solid #ddd",
                        borderRadius: "12px",
                        outline: "none",
                        fontSize: "14px",
                        resize: "none",
                        fontFamily: "inherit",
                        lineHeight: "1.4",
                        minHeight: "40px",
                        maxHeight: "120px",
                        overflowY: "auto"
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/MessageInput.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleSend,
                    disabled: !message.trim() || isLoading,
                    style: {
                        padding: "8px 16px",
                        backgroundColor: "#2196f3",
                        color: "white",
                        border: "none",
                        borderRadius: "20px",
                        cursor: isLoading || !message.trim() ? "not-allowed" : "pointer",
                        opacity: isLoading || !message.trim() ? 0.5 : 1,
                        fontSize: "14px",
                        fontWeight: "bold",
                        minWidth: "60px",
                        height: "55px"
                    },
                    children: "Send"
                }, void 0, false, {
                    fileName: "[project]/src/components/MessageInput.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/MessageInput.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/MessageInput.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(MessageInput, "6sGi6+IOM/ssW8mbv2+B6D1pG+A=");
_c = MessageInput;
var _c;
__turbopack_context__.k.register(_c, "MessageInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/explanationChatService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "explanationChatService",
    ()=>explanationChatService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$dist$2f$chat_models$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/dist/chat_models.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$messages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/core/messages.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$human$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/core/dist/messages/human.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$system$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/core/dist/messages/system.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$ai$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/core/dist/messages/ai.js [app-client] (ecmascript)");
;
;
;
const OPENAI_API_KEY = ("TURBOPACK compile-time value", "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");
class ExplanationChatService {
    // localStorageから対話履歴を読み込む
    loadConversationHistory() {
        try {
            const stored = localStorage.getItem('explanationChatHistory');
            if (stored) {
                const historyData = JSON.parse(stored);
                return historyData.map((msg)=>{
                    switch(msg.type){
                        case 'system':
                            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$system$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SystemMessage"](msg.content);
                        case 'human':
                            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$human$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HumanMessage"](msg.content);
                        case 'ai':
                            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$ai$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AIMessage"](msg.content);
                        default:
                            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$system$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SystemMessage"](this.baseSystemMessage);
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load explanation chat history from localStorage:', error);
        }
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$system$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SystemMessage"](this.baseSystemMessage)
        ];
    }
    // localStorageに対話履歴を保存する
    saveConversationHistory() {
        try {
            const historyData = this.conversationHistory.map((msg)=>{
                let type = 'system';
                if (msg instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$human$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HumanMessage"]) type = 'human';
                else if (msg instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$ai$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AIMessage"]) type = 'ai';
                else if (msg instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$system$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SystemMessage"]) type = 'system';
                return {
                    type,
                    content: msg.content
                };
            });
            localStorage.setItem('explanationChatHistory', JSON.stringify(historyData));
        } catch (error) {
            console.error('Failed to save explanation chat history to localStorage:', error);
        }
    }
    async sendMessage(message) {
        try {
            // ユーザーメッセージを履歴に追加
            const userMessage = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$human$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HumanMessage"](message);
            this.conversationHistory.push(userMessage);
            // 現在の対話履歴全体でAPIを呼び出し
            const response = await this.model.invoke(this.conversationHistory);
            // AIの返答を履歴に追加
            const aiMessage = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$ai$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AIMessage"](response.content);
            this.conversationHistory.push(aiMessage);
            // localStorageに保存
            this.saveConversationHistory();
            return response.content;
        } catch (error) {
            console.error("Error sending message:", error);
            throw new Error("Failed to send message. Please check your API key and try again.");
        }
    }
    // 対話履歴をクリアするメソッド
    clearHistory() {
        this.conversationHistory = [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$system$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SystemMessage"](this.baseSystemMessage)
        ];
        this.saveConversationHistory();
        localStorage.removeItem('explanationChatMessages');
    }
    // 対話履歴を取得するメソッド（デバッグ用）
    getHistory() {
        return [
            ...this.conversationHistory
        ];
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "model", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "baseSystemMessage", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "conversationHistory", void 0);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        this.model = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$dist$2f$chat_models$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatOpenAI"]({
            apiKey: OPENAI_API_KEY,
            model: "gpt-4",
            temperature: 0.7
        });
        // 解説相談用のシステムメッセージ
        this.baseSystemMessage = "\n    # 役割\n    あなたは、選択式問題の解説作成を支援する親切なプログラミング教員です。\n\n    # 命令\n    ユーザーが作成している選択式問題の解説について相談に乗ってください。以下の点を重視してサポートしてください：\n    - 学習者にとって理解しやすい解説の書き方をアドバイス\n    - コードの動作や概念の説明方法を提案\n    - 解説の構成や流れについて助言\n    - 具体例や図解の提案\n\n    # 対話上の注意\n    - 出力はマークダウン形式で行ってください\n    - 具体的で実践的なアドバイスを心がけてください\n    - 学習者の視点に立った解説作成を推奨してください\n    - 質問があれば遠慮なく聞いてください\n";
        // 対話履歴を初期化
        this.conversationHistory = this.loadConversationHistory();
    }
}
const explanationChatService = new ExplanationChatService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ExplanationChatContainer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExplanationChatContainer",
    ()=>ExplanationChatContainer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MessageList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/MessageList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MessageInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/MessageInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$explanationChatService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/explanationChatService.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const ExplanationChatContainer = (param)=>{
    let { showHeader = true } = param;
    _s();
    // localStorageからメッセージ履歴を読み込む
    const loadMessages = ()=>{
        try {
            const stored = localStorage.getItem('explanationChatMessages');
            if (stored) {
                const parsedMessages = JSON.parse(stored);
                return parsedMessages.map((msg)=>({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }));
            }
        } catch (error) {
            console.error('Failed to load explanation chat messages from localStorage:', error);
        }
        return [];
    };
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(loadMessages);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // メッセージをlocalStorageに保存
    const saveMessages = (msgs)=>{
        try {
            localStorage.setItem('explanationChatMessages', JSON.stringify(msgs));
        } catch (error) {
            console.error('Failed to save explanation chat messages to localStorage:', error);
        }
    };
    // messagesが変更されたらlocalStorageに保存
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExplanationChatContainer.useEffect": ()=>{
            saveMessages(messages);
        }
    }["ExplanationChatContainer.useEffect"], [
        messages
    ]);
    const handleSendMessage = async (content)=>{
        const userMessage = {
            id: Date.now().toString(),
            content,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages((prev)=>[
                ...prev,
                userMessage
            ]);
        setIsLoading(true);
        try {
            const botResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$explanationChatService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["explanationChatService"].sendMessage(content);
            const botMessage = {
                id: (Date.now() + 1).toString(),
                content: botResponse,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages((prev)=>[
                    ...prev,
                    botMessage
                ]);
        } catch (error) {
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                content: 'Sorry, I encountered an error. Please try again.',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages((prev)=>[
                    ...prev,
                    errorMessage
                ]);
            console.error('Failed to send message:', error);
        } finally{
            setIsLoading(false);
        }
    };
    const handleClearHistory = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$explanationChatService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["explanationChatService"].clearHistory();
        setMessages([]);
        localStorage.removeItem('explanationChatMessages');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            border: 'none',
            borderRadius: '0',
            overflow: 'hidden'
        },
        children: [
            showHeader && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    backgroundColor: '#f5f5f5',
                    padding: '16px',
                    borderBottom: '1px solid #ddd',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '14px'
                        },
                        children: "解説相談"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ExplanationChatContainer.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleClearHistory,
                        style: {
                            padding: '4px 8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: '10px'
                        },
                        children: "🗑️ 履歴クリア"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ExplanationChatContainer.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ExplanationChatContainer.tsx",
                lineNumber: 99,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MessageList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageList"], {
                messages: messages,
                isLoading: isLoading
            }, void 0, false, {
                fileName: "[project]/src/components/ExplanationChatContainer.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MessageInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageInput"], {
                onSendMessage: handleSendMessage,
                isLoading: isLoading
            }, void 0, false, {
                fileName: "[project]/src/components/ExplanationChatContainer.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ExplanationChatContainer.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ExplanationChatContainer, "SZtR+qwOo0SYfcLLrbuTERESoa0=");
_c = ExplanationChatContainer;
var _c;
__turbopack_context__.k.register(_c, "ExplanationChatContainer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ModeChangeConfirmDialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModeChangeConfirmDialog",
    ()=>ModeChangeConfirmDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const ModeChangeConfirmDialog = (param)=>{
    let { isOpen, newMode, onConfirm, onCancel } = param;
    if (!isOpen) return null;
    const modeText = newMode === 'auto' ? '自動生成' : '手動作成';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                maxWidth: '450px',
                width: '90%',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: '24px',
                                marginRight: '12px'
                            },
                            children: "⚠️"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                margin: 0,
                                fontSize: '18px',
                                color: '#ff9800'
                            },
                            children: "作成モード変更の確認"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '20px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                margin: 0,
                                fontSize: '14px',
                                lineHeight: '1.6',
                                color: '#856404'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: [
                                        "「",
                                        modeText,
                                        "」"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                "に切り替えると、以下の内容がクリアされます："
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            style: {
                                margin: '12px 0 0 0',
                                paddingLeft: '20px',
                                fontSize: '13px',
                                color: '#856404'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "生成済みの選択式問題"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "入力済みの解説内容"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "その他の編集内容"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                                    lineNumber: 85,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: '14px',
                        color: '#333',
                        marginBottom: '24px',
                        lineHeight: '1.5'
                    },
                    children: [
                        "本当に「",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: modeText
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                            lineNumber: 95,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        "」モードに切り替えますか？"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '12px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onCancel,
                            style: {
                                padding: '10px 20px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                fontSize: '14px'
                            },
                            children: "キャンセル"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onConfirm,
                            style: {
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '6px',
                                backgroundColor: '#ff9800',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            },
                            children: "切り替える"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                            lineNumber: 116,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ModeChangeConfirmDialog.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = ModeChangeConfirmDialog;
var _c;
__turbopack_context__.k.register(_c, "ModeChangeConfirmDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/create-mcq/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/react/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ProblemContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ProblemContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CreationModeSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CreationModeSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AutoGenerationMode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AutoGenerationMode.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ManualCreationMode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ManualCreationMode.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ExplanationChatContainer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ExplanationChatContainer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ModeChangeConfirmDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ModeChangeConfirmDialog.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
const QuizCreationPage = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { problemData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ProblemContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProblem"])();
    const learningTopic = problemData.learningTopic || '';
    const [creationMode, setCreationMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('auto');
    const [explanation, setExplanation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [generatedQuiz, setGeneratedQuiz] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showModeChangeDialog, setShowModeChangeDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pendingMode, setPendingMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('auto');
    const [isGenerating, setIsGenerating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasManualData, setHasManualData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isChatPopupOpen, setIsChatPopupOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [codeWithBlanks, setCodeWithBlanks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(problemData.code);
    const [editedProblem, setEditedProblem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(problemData.problem);
    const editorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const monacoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const decorationsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const handleBackToHome = ()=>{
        router.push('/create-quiz');
    };
    const handleQuizGenerated = (quiz)=>{
        setGeneratedQuiz(quiz);
        setExplanation(quiz.explanation);
    // 自動生成時でも元のコードを保持するため、codeWithBlanksの更新をしない
    // if (quiz.codeWithBlanks) {
    //   setCodeWithBlanks(quiz.codeWithBlanks);
    // }
    };
    const handleModeChangeRequest = (newMode)=>{
        // 編集内容があるかチェック
        const hasAutoContent = generatedQuiz !== null || explanation.trim() !== '';
        const hasEditingContent = hasAutoContent || hasManualData;
        if (hasEditingContent) {
            setPendingMode(newMode);
            setShowModeChangeDialog(true);
        } else {
            // 編集内容がない場合は直接変更
            setCreationMode(newMode);
        }
    };
    const handleModeChangeConfirm = ()=>{
        // 状態をリセット
        setGeneratedQuiz(null);
        setExplanation('');
        setHasManualData(false);
        setCodeWithBlanks(problemData.code);
        setEditedProblem(problemData.problem);
        setCreationMode(pendingMode);
        setShowModeChangeDialog(false);
    };
    const handleCodeChange = (value)=>{
        setCodeWithBlanks(value || '');
    };
    const handleCodeReset = ()=>{
        setCodeWithBlanks(problemData.code);
    };
    const handleProblemReset = ()=>{
        setEditedProblem(problemData.problem);
    };
    const getLanguageLabel = (language)=>{
        const languageMap = {
            typescript: 'TypeScript',
            javascript: 'JavaScript',
            python: 'Python',
            java: 'Java',
            cpp: 'C++',
            c: 'C',
            csharp: 'C#',
            go: 'Go',
            rust: 'Rust',
            php: 'PHP',
            ruby: 'Ruby',
            swift: 'Swift',
            kotlin: 'Kotlin',
            html: 'HTML',
            css: 'CSS',
            json: 'JSON',
            sql: 'SQL',
            shell: 'Shell'
        };
        return languageMap[language] || language;
    };
    const handleModeChangeCancel = ()=>{
        setShowModeChangeDialog(false);
    };
    // ハイライト更新関数
    const updateHighlights = ()=>{
        if (editorRef.current && monacoRef.current && creationMode === 'manual') {
            const model = editorRef.current.getModel();
            if (model) {
                const text = model.getValue();
                const decorations = [];
                const regex = /___BLANK___/g;
                let match;
                console.log('Updating highlights for manual mode, text:', text);
                while((match = regex.exec(text)) !== null){
                    const startPos = model.getPositionAt(match.index);
                    const endPos = model.getPositionAt(match.index + match[0].length);
                    console.log('Found ___BLANK___ at:', startPos, 'to', endPos);
                    decorations.push({
                        range: new monacoRef.current.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column),
                        options: {
                            inlineClassName: 'my-blank-highlight'
                        }
                    });
                }
                console.log('Applying decorations:', decorations);
                // 古いデコレーションを削除して新しいものを適用
                decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, decorations);
            }
        }
    };
    // creationModeが変更されたときにハイライトを更新
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuizCreationPage.useEffect": ()=>{
            console.log('creationMode changed to:', creationMode);
            updateHighlights();
        }
    }["QuizCreationPage.useEffect"], [
        creationMode,
        codeWithBlanks
    ]);
    const handleFinish = ()=>{
        if (!explanation.trim()) {
            alert('解説を入力してください');
            return;
        }
        // TODO: 問題の保存・エクスポート機能を実装
        alert('問題が完成しました！（保存機能は今後実装予定）');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            position: 'relative'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: isChatPopupOpen ? '70%' : '100%',
                    height: '100vh',
                    minWidth: 0,
                    flex: isChatPopupOpen ? '0 0 70%' : '1 1 100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '16px',
                            backgroundColor: '#f8f9fa',
                            borderBottom: '1px solid #ddd',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: '18px',
                                            margin: 0,
                                            color: '#2c3e50',
                                            borderLeft: '4px solid #3498db',
                                            paddingLeft: '12px'
                                        },
                                        children: "選択式問題の作成"
                                    }, void 0, false, {
                                        fileName: "[project]/app/create-mcq/page.tsx",
                                        lineNumber: 194,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: '30px',
                                            width: '1px',
                                            backgroundColor: '#bbb',
                                            margin: '0 4px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/create-mcq/page.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: '#666',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                },
                                                children: "📚学習項目："
                                            }, void 0, false, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 211,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    padding: '6px 14px',
                                                    border: '2px solid #e3f2fd',
                                                    borderRadius: '20px',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#e3f2fd',
                                                    color: '#1976d2',
                                                    boxShadow: '0 2px 4px rgba(33, 150, 243, 0.15)',
                                                    minWidth: '120px',
                                                    textAlign: 'center',
                                                    position: 'relative'
                                                },
                                                children: learningTopic || '未設定'
                                            }, void 0, false, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 220,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create-mcq/page.tsx",
                                        lineNumber: 210,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/create-mcq/page.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setIsChatPopupOpen(true),
                                        style: {
                                            padding: '6px 12px',
                                            border: '1px solid #4CAF50',
                                            borderRadius: '4px',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        },
                                        children: "💬 解説相談"
                                    }, void 0, false, {
                                        fileName: "[project]/app/create-mcq/page.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleBackToHome,
                                        style: {
                                            padding: '6px 12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        },
                                        children: "← 戻る"
                                    }, void 0, false, {
                                        fileName: "[project]/app/create-mcq/page.tsx",
                                        lineNumber: 253,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/create-mcq/page.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/create-mcq/page.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            padding: '20px',
                            backgroundColor: '#fafafa',
                            overflow: 'auto',
                            minHeight: 0,
                            position: 'relative'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CreationModeSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreationModeSelector"], {
                                value: creationMode,
                                onChange: setCreationMode,
                                onModeChangeRequest: handleModeChangeRequest,
                                disabled: isGenerating
                            }, void 0, false, {
                                fileName: "[project]/app/create-mcq/page.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            creationMode === 'manual' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: '24px',
                                    padding: '16px',
                                    backgroundColor: '#fff3cd',
                                    border: '1px solid #ffeaa7',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(255, 193, 7, 0.1)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '12px',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '20px'
                                                },
                                                children: "📝"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 302,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    margin: 0,
                                                    color: '#856404'
                                                },
                                                children: "手動作成の手順"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 303,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create-mcq/page.tsx",
                                        lineNumber: 296,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                        style: {
                                            fontSize: '14px',
                                            lineHeight: '1.6',
                                            color: '#856404',
                                            paddingLeft: '20px',
                                            margin: '0'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                style: {
                                                    marginBottom: '6px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "問題文"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create-mcq/page.tsx",
                                                        lineNumber: 320,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "と",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "解答コード"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create-mcq/page.tsx",
                                                        lineNumber: 320,
                                                        columnNumber: 40
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "エリアで内容を編集"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 319,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                style: {
                                                    marginBottom: '6px'
                                                },
                                                children: [
                                                    "解答コードでは空欄を",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                            style: {
                                                                backgroundColor: '#fff8dc',
                                                                padding: '2px 4px',
                                                                borderRadius: '3px',
                                                                fontSize: '13px'
                                                            },
                                                            children: "___BLANK___"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/create-mcq/page.tsx",
                                                            lineNumber: 323,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create-mcq/page.tsx",
                                                        lineNumber: 323,
                                                        columnNumber: 29
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "で表現してください"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 322,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                style: {
                                                    marginBottom: '6px'
                                                },
                                                children: [
                                                    "下の",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "選択肢"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create-mcq/page.tsx",
                                                        lineNumber: 331,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "を入力（選択肢Aが正答です）"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 330,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "「リセットする」"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create-mcq/page.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "ボタンで問題文・コードを元に戻せます"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 333,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create-mcq/page.tsx",
                                        lineNumber: 312,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/create-mcq/page.tsx",
                                lineNumber: 288,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: '20px',
                                    display: 'flex',
                                    gap: '20px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '8px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        style: {
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                            margin: 0
                                                        },
                                                        children: "作成した問題文"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create-mcq/page.tsx",
                                                        lineNumber: 354,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    creationMode === 'manual' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleProblemReset,
                                                        style: {
                                                            padding: '6px 12px',
                                                            backgroundColor: '#ff9800',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px',
                                                            fontWeight: 'bold'
                                                        },
                                                        children: "リセットする"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create-mcq/page.tsx",
                                                        lineNumber: 358,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 348,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            creationMode === 'manual' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: editedProblem || '',
                                                onChange: (e)=>setEditedProblem(e.target.value),
                                                placeholder: "問題文を入力してください",
                                                style: {
                                                    width: '97%',
                                                    padding: '12px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    lineHeight: '1.6',
                                                    height: '500px',
                                                    resize: 'vertical',
                                                    fontFamily: 'inherit'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 376,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    padding: '12px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    backgroundColor: 'white',
                                                    fontSize: '14px',
                                                    lineHeight: '1.6',
                                                    minHeight: '500px',
                                                    overflow: 'auto',
                                                    whiteSpace: 'pre-wrap'
                                                },
                                                children: problemData.problem || '問題文が入力されていません'
                                            }, void 0, false, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 393,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create-mcq/page.tsx",
                                        lineNumber: 347,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '8px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        style: {
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                            margin: 0
                                                        },
                                                        children: [
                                                            "作成した解答コード (",
                                                            getLanguageLabel(problemData.language),
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/create-mcq/page.tsx",
                                                        lineNumber: 417,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    creationMode == 'manual' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleCodeReset,
                                                        style: {
                                                            padding: '6px 12px',
                                                            backgroundColor: '#ff9800',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px',
                                                            fontWeight: 'bold'
                                                        },
                                                        children: "リセットする"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create-mcq/page.tsx",
                                                        lineNumber: 420,
                                                        columnNumber: 47
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 411,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    height: '500px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                                                    height: "100%",
                                                    language: problemData.language,
                                                    value: codeWithBlanks || problemData.code,
                                                    onChange: creationMode === 'manual' ? handleCodeChange : undefined,
                                                    onMount: (editor, monaco)=>{
                                                        console.log('Monaco Editor mounted, creationMode:', creationMode);
                                                        // エディタとmonacoのrefを保存
                                                        editorRef.current = editor;
                                                        monacoRef.current = monaco;
                                                        // テキスト変更時にハイライトを更新
                                                        editor.onDidChangeModelContent(()=>{
                                                            updateHighlights();
                                                        });
                                                        // 初期ハイライト
                                                        updateHighlights();
                                                    },
                                                    options: {
                                                        readOnly: creationMode !== 'manual',
                                                        minimap: {
                                                            enabled: false
                                                        },
                                                        fontSize: 14,
                                                        lineNumbers: 'on',
                                                        wordWrap: 'on',
                                                        scrollBeyondLastLine: false,
                                                        automaticLayout: true
                                                    },
                                                    theme: "vs-light"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/create-mcq/page.tsx",
                                                    lineNumber: 437,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 436,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: '12px',
                                                    color: '#666',
                                                    marginTop: '4px',
                                                    marginBottom: '0'
                                                },
                                                children: creationMode === 'manual' ? '空欄は「_ _ _BLANK_ _ _」で表現してください（編集可能）' : '自動生成モード（表示のみ）'
                                            }, void 0, false, {
                                                fileName: "[project]/app/create-mcq/page.tsx",
                                                lineNumber: 468,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create-mcq/page.tsx",
                                        lineNumber: 410,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/create-mcq/page.tsx",
                                lineNumber: 341,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            creationMode === 'auto' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AutoGenerationMode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AutoGenerationMode"], {
                                learningTopic: learningTopic,
                                onQuizGenerated: handleQuizGenerated,
                                onGeneratingStateChange: setIsGenerating
                            }, void 0, false, {
                                fileName: "[project]/app/create-mcq/page.tsx",
                                lineNumber: 484,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ManualCreationMode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ManualCreationMode"], {
                                learningTopic: learningTopic,
                                onManualDataChange: setHasManualData
                            }, void 0, false, {
                                fileName: "[project]/app/create-mcq/page.tsx",
                                lineNumber: 490,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            (generatedQuiz || creationMode === 'manual') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    marginTop: '20px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleFinish,
                                    style: {
                                        padding: '12px 30px',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    },
                                    children: "問題作成完了"
                                }, void 0, false, {
                                    fileName: "[project]/app/create-mcq/page.tsx",
                                    lineNumber: 499,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/create-mcq/page.tsx",
                                lineNumber: 498,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/create-mcq/page.tsx",
                        lineNumber: 270,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/create-mcq/page.tsx",
                lineNumber: 174,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: isChatPopupOpen ? '30%' : '0%',
                    height: '100vh',
                    minWidth: 0,
                    flex: isChatPopupOpen ? '0 0 30%' : '0 0 0%',
                    borderLeft: isChatPopupOpen ? '1px solid #ddd' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: 'white',
                    overflow: 'hidden',
                    opacity: isChatPopupOpen ? 1 : 0,
                    visibility: isChatPopupOpen ? 'visible' : 'hidden'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px 20px',
                            borderBottom: '1px solid #ddd',
                            backgroundColor: '#f8f9fa'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                },
                                children: "解説相談"
                            }, void 0, false, {
                                fileName: "[project]/app/create-mcq/page.tsx",
                                lineNumber: 543,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '8px',
                                    alignItems: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            // 履歴クリア処理
                                            localStorage.removeItem('explanationChatMessages');
                                            window.location.reload();
                                        },
                                        style: {
                                            padding: '4px 8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        },
                                        children: "🗑️ 履歴クリア"
                                    }, void 0, false, {
                                        fileName: "[project]/app/create-mcq/page.tsx",
                                        lineNumber: 545,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setIsChatPopupOpen(false),
                                        style: {
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            color: '#666',
                                            padding: '0',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        },
                                        children: "×"
                                    }, void 0, false, {
                                        fileName: "[project]/app/create-mcq/page.tsx",
                                        lineNumber: 562,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/create-mcq/page.tsx",
                                lineNumber: 544,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/create-mcq/page.tsx",
                        lineNumber: 535,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            overflow: 'hidden'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                height: '100%'
                            },
                            children: isChatPopupOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ExplanationChatContainer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExplanationChatContainer"], {
                                showHeader: false
                            }, void 0, false, {
                                fileName: "[project]/app/create-mcq/page.tsx",
                                lineNumber: 589,
                                columnNumber: 35
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/app/create-mcq/page.tsx",
                            lineNumber: 588,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/app/create-mcq/page.tsx",
                        lineNumber: 584,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/create-mcq/page.tsx",
                lineNumber: 520,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ModeChangeConfirmDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModeChangeConfirmDialog"], {
                isOpen: showModeChangeDialog,
                newMode: pendingMode,
                onConfirm: handleModeChangeConfirm,
                onCancel: handleModeChangeCancel
            }, void 0, false, {
                fileName: "[project]/app/create-mcq/page.tsx",
                lineNumber: 595,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/create-mcq/page.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(QuizCreationPage, "n2E1Cb/m99N2AfOLW/3qW0EULcQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ProblemContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProblem"]
    ];
});
_c = QuizCreationPage;
const __TURBOPACK__default__export__ = QuizCreationPage;
var _c;
__turbopack_context__.k.register(_c, "QuizCreationPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_54613216._.js.map