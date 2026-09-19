"use client";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SiteInfo } from "../app/data";

const FloatingContact = () => {
  return (
    <div className="fixed bottom-5 left-4 z-40 flex flex-col items-center space-y-3 lg:bottom-7 lg:left-7">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${SiteInfo.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="text-white text-xl md:text-2xl" />
      </a>

      {/* Phone Button */}
      <a
        href={`tel:${SiteInfo.mobileNumber}`}
        aria-label="اتصال هاتفي"
        className="w-12 h-12 md:w-14 md:h-14 themeBgColor rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <FontAwesomeIcon icon={faPhone} className="text-white text-xl md:text-2xl" />
      </a>
    </div>
  );
};

export default FloatingContact;
