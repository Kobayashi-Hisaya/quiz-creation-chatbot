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

  useEffect(() => {
    // 初期セッションの取得
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error getting session:', err);
        setError('認証の初期化に失敗しました');
        setLoading(false);
      });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // プロファイルが存在しない場合は作成する
        if (error.code === 'PGRST116') {
          await createProfile(userId);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData.user?.email || '';

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

      if (error) {
        console.error('Error creating profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in createProfile:', error);
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
