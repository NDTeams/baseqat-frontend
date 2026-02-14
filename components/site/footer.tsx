'use client';

import React from "react";
import styles from './footer.module.css'; // استدعاء CSS Module
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt, 
  faChevronLeft 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faLinkedinIn, 
  faTwitter, 
  faFacebookF, 
  faInstagram 
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const quickLinks = [
    { href: "index.html", label: "الرئيسية" },
    { href: "index.html#about", label: "من نحن" },
    { href: "index.html#services", label: "الخدمات" },
    { href: "courses.html", label: "الدورات" },
    { href: "index.html#stories", label: "قصص النجاح" },
    { href: "index.html#contact", label: "اتصل بنا" },
  ];

  const socialLinks = [
    { href: "#", icon: faLinkedinIn },
    { href: "#", icon: faTwitter },
    { href: "#", icon: faFacebookF },
    { href: "#", icon: faInstagram },
  ];

  return (
    <footer id="contact" className={`${styles.footer} text-white py-20`}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Company Info */}
          <div data-aos="fade-up">
            <div className="flex items-center space-x-reverse space-x-3 mb-6">
              <div className="bg-white p-3 rounded-xl shadow-lg">
            <Image 
               src="/site/logo.png" 
               alt="logo" 
               width={80}  
               height={80} 
             />              </div>
            </div>
            <p className="text-lg font-bold mb-4">شركة باسقات الأعمال</p>
            <p className="text-white/80 mb-6 leading-relaxed text-sm">
              تسعى لتوفير بيئة داعمة لرواد الأعمال وتمكينهم من إطلاق مشاريعهم الريادية بنجاح، من التدريب والإرشاد إلى الدعم التنفيذي.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-xl font-bold mb-6">روابط سريعة</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition flex items-center space-x-reverse space-x-2 group"
                  >
                    <FontAwesomeIcon 
                      icon={faChevronLeft} 
                      className="text-xs group-hover:translate-x-[-4px] transition-transform" 
                    />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-xl font-bold mb-6">تواصل معنا</h3>
            <ul className="space-y-4 text-white/80">
              <li className="flex items-center space-x-reverse space-x-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <span>310-437-2766</span>
              </li>
              <li className="flex items-center space-x-reverse space-x-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <span>info@basqat.sa</span>
              </li>
              <li className="flex items-start space-x-reverse space-x-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mt-1">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <div>
                  <div>المدينة المنورة</div>
                  <div>المملكة العربية السعودية</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-xl font-bold mb-6">تابعنا</h3>
            <div className="flex space-x-reverse space-x-4 mb-8">
              {socialLinks.map((social, idx) => (
                <Link key={idx} href={social.href} className={styles.socialIconModern}>
                  <FontAwesomeIcon icon={social.icon} className="text-xl" />
                </Link>
              ))}
            </div>
            <button className={`w-full ${styles.btnModern} bg-white text-primary px-6 py-3 rounded-xl font-bold`}>
              <span>احجز جلسة استشارية</span>
            </button>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/80">
          <p>&copy; 2025 باسقات للأعمال. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
