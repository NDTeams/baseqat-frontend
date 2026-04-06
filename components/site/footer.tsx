'use client';

import React from "react";
import styles from './footer.module.css';
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt, 
  faChevronLeft 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faYoutube,
  faSnapchat,
  faXTwitter,
  faInstagram,
  faTiktok,
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { href: "/", label: t('footer.links.home') || "الرئيسية" },
    { href: "/services", label: t('footer.links.services') || "الخدمات" },
    { href: "/aboutus", label: t('HomeSite.about_us') || "من نحن" },
    { href: "/terms", label: t('footer.links.terms') || "الشروط والأحكام" },
    { href: "/privacy", label: t('footer.links.privacy') || "سياسة الخصوصية" },
  ];

  const socialLinks = [
    { href: "https://www.youtube.com/channel/UC5PO_v39WONixAJZK-vigjw", icon: faYoutube, label: "YouTube" },
    { href: "https://x.com/baseqat_com", icon: faXTwitter, label: "X" },
    { href: "https://www.instagram.com/baseqat_com", icon: faInstagram, label: "Instagram" },
    { href: "https://www.tiktok.com/@baseqat_com", icon: faTiktok, label: "TikTok" },
    { href: "https://www.snapchat.com/add/baseqat_com", icon: faSnapchat, label: "Snapchat" },
  ];

  const phoneNumber = "+966 55 843 8050";
  const email = "info@baseqatbusiness.com";
  const whatsappLink = "https://api.whatsapp.com/send?phone=966558438050";

  return (
    <footer id="contact" className={`${styles.footer} text-white py-20`}
  style={{ background: 'linear-gradient(135deg, #1a5f4a 0%, #2d8659 100%)' } }>
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
            <p className="text-lg font-bold mb-4">باسقات للأعمال</p>
            <p className="text-white/80 mb-6 leading-relaxed text-sm">
              {t('footer.description') || 'مسرعة أعمال تدعم رواد الأعمال بخدمات التحضير، التسريع، والتحول الرقمي.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-xl font-bold mb-6">{t('footer.links.title') || 'روابط سريعة'}</h3>
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
            <h3 className="text-xl font-bold mb-6">{t('footer.contact.title') || 'تواصل معنا'}</h3>
            <ul className="space-y-4 text-white/80">
              <li className="flex items-center space-x-reverse space-x-3">
                <Link href={whatsappLink} target="_blank" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition flex-shrink-0">
                  <FontAwesomeIcon icon={faPhone} />
                </Link>
                <a href={whatsappLink} target="_blank" className="hover:text-white transition text-right" dir="ltr">
                  {phoneNumber}
                </a>
              </li>
              <li className="flex items-center space-x-reverse space-x-3">
                <a href={`mailto:${email}`} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition">
                  <FontAwesomeIcon icon={faEnvelope} />
                </a>
                <a href={`mailto:${email}`} className="hover:text-white transition">
                  {email}
                </a>
              </li>
              <li className="flex items-start space-x-reverse space-x-3">
                <a 
                  href="https://www.google.com/maps/place/%D8%A8%D8%A7%D8%B3%D9%82%D8%A7%D8%AA%E2%80%AD/@24.4468012,39.5086862,113m/data=!3m1!1e3!4m6!3m5!1s0x15bdc74420baf74b:0x350525b6d9cdd250!8m2!3d24.4468062!4d39.5085615!16s%2Fg%2F11g10plq_b" 
                  target="_blank"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center mt-1 transition flex-shrink-0"
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </a>
                <div>
                  <a
                    href="https://www.google.com/maps/place/%D8%A8%D8%A7%D8%B3%D9%82%D8%A7%D8%AA%E2%80%AD/@24.4468012,39.5086862,113m/data=!3m1!1e3!4m6!3m5!1s0x15bdc74420baf74b:0x350525b6d9cdd250!8m2!3d24.4468062!4d39.5085615!16s%2Fg%2F11g10plq_b"
                    target="_blank"
                    className="hover:text-white transition block"
                  >
                    <div className="font-semibold">{t('footer.contact.locationTitle') || 'الرياض - حي النخيل'}</div>
                    <div className="text-sm">{t('footer.contact.locationDesc') || 'المملكة العربية السعودية'}</div>
                    <div className="text-xs mt-1 text-white/60">{t('footer.contact.viewOnMap') || 'انقر لعرض على الخريطة'}</div>
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-xl font-bold mb-6">تابعنا</h3>
            <div className="flex space-x-reverse space-x-4 mb-8">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title={social.label}
                  className={`${styles.socialIconModern} text-xl hover:scale-110 transition-transform`}
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
            <a href={whatsappLink} target="_blank" className={`w-full ${styles.btnModern} bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition text-center block`}>
              تواصل معنا عبر الواتس
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/80">
          <p>{t('footer.bottom.copyright') || '© 2025 باسقات لخدمات الأعمال. جميع الحقوق محفوظة.'}</p>
         
        </div>
      </div>
    </footer>
  );
}
