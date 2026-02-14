'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt, 
  faChevronLeft, 
  faUserGraduate, 
  faTag, 
  faCalendar, 
  faGlobe, 
  faCertificate, 
  faStar 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faLinkedinIn, 
  faTwitter, 
  faFacebookF, 
  faInstagram 
} from '@fortawesome/free-brands-svg-icons';

export default function CourseHero() {
  return (
    <section className="course-hero w-full py-12 md:py-16 relative z-10 bg-gradient-to-br from-[#0a2e1f] via-[#1a5f4a] to-[#2d8659]">
      <div className="container mx-auto px-6 relative z-10">
        <div className="w-full">
          
          {/* Tag & Rating */}
          <div className="flex items-center space-x-reverse space-x-3 mb-4" data-aos="fade-up">
            <span className="bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold">
              الأكثر مبيعاً
            </span>
            <div className="flex items-center">
              <div className="star-rating flex items-center ml-2">
                <FontAwesomeIcon icon={faStar} className="text-sm text-white" />
                <span className="text-white font-bold mr-1">4.8</span>
              </div>
              <span className="text-white/80 text-sm mr-2">(215,475 تقييم)</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4" data-aos="fade-up" data-aos-delay="100">
            أساسيات التحول الرقمي في المنشآت: من الصفر إلى الاحتراف
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl" data-aos="fade-up" data-aos-delay="200">
            أتقن التحول الرقمي من خلال بناء 100 مشروع في 100 يوم. تعلم علوم البيانات، الأتمتة، بناء المواقع، الألعاب والتطبيقات!
          </p>

          {/* Course Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6" data-aos="fade-up" data-aos-delay="300">
            <div className="flex items-center text-white/90">
              <FontAwesomeIcon icon={faUserGraduate} className="ml-2" />
              <span className="text-sm">أحمد محمد</span>
            </div>
            <span className="text-white/50">•</span>
            <div className="flex items-center text-white/90">
              <FontAwesomeIcon icon={faTag} className="ml-2" />
              <span className="text-sm">في التطوير</span>
            </div>
            <span className="text-white/50">•</span>
            <div className="flex items-center text-white/90">
              <FontAwesomeIcon icon={faCalendar} className="ml-2" />
              <span className="text-sm">آخر تحديث 12/2024</span>
            </div>
            <span className="text-white/50">•</span>
            <div className="flex items-center text-white/90">
              <FontAwesomeIcon icon={faGlobe} className="ml-2" />
              <span className="text-sm">العربية</span>
            </div>
            <span className="text-white/50">•</span>
            <div className="flex items-center text-white/90">
              <FontAwesomeIcon icon={faCertificate} className="ml-2" />
              <span className="text-sm">شهادة معتمدة</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-4" data-aos="fade-up" data-aos-delay="400">
            <div className="flex items-center">
              <span className="text-3xl font-black text-white">1,500</span>
              <span className="text-white/80 mr-2">ر.س</span>
            </div>
            <span className="text-white/60 line-through text-xl">3,000 ر.س</span>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">-50%</span>
          </div>

          {/* Social Icons (Optional) */}
          <div className="flex items-center mt-6 space-x-4">
            <FontAwesomeIcon icon={faLinkedinIn} className="text-white cursor-pointer" />
            <FontAwesomeIcon icon={faTwitter} className="text-white cursor-pointer" />
            <FontAwesomeIcon icon={faFacebookF} className="text-white cursor-pointer" />
            <FontAwesomeIcon icon={faInstagram} className="text-white cursor-pointer" />
          </div>

        </div>
      </div>
    </section>
  );
}
