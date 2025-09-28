import { useState, useCallback } from "react";

/**
 * Custom hook do obsługi stanu menu mobilnego
 *
 * @returns obiekt z stanem i metodami do zarządzania menu mobilnym
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
}
