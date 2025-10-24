"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '../types/database';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('[AuthContext] 初期化開始');

  useEffect(() => {
    console.log('[AuthContext] useEffect 実行開始');
    
    const initializeAuth = async () => {
      try {
        console.log('[AuthContext] getSession 呼び出し');
        const { data, error } = await supabase.auth.getSession();

        console.log('[AuthContext] getSession 結果:', {
          hasSession: !!data.session,
          userId: data.session?.user?.id,
          email: data.session?.user?.email,
          hasError: !!error
        });

        if (error) {
          console.error('[AuthContext] getSession エラー:', error);
          setLoading(false);
          return;
        }

        if (data.session?.user?.id) {
          console.log('[AuthContext] セッションユーザーあり:', data.session.user.id);
          setUser(data.session.user as User);
          setSession(data.session);
          console.log('[AuthContext] fetchProfile を呼び出し');
          await fetchProfile(data.session.user.id);
        } else {
          console.log('[AuthContext] セッションなし、loading を false に');
          setLoading(false);
        }
      } catch (error) {
        console.error('[AuthContext] initializeAuth エラー:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('[AuthContext] onAuthStateChange イベント:', {
        event: _event,
        hasSession: !!session,
        userId: session?.user?.id
      });
      
      if (session?.user) {
        console.log('[AuthContext] onAuthStateChange: setUser 実行');
        setSession(session);
        setUser(session.user as User);
        console.log('[AuthContext] onAuthStateChange: fetchProfile 呼び出し');
        await fetchProfile(session.user.id);
      } else {
        console.log('[AuthContext] onAuthStateChange: ユーザーなし');
        setProfile(null);
        setUser(null);
        setSession(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('[AuthContext] useEffect cleanup: subscription.unsubscribe() 実行');
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    console.log('[AuthContext] fetchProfile 開始:', { userId });
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('[AuthContext] fetchProfile 結果:', {
        hasData: !!data,
        hasError: !!error,
        errorCode: error?.code,
        errorMessage: error?.message
      });

      if (error) {
        console.error('[AuthContext] fetchProfile エラー:', error);
        // プロファイルが存在しない場合は作成する
        if (error.code === 'PGRST116') {
          console.log('[AuthContext] プロファイルが存在しない、作成を試みる');
          await createProfile(userId);
        }
      } else {
        console.log('[AuthContext] プロファイル取得成功:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('[AuthContext] fetchProfile 例外:', error);
    } finally {
      console.log('[AuthContext] fetchProfile 完了、loading を false に');
      setLoading(false);
    }
  };

  const createProfile = async (userId: string) => {
    console.log('[AuthContext] createProfile 開始:', { userId });
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData.user?.email || '';

      console.log('[AuthContext] createProfile: INSERT 実行前:', { userId, email });

      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: email,
            is_admin: false,
          },
        ])
        .select()
        .single();

      console.log('[AuthContext] createProfile: INSERT 結果:', {
        hasData: !!data,
        hasError: !!error,
        errorCode: error?.code,
        errorMessage: error?.message
      });

      if (error) {
        console.error('[AuthContext] createProfile エラー:', error);
      } else {
        console.log('[AuthContext] プロファイル作成成功:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('[AuthContext] createProfile 例外:', error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error signing in with email:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in signInWithEmail:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  };

  const isAdmin = profile?.is_admin ?? false;

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signInWithEmail,
    signOut,
    isAdmin,
  };

  // エラーが発生した場合は表示
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <h2 style={{ color: '#e74c3c' }}>認証エラー</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          再読み込み
        </button>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
