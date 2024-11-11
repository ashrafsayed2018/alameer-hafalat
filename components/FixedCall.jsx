import { ContactInfo } from "../app/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function FixedCall() {
  return (
    <div>
      <div className="large-screen hidden lg:block fixed left-7 bottom-5 ">
        <div
          className="themeBgColor hoverBgColor h-[55px] w-[55px] rounded-full flex items-center justify-center group transition-all duration-500 cursor-pointer"
          style={{
            boxShadow: "8px 8px 25px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Image
            src="/icons/comments.svg"
            alt="call"
            width={20}
            height={20}
            className="h-7 w-7 group-hover:hidden"
          />
          <Image
            src="/icons/times.svg"
            alt="call"
            width={20}
            height={20}
            className="h-7 w-7 group-hover:block hidden"
          />
          <div className="w-16 hidden group-hover:flex flex-col items-center justify-end absolute bottom-[50px] left-0">
            {ContactInfo.map((link) => {
              return (
                <Link
                  href={link.href}
                  key={link.id}
                  className={`shadow-xl hover:shadow-none transition-all duration-500 p-1 rounded-full w-10 h-10 flex items-center justify-center mb-3 cursor-pointer ${
                    link.name === "الهاتف" ? "themeBgColor" : "bg-green-800"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={link.icon}
                    color="white"
                    className="text-2xl"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FixedCall;
