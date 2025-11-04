import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface SaveAssessmentRequest {
  problemId: string;
  diagnosisResult: string;
  userInfo: {
    id: string;
    email?: string;
  };
}

export async function POST(request: NextRequest) {
  console.log('[save-assessment] Request received');

  try {
    const {
      problemId,
      diagnosisResult,
      userInfo,
    }: SaveAssessmentRequest = await request.json();

    console.log('[save-assessment] Saving assessment for problem:', problemId);
    console.log('[save-assessment] User:', userInfo.id);

    if (!problemId || !diagnosisResult || !userInfo.id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Supabase に診断結果を保存（chat_histories テーブル）
    const { data, error } = await supabase
      .from('chat_histories')
      .insert([
        {
          problem_id: problemId,
          user_id: userInfo.id,
          chat_type: 'assessment', // 診断結果
          messages: [
            {
              role: 'assistant',
              content: diagnosisResult,
              timestamp: new Date().toISOString(),
            },
          ],
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[save-assessment] Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('[save-assessment] Assessment saved successfully:', data.id);

    return NextResponse.json(
      {
        success: true,
        chatHistoryId: data.id,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[save-assessment] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
