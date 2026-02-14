"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
} from "@fortawesome/free-solid-svg-icons";

export default function FontSizeController() {
  const { t } = useTranslation();
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    document.documentElement.style.fontSize = fontSize + "px";
  }, [fontSize]);

  const increaseFont = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const decreaseFont = () => {
    if (fontSize > 12) setFontSize(fontSize - 2);
  };

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <button
        onClick={increaseFont}
        className="flex items-center gap-1 hover:text-slate-100 transition"
      >
        <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
        <span className="hidden sm:inline">{t("increase_font")}</span>
      </button>

      <button
        onClick={decreaseFont}
        className="flex items-center gap-1 hover:text-slate-100 transition"
      >
        <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
        <span className="hidden sm:inline">{t("decrease_font")}</span>
      </button>
    </div>
  );
}
