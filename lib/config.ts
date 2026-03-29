// الرابط الأساسي للسيرفر - يُستخدم لعرض الصور والملفات المرفوعة
// غيّر هذا الرابط عند النشر على السيرفر الحقيقي
export const API_BASE = 'http://localhost:5139';

/**
 * تحويل رابط الملف للعرض الصحيح
 * - إذا كان الرابط كامل (http/https) يرجعه كما هو (صورة أونلاين)
 * - إذا كان مسار نسبي (مثل /img/users/xxx.jpg) يضيف رابط السيرفر
 */
export function getFileUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}
