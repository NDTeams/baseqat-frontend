import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
export default function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/9663104372766"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 left-8 z-50 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 transition-all hover:scale-110 lg:bottom-8"
    >
      <FontAwesomeIcon icon={faWhatsapp} className="text-3xl" />
    </Link>
  );
}
