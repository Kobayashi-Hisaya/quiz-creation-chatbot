import type { DataProblemTemplateData } from './gasClientService';

class AssessmentService {
	private baseSystemMessage: string;
	private currentExplanation: string;
	private currentSpreadsheetData: DataProblemTemplateData | null = null;

	constructor() {
		// 初期化時は空の状態
		// setProblemContextで問題コンテキストとともにシステムメッセージを設定する
		this.baseSystemMessage = '';
		this.currentExplanation = '';
	}

	// 問題コンテキストを設定するメソッド（システムメッセージを初期化）
	setProblemContext(problemText: string, answerText: string): void {
		this.baseSystemMessage = `
# 役割
あなたは，情報系の大学に勤務している大学教員です．

## 命令
今から，作問学習において指導学生が作成した，プログラミングに関する作問（問題文・解答・解説）を提示します．その作問を診断してください．その後，診断結果に基づいたフィードバックをください．診断の詳細は以下にあるプロセスに則ってください．

---

## プロセス
入力を受け取り、以下の手順に従って、学生に対する自然な応答を生成しなさい． 「#診断項目」「#診断規則」に則った診断をしなさい。

1. 問題データを読取り、以下の【#診断項目】に沿って作問を診断しなさい
2. 以下の2つの出力を生成しなさい、出力はmarkdown形式で整形しなさい。 
  a. 診断結果：各診断項目における診断結果 
  b. フィードバック：学生が今後どのように修正すればいいか、今後の指針を提示してください。 

---

## 診断項目：診断基準（何を満たすべきか？）
Ⅰ. 誤字：作問中に誤字（同音異義語の変換ミス）がない
Ⅱ. 脱字：作問中に脱字（文字の不足）がない
Ⅲ. 衍字：作問中に衍字（余分な文字）がない
Ⅳ. 用語の統一：作問中で用語の表記ゆれがない。呼称が一貫している。

---

## 診断規則
Ⅰ~Ⅳでは、複数の誤りを検出した場合は、全ての改善点を漏れなく指摘すること。指摘漏れがないように、診断基準ごとに必ず再チェックをしなさい。
改善点を指摘する場合は，必ず根拠を併せて述べること。
指摘の際は、【具体的な指摘箇所】と【修正案を提示】しなさい。
例：問題文〇行目の『△△』を『✖✖』に変更してください
　　解答〇〇行目の『△△』の部分に余分な文字が入っています
　　解説文〇行目の『△△』が誤字です。『✖』を追加してください

---

## 学習者が作成した問題文
${problemText}

## 解答
${answerText}

## 解説
{EXPLANATION}

## スプレッドシートの内容
{SPREADSHEET_DATA}`;

		console.log('[AssessmentService] 問題コンテキスト設定完了');
	}

	// 解説テキストを設定するメソッド
	setExplanation(explanation: string): void {
		this.currentExplanation = explanation;
	}

	// スプレッドシートデータを設定するメソッド
	setSpreadsheetData(data: DataProblemTemplateData | null): void {
		this.currentSpreadsheetData = data;
	}

	// システムメッセージのプレースホルダーを置き換えて取得
	private getCurrentSystemMessage(): string {
		const explanationText = this.currentExplanation || '(未入力)';

		let spreadsheetInfo = '';
		if (this.currentSpreadsheetData) {
			const { sheets, lastModified } = this.currentSpreadsheetData;

			if (!sheets || sheets.length === 0) {
				spreadsheetInfo = 'スプレッドシートデータは未取得です。';
			} else {
				// 全シートのデータをフォーマット
				const sheetsDisplay = sheets.map((sheet, sheetIndex) => {
					const { sheetName, quizData, lastRow, lastColumn } = sheet;

					let dataDisplay = '';
					if (!quizData || quizData.length === 0) {
						dataDisplay = 'データなし（8行目以降に入力がありません）';
					} else if (quizData.length <= 100) {
						// 100セル以下: 全データを表示
						dataDisplay = quizData.map((cell) =>
							`${cell.cellAddress}: ${cell.value}`
						).join('\n');
					} else {
						// 100セル超: 最初の50セル + 最後の10セルを表示
						const firstCells = quizData.slice(0, 50).map(cell =>
							`${cell.cellAddress}: ${cell.value}`
						).join('\n');
						const lastCells = quizData.slice(-10).map(cell =>
							`${cell.cellAddress}: ${cell.value}`
						).join('\n');
						dataDisplay = `${firstCells}\n...(${quizData.length - 60}セル省略)...\n${lastCells}`;
					}

					return `
=== シート${sheetIndex + 1}: "${sheetName}" ===
使用範囲: ${lastRow}行 × ${lastColumn}列
データセル数: ${quizData?.length || 0}セル（空白セル除く）
問題文：${sheet.problemText || '未入力'}
回答：${sheet.answerText || '未入力'}

データ（8行目以降）:
${dataDisplay}
`;
				}).join('\n');

				spreadsheetInfo = `
スプレッドシート全体の概要:
- シート数: ${sheets.length}
- 最終更新: ${lastModified || '不明'}

${sheetsDisplay}
      `;
			}
		} else {
			spreadsheetInfo = 'スプレッドシートデータは未取得です。';
		}

		return this.baseSystemMessage
			.replace(/{EXPLANATION}/g, explanationText)
			.replace(/{SPREADSHEET_DATA}/g, spreadsheetInfo);
	}

	/**
	 * AI診断を実行（同期されたデータを使用）
	 */
	async runDiagnosis(): Promise<string> {
		try {
			console.log('[AssessmentService] 診断開始');

			// 同期されたデータから現在のシステムメッセージを生成
			const systemMessage = this.getCurrentSystemMessage();

			// ユーザーメッセージを構築（診断開始のトリガー）
			const userMessage = '上記の問題文、解答、解説、スプレッドシートの内容をもとに診断を行ってください。';

			// ***メッセージを構築***
			const messages = [
				{
					role: 'user',
					content: userMessage
				}
			];

			console.log('[AssessmentService] システムメッセージ長:', systemMessage.length);



			// APIリクエスト
			const response = await fetch('/api/agent-assessment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					messages: messages,
					systemPrompt: systemMessage, // 同期されたデータを含むシステムメッセージ
					model: 'gpt-5-chat-latest',
                    // reasoning_effort: 'high',
                    // verbosity: 'low'
				}),
			});

            

			console.log('[AssessmentService] レスポンス受信:', {
				status: response.status,
				statusText: response.statusText,
				ok: response.ok
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('[AssessmentService] エラーレスポンス:', errorText);
				throw new Error(`診断リクエストが失敗しました (Status: ${response.status})`);
			}

			const data = await response.json();
			console.log('[AssessmentService] レスポンスJSON:', data);

			// レスポンスの形式に応じて処理
			const diagnosisText = data.content || data.reply || 'AI応答が得られませんでした。';
			console.log('[AssessmentService] 診断結果:', diagnosisText);

			return diagnosisText;
		} catch (error) {
			console.error('[AssessmentService] 診断エラー:', error);
			throw new Error('診断処理中にエラーが発生しました。詳細はコンソールを確認してください。');
		}
	}
}

// シングルトンインスタンスをエクスポート
export const assessmentService = new AssessmentService();
