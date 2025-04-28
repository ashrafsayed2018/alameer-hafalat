"use client";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SiteInfo } from "../app/data";

const FloatingContact = () => {
  return (
    <div className="fixed bottom-10 right-4 z-50 flex flex-col items-center space-y-3">
      {/* Instagram Button */}
      <a
        href={SiteInfo.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <FontAwesomeIcon icon={faInstagram} className="text-white text-2xl" />
      </a>

      {/* Phone Button */}
      <a
        href={`tel:${SiteInfo.mobileNumber}`}
        className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <FontAwesomeIcon icon={faPhone} className="text-white text-2xl" />
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${SiteInfo.mobileNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="text-white text-2xl" />
      </a>
    </div>
  );
};

export default FloatingContact;
