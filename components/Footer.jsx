import { SocialShareLinks } from "../app/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <div className="bg-gray-950 h-[250px] md:h-[200px] flex items-center justify-between px-20 py-10 lg:py-0 flex-col lg:flex-row pb-20 md:pb-0">
      <div className="copy-rights">
        <p className="text-white text-center">© 2024.جميع الحقوق محفوظة.</p>
        <div className="flex justify-center mt-2">
          <Link href="/blog" className="text-white hover:text-gray-300">
            المدونة
          </Link>
        </div>
      </div>

      <div className="social-icons">
        <p className="text-white text-center -mt-4 pb-4">تابعنا على</p>
        <div className="flex items-center justify-center gap-5">
          {SocialShareLinks.map((link) => {
            return (
              <Link
                href={link.url}
                key={link.id}
                className="cursor-pointer themeBgColor hoverBgColor h-10 w-10 rounded-full flex items-center justify-center"
              >
                <FontAwesomeIcon icon={link.icon} color="white" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Footer;
