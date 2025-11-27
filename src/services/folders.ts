import { supabase } from '@/lib/supabase';
import { Folder } from '@/types/folder';

export async function getFolders(parentId?: string | null) {
  const query = supabase
    .from('folders')
    .select('*')
    .order('created_at', { ascending: false });

  if (parentId === null) {
    query.is('parent_id', null);
  } else if (parentId) {
    query.eq('parent_id', parentId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Folder[];
}

export async function createFolder(name: string, parentId?: string | null) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('folders')
    .insert({
      name,
      parent_id: parentId || null,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Folder;
}

export async function updateFolder(id: string, name: string) {
  const { data, error } = await supabase
    .from('folders')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Folder;
}

export async function deleteFolder(id: string) {
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function moveFolderToFolder(folderId: string, targetFolderId: string | null) {
  const { data, error } = await supabase
    .from('folders')
    .update({ parent_id: targetFolderId })
    .eq('id', folderId)
    .select()
    .single();

  if (error) throw error;
  return data as Folder;
}
