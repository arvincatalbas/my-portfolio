import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Sanitize the Supabase URL to handle trailing slashes and /rest/v1 suffixes automatically
let rawUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL || '').trim();
if (rawUrl.endsWith('/')) {
  rawUrl = rawUrl.slice(0, -1);
}
if (rawUrl.endsWith('/rest/v1')) {
  rawUrl = rawUrl.slice(0, -8);
}

const supabaseUrl = rawUrl;
const supabaseAnonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// Local Asset Mapping to bridge React Native require() statements with Supabase DB strings
const assetMap: Record<string, any> = {
  'project_web': require('../../assets/images/project_web.png'),
  'project_mobile': require('../../assets/images/project_mobile.png'),
  'certificate_claude': require('../../assets/images/certificate_claude.png'),
  'certificate_eim': require('../../assets/images/certificate_eim.png'),
  'certificate_expo': require('../../assets/images/certificate_expo.png'),
  'certificate_js': require('../../assets/images/certificate_js.png'),
  'certificate_networking': require('../../assets/images/certificate_networking.png'),
  'certificate_react': require('../../assets/images/certificate_react.png'),
  'profile_avatar': require('../../assets/images/profile_avatar.png'),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'https://your-project-id.supabase.co' && supabaseUrl !== '';
};

// Convert local require asset or uri object to database string
export const serializeImage = (image: any): string | null => {
  if (!image) return null;
  
  if (typeof image === 'object' && image.uri) {
    return image.uri;
  }

  const imageStr = String(image);
  if (imageStr.includes('project_web')) return 'asset:project_web';
  if (imageStr.includes('project_mobile')) return 'asset:project_mobile';
  if (imageStr.includes('certificate_claude')) return 'asset:certificate_claude';
  if (imageStr.includes('certificate_eim')) return 'asset:certificate_eim';
  if (imageStr.includes('certificate_expo')) return 'asset:certificate_expo';
  if (imageStr.includes('certificate_js')) return 'asset:certificate_js';
  if (imageStr.includes('certificate_networking')) return 'asset:certificate_networking';
  if (imageStr.includes('certificate_react')) return 'asset:certificate_react';
  if (imageStr.includes('profile_avatar')) return 'asset:profile_avatar';

  for (const [key, val] of Object.entries(assetMap)) {
    if (val === image) {
      return `asset:${key}`;
    }
  }

  return imageStr;
};

// Convert database string to require asset or uri object
export const deserializeImage = (imageVal: string | null): any => {
  if (!imageVal) return null;
  
  if (imageVal.startsWith('asset:')) {
    const key = imageVal.replace('asset:', '');
    return assetMap[key] || assetMap['project_web'];
  }
  
  return { uri: imageVal };
};

// Convert base64 data to blob
const base64ToBlob = async (base64DataUrl: string): Promise<{ blob: Blob; mimeType: string }> => {
  const response = await fetch(base64DataUrl);
  const blob = await response.blob();
  const mimeType = base64DataUrl.match(/data:(.*?);base64/)?.[1] || 'application/octet-stream';
  return { blob, mimeType };
};

// Uploads a file (either base64 or remote URL) to Supabase Storage
export const uploadFileToSupabase = async (
  fileData: string,
  bucket: string,
  filePath: string
): Promise<string> => {
  if (!fileData.startsWith('data:')) {
    return fileData; // It's already a URL
  }

  try {
    const { blob, mimeType } = await base64ToBlob(fileData);
    
    // Upload blob to Supabase storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error(`Error uploading file to Supabase bucket ${bucket}:`, error);
    throw error;
  }
};

// CRUD Operations for Projects
export const fetchProjectsFromSupabase = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    techStack: item.tech_stack || [],
    image: deserializeImage(item.image_url),
    githubUrl: item.github_url,
    liveUrl: item.live_url || undefined,
  }));
};

export const saveProjectToSupabase = async (project: any): Promise<void> => {
  let imageUrl = serializeImage(project.image);
  
  if (imageUrl && imageUrl.startsWith('data:')) {
    // If it's base64, upload it to storage first
    imageUrl = await uploadFileToSupabase(
      imageUrl,
      'portfolio-assets',
      `projects/${project.id}.jpg`
    );
  }

  const payload = {
    id: project.id,
    title: project.title,
    description: project.description,
    tech_stack: project.techStack,
    image_url: imageUrl,
    github_url: project.githubUrl,
    live_url: project.liveUrl || null,
  };

  const { error } = await supabase
    .from('portfolio_projects')
    .upsert(payload, { onConflict: 'id' });

  if (error) throw error;
};

export const deleteProjectFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('portfolio_projects')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Try deleting from storage too (silent ignore if it doesn't exist)
  try {
    await supabase.storage
      .from('portfolio-assets')
      .remove([`projects/${id}.jpg`]);
  } catch (e) {
    // ignore
  }
};

// CRUD Operations for Certificates
export const fetchCertificatesFromSupabase = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('portfolio_certificates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(item => ({
    id: item.id,
    title: item.title,
    issuer: item.issuer,
    issueDate: item.issue_date,
    image: deserializeImage(item.image_url),
    pdfUrl: item.pdf_url,
  }));
};

export const saveCertificateToSupabase = async (certificate: any): Promise<void> => {
  let imageUrl = serializeImage(certificate.image);
  let pdfUrl = certificate.pdfUrl;

  if (imageUrl && imageUrl.startsWith('data:')) {
    imageUrl = await uploadFileToSupabase(
      imageUrl,
      'portfolio-assets',
      `certificates/${certificate.id}.jpg`
    );
  }

  if (pdfUrl && pdfUrl.startsWith('data:')) {
    pdfUrl = await uploadFileToSupabase(
      pdfUrl,
      'portfolio-assets',
      `certificates/${certificate.id}.pdf`
    );
  }

  const payload = {
    id: certificate.id,
    title: certificate.title,
    issuer: certificate.issuer,
    issue_date: certificate.issueDate,
    image_url: imageUrl,
    pdf_url: pdfUrl,
  };

  const { error } = await supabase
    .from('portfolio_certificates')
    .upsert(payload, { onConflict: 'id' });

  if (error) throw error;
};

export const deleteCertificateFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('portfolio_certificates')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Try deleting from storage too
  try {
    await supabase.storage
      .from('portfolio-assets')
      .remove([`certificates/${id}.jpg`, `certificates/${id}.pdf`]);
  } catch (e) {
    // ignore
  }
};

// Resume Operations
export const fetchResumeFromSupabase = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from('portfolio_resumes')
    .select('url')
    .eq('id', 'latest')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Record not found
    }
    throw error;
  }

  return data?.url || null;
};

export const saveResumeToSupabase = async (pdfUrl: string): Promise<string> => {
  let finalUrl = pdfUrl;

  if (pdfUrl.startsWith('data:')) {
    // Upload to storage with unique timestamp to break CDN caching
    finalUrl = await uploadFileToSupabase(
      pdfUrl,
      'portfolio-assets',
      `resumes/resume_${Date.now()}.pdf`
    );
  }

  const { error } = await supabase
    .from('portfolio_resumes')
    .upsert({ id: 'latest', url: finalUrl }, { onConflict: 'id' });

  if (error) throw error;

  return finalUrl;
};

export const clearSupabaseData = async (): Promise<void> => {
  // Delete all rows from projects and certificates to trigger a re-seed next time
  const { error: errorProj } = await supabase.from('portfolio_projects').delete().neq('id', '');
  if (errorProj) throw errorProj;

  const { error: errorCert } = await supabase.from('portfolio_certificates').delete().neq('id', '');
  if (errorCert) throw errorCert;

  const { error: errorResume } = await supabase.from('portfolio_resumes').delete().eq('id', 'latest');
  if (errorResume) throw errorResume;
};

export const archiveProjectInSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('portfolio_projects')
    .update({ id: `archived_${id}` })
    .eq('id', id);

  if (error) throw error;
};

export const unarchiveProjectInSupabase = async (id: string): Promise<void> => {
  const newId = id.replace(/^archived_/, '');
  const { error } = await supabase
    .from('portfolio_projects')
    .update({ id: newId })
    .eq('id', id);

  if (error) throw error;
};

export const archiveCertificateInSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('portfolio_certificates')
    .update({ id: `archived_${id}` })
    .eq('id', id);

  if (error) throw error;
};

export const unarchiveCertificateInSupabase = async (id: string): Promise<void> => {
  const newId = id.replace(/^archived_/, '');
  const { error } = await supabase
    .from('portfolio_certificates')
    .update({ id: newId })
    .eq('id', id);

  if (error) throw error;
};

