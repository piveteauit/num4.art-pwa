import { createContext, useContext, useState, ReactNode } from "react";

const MenuContext = createContext({
  isMenuOpen: false,
  setIsMenuOpen: (open: boolean) => {},
});

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider = ({ children }: MenuProviderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);