// ScrollLock.tsx
import React, { useEffect } from "react";

const ScrollLock = ({ isOpen }: { isOpen: boolean }) => {
  useEffect(() => {
    // Store the original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    if (isOpen) {
      // Prevent scroll
      document.body.style.overflow = 'hidden';
      // Optional: prevent iOS Safari bounce effect
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  return null;
};

export default ScrollLock;