'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './header.module.css'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBars, 
  faTimes, 
  faHome, 
  faChevronLeft,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const navItems = [
    { href: '/', label: 'الرئيسية' },
    { href: '/#about', label: 'من نحن' },
    { href: '/#services', label: 'الخدمات' },
    { href: '/courses', label: 'الدورات' },
    { href: '/#stories', label: 'قصص النجاح' },
    { href: '/#contact', label: 'اتصل بنا' },
  ]

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.includes('#')) return pathname === href.split('#')[0]
    return pathname === href
  }

  return (
    <header 
      className={`${styles.header} sticky top-0 transition-all duration-400 ${
        isScrolled ? styles.scrolled : ''
      }`}
    >
      {/* Navigation Bar */}
      <nav className={styles.nav}>
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className={styles.logoLink} onClick={closeMobileMenu}>
          <Image 
  src="/site/logo.png" 
  alt="logo" 
  width={150}    // 👈 اضبط حسب حجمك
  height={50}    // 👈 اضبط حسب حجمك
  className="h-10 md:h-12 w-auto transition-all duration-300"
/>

          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileMenu}
              className={`${styles.navLink} ${
                isActiveLink(item.href) ? styles.active : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button 
            className={`${styles.ctaBtn} ${styles.hiddenMobile}`}
            onClick={() => window.open('https://wa.me/yourphonenumber', '_blank')}
          >
            <span>احجز جلسة</span>
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          </button>

          {/* Mobile Menu Button */}
         <button 
  className={`${styles.mobileMenuBtn} block lg:hidden`}
  onClick={handleMobileMenuToggle}
>
  <FontAwesomeIcon 
    icon={mobileMenuOpen ? faTimes : faBars} 
    className="text-xl"
  />
</button>

        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.show : ''}`}
      >
        <div className={styles.mobileMenuContent}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileMenu}
              className={`${styles.mobileNavLink} ${
                isActiveLink(item.href) ? styles.active : ''
              }`}
            >
              {item.label}
            </Link>
          ))}

          <button 
            className={styles.ctaBtn}
            onClick={() => {
              closeMobileMenu()
              window.open('https://wa.me/yourphonenumber', '_blank')
            }}
          >
            <span>احجز جلسة استشارية</span>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbContainer}>
          <nav className={styles.breadcrumbNav}>
            <Link href="/" className={styles.breadcrumbItem}>
              <FontAwesomeIcon icon={faHome} className="text-xs ml-1" />
              <span>الرئيسية</span>
            </Link>
            <FontAwesomeIcon icon={faChevronLeft} className={styles.breadcrumbSeparator} />
            <Link href="/courses" className={styles.breadcrumbItem}>
              الدورات
            </Link>
            <FontAwesomeIcon icon={faChevronLeft} className={styles.breadcrumbSeparator} />
            <span className="text-neutral-800 font-medium">تفاصيل الدورة</span>
          </nav>
        </div>
      </div>
    </header>
  )
}