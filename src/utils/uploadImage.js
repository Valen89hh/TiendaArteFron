import { supabase } from "../services/supabaseClient";

export async function uploadImage(file, folder = 'obras') {
  if (!file) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('images')   // nombre del bucket en Supabase
    .upload(fileName, file);

    console.log(data)

  if (error) throw error;

  const { data: dataUrl} = supabase.storage
    .from('images')
    .getPublicUrl(data.path);

  if (!dataUrl.publicUrl) throw Error("Ocurio un error");
  return dataUrl.publicUrl;
}