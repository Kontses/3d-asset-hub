import { supabase } from '@/lib/supabase';
import { Configuration } from '@/types/configuration';

export async function getConfigurations(productId?: string) {
  const query = supabase
    .from('configurations')
    .select('*')
    .order('created_at', { ascending: false });

  if (productId) {
    query.eq('product_id', productId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Configuration[];
}

export async function getConfiguration(id: string) {
  const { data, error } = await supabase
    .from('configurations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Configuration;
}

export async function getConfigurationByToken(shareToken: string) {
  const { data, error } = await supabase
    .from('configurations')
    .select('*, products(*)')
    .eq('share_token', shareToken)
    .eq('is_public', true)
    .single();

  if (error) throw error;
  return data;
}

export async function createConfiguration(
  config: Omit<Configuration, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'share_token'>
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const shareToken = generateShareToken();

  const { data, error } = await supabase
    .from('configurations')
    .insert({
      ...config,
      user_id: user.id,
      share_token: shareToken,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Configuration;
}

export async function updateConfiguration(id: string, updates: Partial<Configuration>) {
  const { data, error } = await supabase
    .from('configurations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Configuration;
}

export async function deleteConfiguration(id: string) {
  const { error } = await supabase
    .from('configurations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function toggleConfigurationPublic(id: string, isPublic: boolean) {
  const { data, error } = await supabase
    .from('configurations')
    .update({ is_public: isPublic })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Configuration;
}

function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
