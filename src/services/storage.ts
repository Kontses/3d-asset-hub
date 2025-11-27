import { supabase } from '@/lib/supabase';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export async function uploadGLBFile(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  // Simulate progress since Supabase Storage doesn't provide native progress events
  let uploadedBytes = 0;
  const totalBytes = file.size;

  const progressInterval = setInterval(() => {
    uploadedBytes += totalBytes / 20; // Simulate progress
    if (uploadedBytes > totalBytes) uploadedBytes = totalBytes;
    
    onProgress?.({
      loaded: uploadedBytes,
      total: totalBytes,
      percentage: Math.round((uploadedBytes / totalBytes) * 100),
    });
  }, 100);

  try {
    const { data, error } = await supabase.storage
      .from('glb-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    clearInterval(progressInterval);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('glb-files')
      .getPublicUrl(data.path);

    // Final progress update
    onProgress?.({
      loaded: totalBytes,
      total: totalBytes,
      percentage: 100,
    });

    return publicUrl;
  } catch (error) {
    clearInterval(progressInterval);
    throw error;
  }
}

export async function deleteGLBFile(filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from('glb-files')
    .remove([filePath]);

  if (error) throw error;
}

export function getFilePathFromUrl(url: string): string {
  const urlObj = new URL(url);
  const pathSegments = urlObj.pathname.split('/');
  // Remove the first segments until we reach the actual file path
  const filePathIndex = pathSegments.indexOf('glb-files') + 1;
  return pathSegments.slice(filePathIndex).join('/');
}
