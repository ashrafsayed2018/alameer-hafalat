"use client";
import { useContext } from "react";
import Close from "../buttons/Close";
import { NavLinks } from "../../app/data";
import Link from "next/link";
import { AppContext } from "../../context";
import Image from "next/image";

function MenuDropDown() {
  const {
    menuIsOpen,
    setMenuIsOpen,
    mapDropIsOpen,
    setMapDropIsOpen,
    shareDropIsOpen,
    setShareDropIsOpen,
    contactDropIsOpen,
    setContactDropIsOpen,
  } = useContext(AppContext);

  const handleClose = () => {
    setMenuIsOpen(false);
  };

  return (
    <section
      className={`h-screen bg-[#1a1a1a] w-full transition-transform duration-500 ease-in-out fixed top-0 left-0 z-50 ${
        menuIsOpen ? "translate-y-0" : "translate-y-[-100%]"
      }`}
    >
      <Close
        styles={"absolute top-5 right-5 w-10 h-10 cursor-pointer"}
        handleClose={handleClose}
      />
      {/* navlinks */}
      <ul className="flex flex-col items-center justify-center gap-5 pt-44">
        {NavLinks.map((navLink) => {
          return (
            <li key={navLink.id} className="text-white">
              <a
                href={navLink.url}
                className="text-xl hoverTextColor cursor-pointer"
              >
                {navLink.name}
              </a>
            </li>
          );
        })}
      </ul>

      <div className="w-24 h-[.7px] themeBgColor mx-auto mt-[120px] flex items-start justify-center ">
        <ul className="flex items-center gap-1 pt-[15px]">
          <li className="bg-white cursor-pointer w-[29px] h-[29px] rounded-full flex items-center justify-center">
            <Image
              src="/icons/location-arrow.svg"
              alt="location"
              width={12}
              height={12}
              className="h-3 w-3"
              onClick={() => setMapDropIsOpen(!mapDropIsOpen)}
            />
          </li>
          <li className="bg-white cursor-pointer w-[29px] h-[29px] rounded-full flex items-center justify-center">
            <Image
              src="/icons/share-alt-black.svg"
              alt="share"
              width={12}
              height={12}
              className="h-3 w-3"
              onClick={() => setShareDropIsOpen(!shareDropIsOpen)}
            />
          </li>
          <li className="bg-white cursor-pointer w-[29px] h-[29px] rounded-full flex items-center justify-center">
            <Image
              src="/icons/phone-black.svg"
              alt="phone"
              width={12}
              height={12}
              className="h-3 w-3"
              onClick={() => setContactDropIsOpen(!contactDropIsOpen)}
            />
          </li>
        </ul>
      </div>
    </section>
  );
}

export default MenuDropDown;
