import { useState, useRef, useEffect } from "react";

export function useMatchContextMenu() {
  const [menu, setMenu] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const closeMenu = () => setMenu(null);

  const onContextMenu = (match, e) => {
    e.preventDefault();
    setMenu({ match, x: e.clientX, y: e.clientY });
  };

  const getLongPressProps = (match) => ({
    onContextMenu: (e) => { e.preventDefault(); setMenu({ match, x: e.clientX, y: e.clientY }); },
    onTouchStart: (e) => {
      const { clientX, clientY } = e.touches[0];
      timerRef.current = setTimeout(() => setMenu({ match, x: clientX, y: clientY }), 500);
    },
    onTouchEnd: () => clearTimeout(timerRef.current),
    onTouchMove: () => clearTimeout(timerRef.current),
  });

  return { menu, closeMenu, onContextMenu, getLongPressProps };
}
