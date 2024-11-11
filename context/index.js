"use client";
import { createContext, useState } from "react";
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [mapDropIsOpen, setMapDropIsOpen] = useState(false);
  const [shareDropIsOpen, setShareDropIsOpen] = useState(false);
  const [contactDropIsOpen, setContactDropIsOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        menuIsOpen,
        setMenuIsOpen,
        mapDropIsOpen,
        setMapDropIsOpen,
        shareDropIsOpen,
        setShareDropIsOpen,
        contactDropIsOpen,
        setContactDropIsOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
