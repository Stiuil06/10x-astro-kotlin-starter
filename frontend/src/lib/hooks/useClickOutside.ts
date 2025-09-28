import { useEffect, useRef, type RefObject } from "react";

/**
 * Custom hook do obsługi kliknięć poza określonym elementem
 *
 * @param isActive - czy hook ma być aktywny
 * @param onOutsideClick - callback wywoływany przy kliknięciu poza elementem
 * @param excludeSelectors - selektory elementów, które mają być wykluczone z obsługi
 * @returns ref do przypisania do elementu, który ma być obserwowany
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  isActive: boolean,
  onOutsideClick: () => void,
  excludeSelectors: string[] = []
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Sprawdź czy kliknięcie było wewnątrz obserwowanego elementu
      if (ref.current && ref.current.contains(target)) {
        return;
      }

      // Sprawdź czy kliknięcie było na wykluczonych elementach
      const isExcluded = excludeSelectors.some((selector) => {
        const element = target as Element;
        return element.closest(selector) !== null;
      });

      if (!isExcluded) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive, onOutsideClick, excludeSelectors]);

  return ref;
}
