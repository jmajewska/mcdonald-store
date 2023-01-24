import { createContext } from "react";


interface MenuContextModel {
  isCartOpen:boolean;
  setIsCartOpen: (isOpened: boolean) => void
}

export const MenuContext = createContext(false)

