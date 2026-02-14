"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-200 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & description */}
          <div className="space-y-3">
            <Image
              src="/site/logo.png"
              alt="Basqat"
              width={150}
              height={48}
              className="h-12 w-auto"
            />
            <p className="text-slate-400 text-sm leading-6">
              {t("footer.description")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold mb-3">
              {t("footer.links.title")}
            </h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li><Link href="#home">{t("footer.links.home")}</Link></li>
              <li><Link href="#services">{t("footer.links.services")}</Link></li>
              <li><Link href="#courses">{t("footer.links.programs")}</Link></li>
              <li><Link href="#teachers">{t("footer.links.trainers")}</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-lg font-bold mb-3">
              {t("footer.info.title")}
            </h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li><Link href="#news">{t("footer.info.news")}</Link></li>
              <li><Link href="#gallery">{t("footer.info.gallery")}</Link></li>
              <li><Link href="#contact">{t("footer.info.contact")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-3">
              {t("footer.contact.title")}
            </h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>
                <Link href="mailto:hello@basqat.com">
                  hello@basqat.com
                </Link>
              </li>
              <li>
                <Link href="tel:+966500000000">
                  +966 50 000 0000
                </Link>
              </li>

              {/* Social */}
              <li className="flex gap-3 pt-2">
                <Link href="https://www.instagram.com/" target="_blank" aria-label="Instagram">
                  <FontAwesomeIcon icon={faInstagram} />
                </Link>

                <Link href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </Link>

                <Link href="https://www.twitter.com/" target="_blank" aria-label="Twitter">
                  <FontAwesomeIcon icon={faXTwitter} />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-8 pt-6 text-sm text-slate-400 flex flex-col sm:flex-row justify-between gap-3">
          <span>{t("footer.bottom.copyright")}</span>
          <span>{t("footer.bottom.made")}</span>
        </div>
      </div>
    </footer>
  );
}
