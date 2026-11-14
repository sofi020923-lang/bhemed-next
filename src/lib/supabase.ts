import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase - lista para usar con provider remoto
// Cuando no hay variables de entorno, se usa modo local (SQLite)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = !!supabase;

export async function signUpWithSupabase(email: string, password: string, nombre: string, apellido: string) {
  if (!supabase) throw new Error('Supabase no está configurado');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre, apellido },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithSupabase(email: string, password: string) {
  if (!supabase) throw new Error('Supabase no está configurado');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOutSupabase() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPasswordSupabase(email: string) {
  if (!supabase) throw new Error('Supabase no está configurado');
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
}

export async function getCurrentUserSupabase() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}