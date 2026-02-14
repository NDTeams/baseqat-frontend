'use client';

import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: FC<SearchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="mt-10 w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-slate-200 text-slate-600 hover:text-primary flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            عن ماذا تبحث ؟
          </h3>
          <span className="w-10"></span>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <input
            type="text"
            placeholder="كلمات البحث"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <div className="flex justify-end">
            <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-800 transition">
              بحث
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
