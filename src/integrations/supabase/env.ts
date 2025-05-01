import { supabase } from './client';

export interface EnvVariable {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export async function getEnvVariable(key: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('env_variables')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      console.error('Error fetching environment variable:', error);
      return null;
    }

    return data?.value || null;
  } catch (error) {
    console.error('Error in getEnvVariable:', error);
    return null;
  }
}

export async function getAllEnvVariables(): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from('env_variables')
      .select('key, value');

    if (error) {
      console.error('Error fetching environment variables:', error);
      return {};
    }

    return data.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error('Error in getAllEnvVariables:', error);
    return {};
  }
}

// Initialize environment variables
let envCache: Record<string, string> = {};

export async function initializeEnv() {
  envCache = await getAllEnvVariables();
}

export function getEnv(key: string): string | undefined {
  return envCache[key];
} 