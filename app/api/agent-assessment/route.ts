import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

interface AssessmentRequest {
  spreadsheetId: string;
  problemId?: string | null;
  userId?: string | null;
  saveToDb?: boolean; // 診断結果を DB に保存するかどうか（デフォルト: false）
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AssessmentRequest;
    const { spreadsheetId, problemId, userId, saveToDb = false } = body;

    if (!spreadsheetId) {
      return NextResponse.json({ error: 'spreadsheetId is required' }, { status: 400 });
    }

    // Fetch sheet data from GAS
    const gasWebAppUrl = process.env.GAS_WEB_APP_URL;
    if (!gasWebAppUrl) {
      return NextResponse.json({ error: 'GAS_WEB_APP_URL not configured' }, { status: 500 });
    }

    const gasResponse = await fetch(gasWebAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getSheetData', spreadsheetId })
    });

    if (!gasResponse.ok) {
      const text = await gasResponse.text();
      throw new Error(`GAS responded ${gasResponse.status}: ${text}`);
    }

    const gasResult = await gasResponse.json();
    if (!gasResult.success || !gasResult.data) {
      throw new Error(gasResult.error || 'Invalid GAS response');
    }

    const sheets = gasResult.data.sheets;
    const primary = sheets?.[0] || null;

    const problemText = primary?.problemText || '';
    const answerText = primary?.answerText || '';
    const quizData = primary?.quizData || [];
    const startRow = primary?.startRow ?? null;
    const startColumn = primary?.startColumn ?? null;
    const lastRow = primary?.lastRow ?? null;
    const lastColumn = primary?.lastColumn ?? null;

    // Build prompt
    const systemPrompt = `あなたは，情報系の大学に勤務している大学教員です．今から，作問学習において指導学生が作成した，プログラミングに関する作問（問題文・解答・解説）を提示します．その作問を診断してください．その後，診断結果に基づいたフィードバックをください．診断の詳細は以下にあるプロセスに則ってください．\n\nプロセス：\n1. スプレッドシートのデータを読取り、以下の【#診断項目】に沿って作問を診断しなさい\n2. 以下の2つの出力を生成しなさい、出力はmarkdown形式で整形しなさい。\n a. 診断結果：各診断項目における診断結果 \n b. フィードバック：学生が今後どのように修正すればいいか、今後の指針を提示してください。\n\n診断項目：\nⅠ. 誤字（同音異義語の変換ミス）\nⅡ. 脱字（文字の不足）\nⅢ. 衍字（余分な文字）\nⅣ. 用語の統一（表記ゆれの有無）\n\n診断規則：複数の誤りを検出した場合は、全ての改善点を漏れなく指摘すること。指摘の際は、【具体的な指摘箇所】と【修正案を提示】しなさい。`;

    const userContent = `スプレッドシートID: ${spreadsheetId}\n問題文:\n${problemText}\n\n回答:\n${answerText}\n\nquizData (first 2000 chars):\n${JSON.stringify(quizData).slice(0, 2000)}\n\nデータ範囲: startRow=${startRow}, startColumn=${startColumn}, lastRow=${lastRow}, lastColumn=${lastColumn}\n\n上記のデータを読み取り、指定の「診断項目」「診断規則」に基づいて診断を行ってください。出力はMarkdown形式で、"診断結果" と "フィードバック" の2セクションに分けてください。`;

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
    }

    // Call OpenAI Responses API
    const openaiResp = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        input: `${systemPrompt}\n\n${userContent}`,
        max_output_tokens: 8000,
        temperature: 0.0,
      })
    });

    if (!openaiResp.ok) {
      const text = await openaiResp.text();
      throw new Error(`OpenAI responded ${openaiResp.status}: ${text}`);
    }

    const openaiResult = await openaiResp.json();

    // Extract textual output - attempt multiple fallbacks
    let diagnosisText = '';
    try {
      // Responses API: output[0].content may contain array with {type:'output_text', text}
      if (openaiResult.output && Array.isArray(openaiResult.output)) {
        diagnosisText = openaiResult.output.map((o: any) => {
          if (typeof o === 'string') return o;
          if (o.content) {
            if (Array.isArray(o.content)) return o.content.map((c: any) => c.text || '').join('');
            return o.content.text || '';
          }
          return '';
        }).join('\n');
      } else if (openaiResult.output_text) {
        diagnosisText = openaiResult.output_text;
      } else if (openaiResult.choices && openaiResult.choices[0]) {
        diagnosisText = openaiResult.choices.map((c: any) => c.text || c.message?.content || '').join('\n');
      } else {
        diagnosisText = JSON.stringify(openaiResult);
      }
    } catch (e) {
      diagnosisText = JSON.stringify(openaiResult);
    }

    // Persist to Supabase chat_histories (オプション)
    // 修正方針: 診断実行の度に DB 保存するとタイムアウトリスクがあるため、
    // saveToDb フラグが true の場合のみ保存する。通常の診断時は false で実行。
    if (saveToDb) {
      try {
        const messages = [
          {
            role: 'assistant',
            content: diagnosisText,
            timestamp: new Date().toISOString(),
          }
        ];

        const insertPayload: any = {
          problem_id: problemId || null,
          user_id: userId || null,
          chat_type: 'assessment',
          messages,
        };

        // タイムアウト保護を追加（60秒）
        const insertPromise = supabase.from('chat_histories').insert([insertPayload]).select().single();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Assessment DB insert timeout')), 60000)
        );

        const { data, error } = await Promise.race([insertPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error('Failed to insert assessment chat_history:', error);
        } else {
          console.log('Assessment chat_history saved:', data?.id);
        }
      } catch (err) {
        console.error('Error saving assessment result to Supabase:', err);
        // DB 保存失敗してもエラーにしない（診断結果は返す）
      }
    } else {
      console.log('[agent-assessment] DB 保存スキップ（saveToDb=false）');
    }

    return NextResponse.json({ success: true, diagnosis: diagnosisText });

  } catch (error) {
    console.error('agent-assessment error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
