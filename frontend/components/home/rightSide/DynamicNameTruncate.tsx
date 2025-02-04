import { useEffect, useState } from "react";

const DynamicNameTruncate = ({ text }: { text: string }) => {
  const [charLimit, setCharLimit] = useState(8);

  useEffect(() => {
    const updateCharLimit = () => {
      if (window.innerWidth >= 1280) {
        // xl breakpoint
        setCharLimit(16);
      } else if (window.innerWidth >= 1108) {
        // lg breakpoint
        setCharLimit(12);
      }  else {
        setCharLimit(8);
      }
    };

    // Initial setup
    updateCharLimit();

    // Update on resize
    window.addEventListener("resize", updateCharLimit);

    return () => window.removeEventListener("resize", updateCharLimit);
  }, []);

  const fullName = `${text}`.trim();
  const displayName =
    fullName.length > charLimit
      ? `${fullName.slice(0, charLimit)}...`
      : fullName;

  return <p>{displayName}</p>;
};

export default DynamicNameTruncate;
