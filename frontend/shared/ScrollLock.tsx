// ScrollLock.tsx
import React, { useEffect } from "react";

const ScrollLock = ({ isOpen }: { isOpen: boolean }) => {
  useEffect(() => {
    const originalStyles = {
      overflow: window.getComputedStyle(document.body).overflow,
      paddingRight: window.getComputedStyle(document.body).paddingRight,
    };
    
    if (isOpen) {
      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Lock body scroll but compensate for removed scrollbar
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      // Restore original styles
      document.body.style.overflow = originalStyles.overflow;
      document.body.style.paddingRight = originalStyles.paddingRight;
    };
  }, [isOpen]);

  return null;
};

export default ScrollLock;