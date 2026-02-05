"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faExclamationCircle, faTimes } from "@fortawesome/free-solid-svg-icons";

interface ModalMessageProps {
  isOpen: boolean;
  type: "success" | "error" | "warning";
  title: string;
  message: string | string[];
  onClose: () => void;
  autoClose?: number; // auto close after milliseconds (0 = no auto close)
}

export default function ModalMessage({
  isOpen,
  type,
  title,
  message,
  onClose,
  autoClose = 5000,
}: ModalMessageProps) {
  useEffect(() => {
    if (isOpen && autoClose > 0) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-5xl mb-4" />;
      case "error":
        return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 text-5xl mb-4" />;
      case "warning":
        return <FontAwesomeIcon icon={faExclamationCircle} className="text-yellow-500 text-5xl mb-4" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case "success":
        return "text-green-700";
      case "error":
        return "text-red-700";
      case "warning":
        return "text-yellow-700";
    }
  };

  const getMessageColor = () => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500 hover:bg-green-600";
      case "error":
        return "bg-red-500 hover:bg-red-600";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${getBackgroundColor()} border rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>

        {/* Icon */}
        <div className="flex justify-center">{getIcon()}</div>

        {/* Title */}
        <h2 className={`${getTitleColor()} text-2xl font-bold text-center mb-3`}>{title}</h2>

        {/* Message */}
        <div className={`${getMessageColor()} text-center mb-6 text-sm`}>
          {Array.isArray(message) ? (
            <ul className="space-y-2">
              {message.map((msg, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{msg}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>{message}</p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`${getButtonColor()} text-white w-full py-2 rounded-lg font-semibold transition`}
        >
          حسناً
        </button>
      </div>
    </div>
  );
}
