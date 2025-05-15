'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata.name,
              avatar_url: session.user.user_metadata.avatar_url,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );

      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.name,
            avatar_url: session.user.user_metadata.avatar_url,
          });
        }
        setLoading(false);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize authentication');
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      return { error };
    } catch (err) {
      return { 
        error: {
          message: err instanceof Error ? err.message : 'Failed to sign in'
        }
      };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      return { error };
    } catch (err) {
      return { 
        error: {
          message: err instanceof Error ? err.message : 'Failed to sign up'
        }
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };
}