import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';

export async function getProducts(folderId?: string | null) {
  const query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (folderId === null) {
    query.is('folder_id', null);
  } else if (folderId) {
    query.eq('folder_id', folderId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Product[];
}

export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...product,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function moveProductToFolder(productId: string, folderId: string | null) {
  const { data, error } = await supabase
    .from('products')
    .update({ folder_id: folderId })
    .eq('id', productId)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}
