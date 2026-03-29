'use client';

import { useState } from 'react';
import { InstructorAdminService, InstructorSkillAdminService, CoursesAdminService, CourseCategoryAdminService } from '@/services/courses/page';
import { MediaCenterAdminService } from '@/services/media-center/page';

// صور ذكور
const maleAvatars = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
];

// صور إناث
const femaleAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
];

const dummySkills = [
  'تطوير الأعمال', 'التخطيط الاستراتيجي', 'التسويق الرقمي', 'تصميم المنتجات',
  'تجربة المستخدم', 'إدارة المشاريع', 'التحليل المالي', 'القيادة',
  'ريادة الأعمال', 'الذكاء الاصطناعي', 'البيانات الضخمة', 'التجارة الإلكترونية',
  'المبيعات', 'التفاوض', 'إدارة الفرق',
];

const dummyInstructors = [
  { name: 'أحمد الغامدي', title: 'خبير تطوير الأعمال', bio: 'خبرة تزيد عن 10 سنوات في تطوير الأعمال والتخطيط الاستراتيجي، عمل مع أكثر من 50 شركة ناشئة في منطقة الخليج.', gender: 1, rating: 4.8, totalStudents: 320, totalCources: 12 },
  { name: 'سارة العتيبي', title: 'مستشارة منتجات رقمية', bio: 'متخصصة في تصميم تجربة المستخدم وإدارة المنتجات الرقمية، قادت فرق منتجات في عدة شركات تقنية رائدة.', gender: 2, rating: 4.9, totalStudents: 450, totalCources: 8 },
  { name: 'محمد الشريف', title: 'خبير تسويق ونمو', bio: 'متخصص في استراتيجيات النمو والتسويق الرقمي، ساعد أكثر من 30 شركة في مضاعفة إيراداتها خلال عام واحد.', gender: 1, rating: 4.7, totalStudents: 280, totalCources: 15 },
  { name: 'نورة المالكي', title: 'خبيرة ريادة أعمال', bio: 'رائدة أعمال ومؤسسة لعدة مشاريع ناجحة، تمتلك خبرة واسعة في بناء الشركات الناشئة وجذب الاستثمارات.', gender: 2, rating: 4.6, totalStudents: 190, totalCources: 6 },
  { name: 'خالد الزهراني', title: 'مستشار مالي واستثماري', bio: 'خبير في التحليل المالي وإعداد خطط الأعمال للمستثمرين، عمل في عدة صناديق استثمارية وحاضنات أعمال.', gender: 1, rating: 4.5, totalStudents: 210, totalCources: 9 },
  { name: 'ليان القحطاني', title: 'مدربة تطوير ذاتي', bio: 'مدربة معتمدة في التطوير الذاتي والقيادة، قدمت ورش عمل لأكثر من 2000 متدرب في القطاعين العام والخاص.', gender: 2, rating: 4.8, totalStudents: 520, totalCources: 18 },
  { name: 'عبدالله الحربي', title: 'خبير تقنية المعلومات', bio: 'مهندس برمجيات بخبرة 12 سنة في تطوير الأنظمة والتحول الرقمي، متخصص في الحوسبة السحابية والذكاء الاصطناعي.', gender: 1, rating: 4.9, totalStudents: 380, totalCources: 14 },
  { name: 'هند الدوسري', title: 'خبيرة موارد بشرية', bio: 'متخصصة في إدارة المواهب وبناء فرق العمل عالية الأداء، عملت مع شركات محلية ودولية في تطوير بيئات العمل.', gender: 2, rating: 4.4, totalStudents: 160, totalCources: 7 },
  { name: 'فهد العمري', title: 'مستشار قانوني للشركات', bio: 'محامي ومستشار قانوني متخصص في قوانين الشركات والملكية الفكرية، يقدم استشارات قانونية لرواد الأعمال.', gender: 1, rating: 4.3, totalStudents: 95, totalCources: 5 },
  { name: 'رنا السبيعي', title: 'خبيرة تجارة إلكترونية', bio: 'متخصصة في بناء وإدارة المتاجر الإلكترونية واستراتيجيات البيع عبر الإنترنت، ساعدت عشرات المشاريع في الإطلاق الرقمي.', gender: 2, rating: 4.7, totalStudents: 340, totalCources: 11 },
];

// صور دورات
const courseThumbnails = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80',
];

// بيانات 8 دورات تجريبية
// courseDays: قيم [Flags] enum - Sunday=1, Monday=2, Tuesday=4, Wednesday=8, Thursday=16, Friday=32, Saturday=64
const dummyCourses = [
  {
    title: 'أساسيات التسويق الرقمي',
    subtitle: 'من الصفر إلى الاحتراف',
    description: 'تعلم أساسيات التسويق الرقمي بما في ذلك SEO والتسويق عبر وسائل التواصل الاجتماعي والإعلانات المدفوعة وتحليل البيانات.',
    level: 1,
    language: 'العربية',
    hasCertificate: true,
    price: 299,
    courseDays: 64 + 1 + 2 + 4 + 8, // السبت-الأربعاء = 79
    durationInDays: 30,
    totalDurationInHours: 24,
    status: 2,
    isActive: true,
  },
  {
    title: 'إدارة المشاريع الاحترافية PMP',
    subtitle: 'استعد لاجتياز اختبار PMP',
    description: 'دورة شاملة في إدارة المشاريع تغطي جميع مجالات المعرفة والعمليات وفقاً لمعايير PMI العالمية.',
    level: 2,
    language: 'العربية',
    hasCertificate: true,
    price: 599,
    courseDays: 64 + 1 + 2 + 4 + 8, // السبت-الأربعاء
    durationInDays: 45,
    totalDurationInHours: 40,
    status: 2,
    isActive: true,
  },
  {
    title: 'تطوير تطبيقات الويب الحديثة',
    subtitle: 'React.js و Next.js',
    description: 'تعلم بناء تطبيقات ويب حديثة باستخدام React.js و Next.js مع أفضل الممارسات وأنماط التصميم.',
    level: 3,
    language: 'العربية',
    hasCertificate: true,
    price: 449,
    courseDays: 64 + 1 + 4 + 8, // السبت، الأحد، الثلاثاء، الأربعاء = 77
    durationInDays: 60,
    totalDurationInHours: 50,
    status: 2,
    isActive: true,
  },
  {
    title: 'القيادة وبناء فرق العمل',
    subtitle: 'مهارات القيادة الفعالة',
    description: 'اكتساب مهارات القيادة الفعالة وتعلم كيفية بناء وإدارة فرق عمل عالية الأداء وتحفيز الموظفين.',
    level: 1,
    language: 'العربية',
    hasCertificate: false,
    price: 199,
    courseDays: 16 + 32, // الخميس والجمعة = 48
    durationInDays: 14,
    totalDurationInHours: 12,
    status: 2,
    isActive: true,
  },
  {
    title: 'تحليل البيانات باستخدام Python',
    subtitle: 'Pandas و NumPy و Matplotlib',
    description: 'تعلم تحليل البيانات والتصور البياني باستخدام مكتبات Python الأشهر مثل Pandas و NumPy و Matplotlib.',
    level: 2,
    language: 'العربية',
    hasCertificate: true,
    price: 399,
    courseDays: 64 + 1 + 2 + 4 + 8, // السبت-الأربعاء
    durationInDays: 35,
    totalDurationInHours: 30,
    status: 2,
    isActive: true,
  },
  {
    title: 'ريادة الأعمال وبناء الشركات الناشئة',
    subtitle: 'من الفكرة إلى التمويل',
    description: 'دورة شاملة في ريادة الأعمال تغطي كيفية تحويل الأفكار إلى مشاريع ناجحة وجذب المستثمرين وبناء نموذج العمل.',
    level: 1,
    language: 'العربية',
    hasCertificate: true,
    price: 349,
    courseDays: 64 + 1 + 2 + 4 + 8 + 16 + 32, // يومياً = 127
    durationInDays: 21,
    totalDurationInHours: 18,
    status: 2,
    isActive: true,
  },
  {
    title: 'التصميم الجرافيكي للمبتدئين',
    subtitle: 'Adobe Photoshop و Illustrator',
    description: 'تعلم أساسيات التصميم الجرافيكي باستخدام أدوات Adobe الاحترافية وتطبيقها على مشاريع عملية.',
    level: 1,
    language: 'العربية',
    hasCertificate: false,
    price: 249,
    courseDays: 64 + 2 + 8, // السبت، الاثنين، الأربعاء = 74
    durationInDays: 28,
    totalDurationInHours: 20,
    status: 2,
    isActive: true,
  },
  {
    title: 'الذكاء الاصطناعي وتعلم الآلة',
    subtitle: 'المفاهيم والتطبيقات العملية',
    description: 'مقدمة شاملة في الذكاء الاصطناعي وتعلم الآلة مع تطبيقات عملية باستخدام TensorFlow و Scikit-learn.',
    level: 3,
    language: 'العربية',
    hasCertificate: true,
    price: 699,
    courseDays: 64 + 1 + 2 + 4 + 8, // السبت-الأربعاء
    durationInDays: 90,
    totalDurationInHours: 80,
    status: 2,
    isActive: true,
  },
];

// بيانات المركز الإعلامي الوهمية
const mediaGalleryImages = [
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1557804506-669714d2e9d8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
];

const dummyMediaItems = [
  // Gallery items (mediaType: 0)
  { title: 'ورشة عمل التخطيط الاستراتيجي', description: 'صور من ورشة العمل التفاعلية للتخطيط الاستراتيجي', mediaType: 0, category: 'ورش عمل', isActive: true },
  { title: 'جلسة العصف الذهني', description: 'لقطات من جلسة العصف الذهني لفريق التطوير', mediaType: 0, category: 'فريق العمل', isActive: true },
  { title: 'حفل التخرج السنوي', description: 'صور من حفل تخريج الدفعة الخامسة من المتدربين', mediaType: 0, category: 'احتفالات', isActive: true },
  { title: 'زيارة الشركاء الاستراتيجيين', description: 'استقبال الوفد الزائر من الشركاء الدوليين', mediaType: 0, category: 'شراكات', isActive: true },
  { title: 'معرض المشاريع الناشئة', description: 'عرض مشاريع المتدربين في معرض الابتكار', mediaType: 0, category: 'معارض', isActive: true },
  { title: 'فعالية اليوم المفتوح', description: 'أجواء فعالية اليوم المفتوح للتعريف بالبرامج', mediaType: 0, category: 'فعاليات', isActive: true },

  // Article items (mediaType: 1)
  { title: 'كيف تطلق منتجك الرقمي بثقة في 8 أسابيع', description: 'نشارك منهجية عملية لتسريع إطلاق المنتجات الرقمية من اختبار السوق إلى أول عميل يدفع.', mediaType: 1, category: 'نمو', author: 'فريق بسقات', content: 'في عالم ريادة الأعمال الرقمية، السرعة في الإطلاق هي مفتاح النجاح. من خلال خبرتنا في دعم أكثر من 50 شركة ناشئة، نقدم لكم منهجية مجربة تساعدكم على إطلاق منتجكم الرقمي خلال 8 أسابيع فقط.\n\nالأسبوع الأول: تحديد المشكلة والجمهور المستهدف\nالأسبوع الثاني: بناء النموذج الأولي\nالأسبوع الثالث والرابع: اختبار مع المستخدمين\nالأسبوع الخامس والسادس: التطوير والتحسين\nالأسبوع السابع: الإطلاق التجريبي\nالأسبوع الثامن: الإطلاق الرسمي والتسويق', readingTimeMinutes: 6, isActive: true },
  { title: 'اختبار شرائح العملاء في أسبوع واحد', description: 'تعلم كيف تتحقق من شرائح عملائك المستهدفة بسرعة وكفاءة.', mediaType: 1, category: 'استراتيجية', author: 'فريق النمو', content: 'التحقق من شرائح العملاء هو أحد أهم الخطوات في رحلة أي مشروع. بدلاً من قضاء أشهر في البحث، يمكنك استخدام منهجية Sprint للتحقق من فرضياتك خلال أسبوع واحد فقط.', readingTimeMinutes: 5, isActive: true },
  { title: 'أفضل ممارسات التحول الرقمي', description: 'استراتيجيات ومنهجيات أساسية للتحول الرقمي الناجح في عصرنا الحالي.', mediaType: 1, category: 'تقنية', author: 'الفريق التقني', content: 'التحول الرقمي ليس مجرد استخدام التكنولوجيا، بل هو تغيير شامل في طريقة العمل والتفكير. في هذا المقال نستعرض أفضل الممارسات التي ساعدت الشركات في تحقيق تحول رقمي ناجح.', readingTimeMinutes: 8, isActive: true },
  { title: 'بناء فرق عمل عالية الأداء', description: 'اكتشف المبادئ والممارسات الأساسية لبناء فرق عمل استثنائية.', mediaType: 1, category: 'إدارة', author: 'فريق الموارد البشرية', content: 'الفرق عالية الأداء هي العمود الفقري لأي منظمة ناجحة. في هذا المقال نكشف أسرار بناء فرق متماسكة ومنتجة قادرة على تحقيق أهداف استثنائية.', readingTimeMinutes: 7, isActive: true },
  { title: 'تسريع دخول السوق للشركات الناشئة', description: 'استراتيجيات مثبتة لتسريع دخول السوق وتحقيق ملاءمة المنتج.', mediaType: 1, category: 'ريادة أعمال', author: 'فريق تطوير الأعمال', content: 'في عالم الشركات الناشئة، الوقت هو العملة الأهم. نقدم لكم استراتيجيات عملية لاختصار الطريق والوصول إلى السوق بأسرع وقت ممكن مع الحفاظ على جودة المنتج.', readingTimeMinutes: 6, isActive: true },
  { title: 'اتخاذ القرارات المبنية على البيانات', description: 'كيف تستفيد من تحليل البيانات لاتخاذ قرارات أعمال مدروسة.', mediaType: 1, category: 'تحليلات', author: 'فريق التحليلات', content: 'البيانات هي النفط الجديد في عالم الأعمال. تعلم كيف تحول البيانات الخام إلى رؤى قيمة تساعدك في اتخاذ قرارات استراتيجية مبنية على حقائق وليس على حدس.', readingTimeMinutes: 7, isActive: true },

  // Event items (mediaType: 2)
  { title: 'ورشة التحول الرقمي 2026', description: 'ورشة عمل مكثفة حول استراتيجيات التحول الرقمي وأفضل الممارسات.', mediaType: 2, category: 'ورشة عمل', eventDate: '2026-04-15', eventEndDate: '2026-04-15', eventTime: '10:00 ص - 2:00 م', eventLocation: 'مركز المؤتمرات - الرياض', isActive: true },
  { title: 'إطلاق برنامج تسريع الشركات الناشئة', description: 'اكتشف فرص تسريع مشروعك الناشئ مع برنامجنا الجديد.', mediaType: 2, category: 'إطلاق', eventDate: '2026-04-22', eventEndDate: '2026-04-22', eventTime: '3:00 م - 5:00 م', eventLocation: 'مركز الابتكار', isActive: true },
  { title: 'ملتقى رواد الأعمال', description: 'تواصل مع رواد الأعمال وقادة الصناعة في لقاء صباحي ملهم.', mediaType: 2, category: 'ملتقى', eventDate: '2026-05-05', eventEndDate: '2026-05-05', eventTime: '8:00 ص - 10:00 ص', eventLocation: 'قاعة الفندق الرئيسية', isActive: true },
  { title: 'الذكاء الاصطناعي لنمو الأعمال', description: 'تعلم كيف تستخدم الذكاء الاصطناعي لدفع نمو أعمالك.', mediaType: 2, category: 'ندوة', eventDate: '2025-12-10', eventEndDate: '2025-12-10', eventTime: '9:00 ص - 12:00 م', eventLocation: 'المركز التقني', isActive: true },
  { title: 'قمة بسقات السنوية 2025', description: 'حدثنا السنوي الأبرز يجمع قادة الصناعة والمبتكرين ورواد الأعمال.', mediaType: 2, category: 'قمة', eventDate: '2025-11-28', eventEndDate: '2025-11-28', eventTime: '9:00 ص - 5:00 م', eventLocation: 'القاعة الكبرى', isActive: true },
  { title: 'ماستر كلاس تطوير المنتجات', description: 'أتقن أساسيات تطوير المنتجات من الفكرة إلى الإطلاق مع خبراء الصناعة.', mediaType: 2, category: 'ماستر كلاس', eventDate: '2025-11-15', eventEndDate: '2025-11-15', eventTime: '2:00 م - 5:00 م', eventLocation: 'مركز التدريب', isActive: true },
];

// تحويل رابط صورة إلى File object
async function urlToFile(url: string, filename: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'image/jpeg' });
}

// إنشاء ملف PDF وهمي للسيرة الذاتية
function createDummyCvFile(name: string): File {
  const content = `السيرة الذاتية - ${name}\n\nهذا ملف سيرة ذاتية وهمي للاختبار.`;
  const blob = new Blob([content], { type: 'application/pdf' });
  return new File([blob], `cv-${name.replace(/\s/g, '-')}.pdf`, { type: 'application/pdf' });
}

export default function SeedPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  let maleIdx = 0;
  let femaleIdx = 0;

  const handleSeed = async () => {
    setRunning(true);
    setLog([]);
    setDone(false);
    maleIdx = 0;
    femaleIdx = 0;

    // 1. إضافة المهارات
    addLog('📌 جاري إضافة المهارات...');
    for (const skillName of dummySkills) {
      try {
        const res = await InstructorSkillAdminService.add({ name: skillName });
        if (res.succeeded) {
          addLog(`  ✅ مهارة: ${skillName}`);
        } else {
          addLog(`  ⚠️ مهارة: ${skillName} - ${res.message}`);
        }
      } catch (err: any) {
        addLog(`  ❌ مهارة: ${skillName} - ${err.response?.data?.message || err.message}`);
      }
    }

    // 2. إضافة المدربين مع الصور والسير الذاتية
    addLog('');
    addLog('👥 جاري إضافة المدربين...');

    for (let i = 0; i < dummyInstructors.length; i++) {
      const inst = dummyInstructors[i];
      addLog(`⏳ (${i + 1}/10) إضافة: ${inst.name}...`);

      try {
        // إضافة المدرب
        const res = await InstructorAdminService.add(inst);
        if (!res.succeeded) {
          addLog(`  ❌ فشل إضافة: ${inst.name} - ${res.message}`);
          continue;
        }

        const instructorId = res.data?.id;
        addLog(`  ✅ تم إضافة (ID: ${instructorId})`);

        // رفع الصورة
        try {
          const avatarUrl = inst.gender === 1
            ? maleAvatars[maleIdx++ % maleAvatars.length]
            : femaleAvatars[femaleIdx++ % femaleAvatars.length];

          addLog(`  📷 جاري تحميل الصورة...`);
          const avatarFile = await urlToFile(avatarUrl, `avatar-${instructorId}.jpg`);
          const avatarRes = await InstructorAdminService.uploadAvatar(instructorId, avatarFile);
          if (avatarRes.succeeded) {
            addLog(`  ✅ تم رفع الصورة`);
          } else {
            addLog(`  ⚠️ فشل رفع الصورة: ${avatarRes.message}`);
          }
        } catch (err: any) {
          addLog(`  ⚠️ خطأ رفع الصورة: ${err.message}`);
        }

        // رفع السيرة الذاتية
        try {
          addLog(`  📄 جاري رفع السيرة الذاتية...`);
          const cvFile = createDummyCvFile(inst.name);
          const cvRes = await InstructorAdminService.uploadCv(instructorId, cvFile);
          if (cvRes.succeeded) {
            addLog(`  ✅ تم رفع السيرة الذاتية`);
          } else {
            addLog(`  ⚠️ فشل رفع السيرة الذاتية: ${cvRes.message}`);
          }
        } catch (err: any) {
          addLog(`  ⚠️ خطأ رفع السيرة الذاتية: ${err.message}`);
        }

      } catch (err: any) {
        addLog(`  ❌ خطأ عام: ${err.response?.data?.message || err.message}`);
      }

      addLog('');
    }

    // 3. إضافة الدورات التجريبية
    addLog('');
    addLog('📚 جاري إضافة الدورات التجريبية...');

    // جلب الأقسام والمدربين الموجودين
    let catIds: number[] = [];
    let instIds: number[] = [];
    try {
      const catRes = await CourseCategoryAdminService.getAll();
      if (catRes.succeeded && catRes.data?.length) {
        catIds = catRes.data.map(c => c.id);
        addLog(`  ✅ تم جلب ${catIds.length} أقسام`);
      } else {
        addLog('  ⚠️ لا توجد أقسام - سيتم تخطي ربط الأقسام');
      }
    } catch {
      addLog('  ⚠️ فشل جلب الأقسام');
    }

    try {
      const instRes = await InstructorAdminService.getAll();
      if (instRes.succeeded && instRes.data?.length) {
        instIds = instRes.data.map(i => i.id);
        addLog(`  ✅ تم جلب ${instIds.length} مدربين`);
      } else {
        addLog('  ⚠️ لا يوجد مدربين - سيتم تخطي ربط المدربين');
      }
    } catch {
      addLog('  ⚠️ فشل جلب المدربين');
    }

    for (let i = 0; i < dummyCourses.length; i++) {
      const courseData = dummyCourses[i];
      addLog(`⏳ (${i + 1}/8) إضافة دورة: ${courseData.title}...`);

      try {
        const payload: Record<string, any> = {
          ...courseData,
          startDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000 + courseData.durationInDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };

        // ربط قسم عشوائي
        if (catIds.length > 0) {
          payload.courseCategoryId = catIds[i % catIds.length];
        }

        // ربط مدرب عشوائي
        if (instIds.length > 0) {
          payload.instructorId = instIds[i % instIds.length];
        }

        const res = await CoursesAdminService.add(payload);
        if (!res.succeeded) {
          addLog(`  ❌ فشل إضافة: ${courseData.title} - ${res.message}`);
          continue;
        }

        const courseId = res.data?.id;
        addLog(`  ✅ تم إضافة (ID: ${courseId})`);

        // رفع صورة مصغرة
        try {
          addLog(`  🖼️ جاري رفع الصورة المصغرة...`);
          const thumbFile = await urlToFile(courseThumbnails[i], `thumb-${courseId}.jpg`);
          const thumbRes = await CoursesAdminService.uploadThumbnail(courseId, thumbFile);
          if (thumbRes.succeeded) {
            addLog(`  ✅ تم رفع الصورة المصغرة`);
          } else {
            addLog(`  ⚠️ فشل رفع الصورة: ${thumbRes.message}`);
          }
        } catch (err: any) {
          addLog(`  ⚠️ خطأ رفع الصورة: ${err.message}`);
        }
      } catch (err: any) {
        addLog(`  ❌ خطأ عام: ${err.response?.data?.message || err.message}`);
      }

      addLog('');
    }

    // 4. إضافة المركز الإعلامي
    addLog('');
    addLog('📰 جاري إضافة بيانات المركز الإعلامي...');

    let galleryImgIdx = 0;
    for (let i = 0; i < dummyMediaItems.length; i++) {
      const item = dummyMediaItems[i];
      const typeLabel = item.mediaType === 0 ? 'صورة' : item.mediaType === 1 ? 'مقال' : 'فعالية';
      addLog(`⏳ (${i + 1}/${dummyMediaItems.length}) إضافة ${typeLabel}: ${item.title}...`);

      try {
        const res = await MediaCenterAdminService.add(item);
        if (!res.succeeded) {
          addLog(`  ❌ فشل: ${item.title} - ${res.message}`);
          continue;
        }

        const mediaId = res.data?.id;
        addLog(`  ✅ تم إضافة (ID: ${mediaId})`);

        // رفع صورة
        try {
          const imgUrl = mediaGalleryImages[galleryImgIdx % mediaGalleryImages.length];
          galleryImgIdx++;
          addLog(`  🖼️ جاري رفع الصورة...`);
          const imgFile = await urlToFile(imgUrl, `media-${mediaId}.jpg`);
          const imgRes = await MediaCenterAdminService.uploadImage(mediaId, imgFile);
          if (imgRes.succeeded) {
            addLog(`  ✅ تم رفع الصورة`);
          } else {
            addLog(`  ⚠️ فشل رفع الصورة: ${imgRes.message}`);
          }
        } catch (err: any) {
          addLog(`  ⚠️ خطأ رفع الصورة: ${err.message}`);
        }
      } catch (err: any) {
        addLog(`  ❌ خطأ عام: ${err.response?.data?.message || err.message}`);
      }

      addLog('');
    }

    addLog('🎉 انتهت عملية الإضافة!');
    setRunning(false);
    setDone(true);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-800">إضافة بيانات وهمية</h1>
      <p className="text-gray-500 text-sm">يضيف 15 مهارة + 10 مدربين مع صور وسير ذاتية + 8 دورات مع صور + 18 عنصر مركز إعلامي (6 صور + 6 مقالات + 6 فعاليات).</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>ملاحظة:</strong> تأكد من تسجيل الدخول أولاً وأن السيرفر المحلي يعمل على المنفذ 5139.
      </div>

      <button onClick={handleSeed} disabled={running}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50 transition-colors">
        {running ? 'جاري الإضافة...' : done ? 'إضافة مرة أخرى' : 'ابدأ الإضافة'}
      </button>

      {log.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-4 space-y-1 max-h-[500px] overflow-y-auto">
          {log.map((msg, i) => (
            <div key={i} className={`text-sm font-mono ${msg.includes('✅') ? 'text-green-400' : msg.includes('❌') ? 'text-red-400' : msg.includes('⚠️') ? 'text-yellow-400' : msg.includes('🎉') ? 'text-blue-300 font-bold' : 'text-gray-300'}`}>
              {msg || '\u00A0'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
