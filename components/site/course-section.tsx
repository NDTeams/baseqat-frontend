'use client';

import { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  faCheckCircle, 
  faPlayCircle, 
  faChevronLeft,
  faPlay,
  faFileAlt,
  faStar,
  faUsers,
  faBook,
  faCalendarAlt,
  faSignal,
  faGlobe,
  faClipboardCheck,
  faCertificate,
  faPercentage,
  faShieldAlt,
  faPhone,
  faShoppingCart 
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CourseDetails() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });

    // Header scroll effect
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(prev => prev === index ? null : index);
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'content', label: 'محتوى الدورة' },
    { id: 'details', label: 'التفاصيل' },
    { id: 'instructor', label: 'المدرب' },
    { id: 'reviews', label: 'التقييمات' }
  ];

  const courseSections = [
    {
      id: 1,
      title: 'مقدمة الدورة وباسقات',
      duration: '1 ساعة 30 دقيقة',
      items: [
        { type: 'video', title: 'مقدمة الدورة', duration: '30 دقيقة' },
        { type: 'video', title: 'شاهد قبل البدء', duration: '0.5 دقيقة' },
        { type: 'document', title: 'اقرأ قبل البدء' }
      ]
    },
    {
      id: 2,
      title: 'أساسيات الدورة',
      duration: '2 ساعة 30 دقيقة',
      items: [
        { type: 'video', title: 'مقدمة الدورة', duration: '30 دقيقة' },
        { type: 'document', title: 'اقرأ قبل البدء' }
      ]
    },
    {
      id: 3,
      title: 'يمكنك تطوير المهارات والإعداد',
      duration: '1 ساعة 50 دقيقة',
      items: [
        { type: 'video', title: 'مقدمة الدورة', duration: '30 دقيقة' }
      ]
    },
    {
      id: 4,
      title: '15 شيء يجب معرفته عن التعليم؟',
      duration: '2 ساعة 60 دقيقة',
      items: [
        { type: 'video', title: 'مقدمة الدورة', duration: '30 دقيقة' }
      ]
    },
    {
      id: 5,
      title: 'وصف الدورة',
      duration: '2 ساعة 20 دقيقة',
      items: [
        { type: 'video', title: 'مقدمة الدورة', duration: '30 دقيقة' }
      ]
    }
  ];

  return (
    <section className="py-12 bg-white font-cairo w-full" dir="rtl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div 
              className="border-b border-neutral-200 mb-8"
              data-aos="fade-up"
            >
              <div className="flex flex-wrap gap-4 overflow-x-auto pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab-button relative px-4 py-3 font-semibold text-sm md:text-base transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'text-primary z-10'
                        : 'text-neutral-600 hover:text-primary'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content: Overview */}
            {activeTab === 'overview' && (
              <div 
                id="overview" 
                className="tab-content active"
                data-aos="fade-up"
              >
                <h2 className="text-3xl font-black text-neutral-900 mb-6">ماذا ستتعلم</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {[
                    'تصبح مطور JavaScript متقدم وواثق وحديث من الصفر',
                    'تمتلك مستوى متوسط من برمجة Python',
                    'تمتلك محفظة من مشاريع تحليل البيانات المختلفة',
                    'استخدام مكتبة numpy لإنشاء ومعالجة المصفوفات',
                    'استخدام بيئة Jupyter Notebook',
                    'استخدام وحدة pandas مع Python لإنشاء وهيكلة البيانات',
                    'إنشاء تصورات البيانات باستخدام matplotlib و seaborn'
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-start space-x-reverse space-x-3"
                    >
                      <FontAwesomeIcon 
                        icon={faCheckCircle} 
                        className="text-primary text-xl mt-1 flex-shrink-0"
                      />
                      <span className="text-neutral-700">{item}</span>
                    </div>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">وصف الدورة</h3>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  هل أنت جديد في PHP أو تحتاج إلى تحديث معلوماتك؟ إذن هذه الدورة ستساعدك في الحصول على جميع أساسيات PHP الإجرائية، PHP الموجه للكائنات، MYSQLi وإنهاء الدورة ببناء نظام إدارة محتوى مشابه لـ WordPress أو Joomla أو Drupal. معرفة PHP سمحت لي بجني ما يكفي من المال للبقاء في المنزل وإنشاء دورات مثل هذه للطلاب في جميع أنحاء العالم.
                </p>
                <p className="text-neutral-700 leading-relaxed mb-6">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis, aliquam voluptas laudantium incidunt architecto nam excepturi provident rem laborum repellendus placeat neque aut doloremque ut ullam, veritatis nesciunt iusto officia alias, non est vitae. Eius repudiandae optio quam alias aperiam nemo nam tempora, dignissimos dicta excepturi ea quo ipsum omnis maiores perferendis commodi voluptatum facere vel vero.
                </p>
                <button className="mt-4 text-primary font-semibold hover:underline transition-colors">
                  عرض المزيد
                </button>
              </div>
            )}

            {/* Tab Content: Course Content */}
            {activeTab === 'content' && (
              <div id="content" className="tab-content" data-aos="fade-up">
                <h2 className="text-3xl font-black text-neutral-900 mb-6">محتوى الدورة</h2>
                <div className="space-y-2">
                  {courseSections.map((section, index) => (
                    <div 
                      key={section.id}
                      className={`accordion-item bg-white border border-neutral-200 rounded-lg overflow-hidden ${
                        activeAccordion === index ? 'active' : ''
                      }`}
                    >
                      <div
                        className="accordion-header flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
                        onClick={() => toggleAccordion(index)}
                      >
                        <div className="flex items-center space-x-reverse space-x-3">
                          <FontAwesomeIcon 
                            icon={faPlayCircle} 
                            className="text-primary text-xl flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-neutral-900">{section.title}</h4>
                            <p className="text-sm text-neutral-600">{section.duration}</p>
                          </div>
                        </div>
                        <FontAwesomeIcon 
                          icon={faChevronLeft} 
                          className={`accordion-icon text-neutral-600 transition-transform duration-300 ${
                            activeAccordion === index ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                      <div 
                        className={`accordion-content overflow-hidden transition-all duration-500 ${
                          activeAccordion === index ? 'max-h-[500px] py-4' : 'max-h-0'
                        }`}
                      >
                        <div className="px-4 space-y-2">
                          {section.items.map((item, itemIndex) => (
                            <div 
                              key={itemIndex}
                              className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-reverse space-x-3">
                                <FontAwesomeIcon 
                                  icon={item.type === 'video' ? faPlay : faFileAlt} 
                                  className="text-primary flex-shrink-0"
                                />
                                <span className="text-neutral-700">{item.title}</span>
                              </div>
                              {item.duration && (
                                <span className="text-sm text-neutral-600">{item.duration}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content: Details */}
            {activeTab === 'details' && (
              <div id="details" className="tab-content" data-aos="fade-up">
                <h2 className="text-3xl  font-black text-neutral-900 mb-6">متطلبات الدورة</h2>
                <ul className="space-y-3 mb-8">
                  {[
                    'تصبح مطور JavaScript متقدم وواثق وحديث من الصفر',
                    'تمتلك مستوى متوسط من برمجة Python',
                    'تمتلك محفظة من مشاريع تحليل البيانات المختلفة',
                    'استخدام مكتبة numpy لإنشاء ومعالجة المصفوفات'
                  ].map((item, index) => (
                    <li 
                      key={index} 
                      className="flex items-start space-x-reverse space-x-3"
                    >
                      <FontAwesomeIcon 
                        icon={faCheckCircle} 
                        className="text-primary text-xl mt-1 flex-shrink-0"
                      />
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">وصف الدورة</h3>
                <ul className="space-y-3">
                  {[
                    'استخدام بيئة Jupyter Notebook. مطور JavaScript من الصفر',
                    'استخدام وحدة pandas مع Python لإنشاء وهيكلة البيانات',
                    'تمتلك محفظة من مشاريع تحليل البيانات المختلفة',
                    'إنشاء تصورات البيانات باستخدام matplotlib و seaborn'
                  ].map((item, index) => (
                    <li 
                      key={index} 
                      className="flex items-start space-x-reverse space-x-3"
                    >
                      <FontAwesomeIcon 
                        icon={faCheckCircle} 
                        className="text-primary text-xl mt-1 flex-shrink-0"
                      />
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
  
            {/* Tab Content: Instructor */}
            {activeTab === 'instructor' && (
              <div id="instructor" className="tab-content" data-aos="fade-up">
                <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-6 md:p-8 mb-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-reverse md:space-x-6 mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=90" 
                      alt="المدرب"
                      width="96"
                      height="96"
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                    />
                    <div>
                      <h3 className="text-2xl font-black text-neutral-900 mb-2">أحمد محمد</h3>
                      <p className="text-neutral-600 mb-3">مطور متقدم</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <FontAwesomeIcon 
                            icon={faStar} 
                            className="text-yellow-400 ml-1" 
                          />
                          <span className="text-neutral-700 font-semibold">75,237 تقييم</span>
                          <span className="text-neutral-600 mr-1">4.4 تقييم</span>
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon 
                            icon={faUsers} 
                            className="text-primary ml-1" 
                          />
                          <span className="text-neutral-700 font-semibold">912,970 طالب</span>
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon 
                            icon={faBook} 
                            className="text-primary ml-1" 
                          />
                          <span className="text-neutral-700 font-semibold">16 دورة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-neutral-700 leading-relaxed">
                    أحمد هو معلم رائع، قضى حياته في علوم الحاسوب وحب الطبيعة. لديه خبرة واسعة في تطوير البرمجيات والتحول الرقمي، ويساعد الطلاب في جميع أنحاء العالم على تطوير مهاراتهم.
                  </p>
                </div>
              </div>
            )}

            {/* Tab Content: Reviews */}
            {activeTab === 'reviews' && (
              <div id="reviews" className="tab-content" data-aos="fade-up">
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h2 className="text-3xl font-black text-neutral-900 mb-4 md:mb-0">تقييم الدورة</h2>
                    <div className="text-left md:text-right">
                      <div className="text-4xl font-black text-neutral-900">5.0</div>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon 
                            key={i} 
                            icon={faStar} 
                            className="text-yellow-400" 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    {[63, 29, 6, 1, 1].map((percent, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-sm text-neutral-600 w-16">{5 - index} نجوم</span>
                        <div className="flex-1 bg-neutral-200 rounded-full h-2 mx-4">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-sm text-neutral-600">{percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Reviews */}
                <div className="space-y-6">
                  {[
                    { name: 'فريجانا باونيا', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=90' },
                    { name: 'رزوان إسلام', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=90' },
                    { name: 'بابور أزوم', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=90' }
                  ].map((review, index) => (
                    <div 
                      key={index}
                      className="bg-white border border-neutral-200 rounded-xl p-5 md:p-6"
                    >
                      <div className="flex flex-col md:flex-row md:space-x-reverse md:space-x-4">
                        <img 
                          src={review.img} 
                          alt={review.name}
                          width="64"
                          height="64"
                          className="w-16 h-16 rounded-full object-cover mb-4 md:mb-0"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-neutral-900 mb-1">{review.name}</h4>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <FontAwesomeIcon 
                                key={i} 
                                icon={faStar} 
                                className="text-yellow-400 text-sm" 
                              />
                            ))}
                          </div>
                          <p className="text-neutral-700 leading-relaxed">
                            أفضل إطراء أحصل عليه هو أن يقال لي أنني أشبه أمي. رؤية نفسي في صورتها، مثل هذه الابنة في الأعلى.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-6 text-primary font-semibold hover:underline transition-colors">
                  عرض المزيد
                </button>
              </div>
            )}
          </div>

          {/* Sidebar: Course Info Card */}
          <div className="lg:col-span-1.5">
            <div 
              className="course-info-card p-5 md:p-6 bg-white rounded-2xl shadow-xl sticky top-24"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="mb-6">
                <div className="relative mb-5">
                  <img 
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop&q=90" 
                    alt="معاينة الدورة"
                    width="600"
                    height="400"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white text-primary w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl shadow-lg">
                      <FontAwesomeIcon icon={faPlay} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="text-3xl font-black text-neutral-900">1,500</div>
                    <div className="text-neutral-600">ر.س</div>
                  </div>
                  <div className="text-left md:text-right mt-3 md:mt-0">
                    <div className="text-xl text-neutral-500 line-through">3,000 ر.س</div>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold inline-block mt-1">
                      -50%
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <button className="w-full bg-gradient-to-r from-primary to-accent text-white py-3.5 md:py-4 rounded-xl font-bold text-lg btn-modern transition-all duration-300 hover:shadow-lg">
                    <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
                    أضف إلى السلة
                  </button>
                  <button className="w-full bg-primary text-white py-3.5 md:py-4 rounded-xl font-bold text-lg btn-modern transition-all duration-300 hover:bg-accent hover:shadow-lg">
                    اشتر الآن
                  </button>
                </div>
                <div className="border-t border-neutral-200 pt-4 mb-5">
                  <p className="text-center text-neutral-600">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-primary ml-2" />
                    ضمان استرداد الأموال لمدة 30 يوم
                  </p>
                </div>
                <div className="space-y-3.5 text-sm">
                  {[
                    { icon: faCalendarAlt, label: 'تاريخ البدء', value: '5 ساعات 20 دقيقة' },
                    { icon: faUsers, label: 'المسجلون', value: '100' },
                    { icon: faBook, label: 'المحاضرات', value: '50' },
                    { icon: faSignal, label: 'مستوى المهارة', value: 'مبتدئ' },
                    { icon: faGlobe, label: 'اللغة', value: 'العربية' },
                    { icon: faClipboardCheck, label: 'الاختبارات', value: '10' },
                    { icon: faCertificate, label: 'الشهادة', value: 'نعم' },
                    { icon: faPercentage, label: 'نسبة النجاح', value: '95%' }
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between py-1.5"
                    >
                      <span className="text-neutral-600 flex items-center">
                        <FontAwesomeIcon icon={item.icon} className="text-primary ml-2" />
                        {item.label}
                      </span>
                      <span className="font-semibold text-neutral-900">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <p className="text-center text-neutral-600 text-sm mb-3">
                    للتفاصيل حول الدورة
                  </p>
                  <p className="text-center text-primary font-bold">
                    <FontAwesomeIcon icon={faPhone} className="ml-2" />
                    اتصل بنا: +444 555 666 777
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}