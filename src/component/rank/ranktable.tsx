import React, { useEffect, useState } from "react";

const scrollTop = (): number => {
  return Math.max(
    window.pageYOffset,
    document.documentElement.scrollTop,
    document.body.scrollTop
  );
};

export default function NavBar() {
  const [isTop, setIsTop] = useState<boolean>(true);

  const onScroll = (): void => {
    const position = scrollTop();
    if (position >= 80) {
      setIsTop(false);
    } else {
      setIsTop(true);
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
    return (): void => document.removeEventListener("scroll", onScroll);
  });

  const scrollStyle: React.CSSProperties = isTop
    ? { backgroundColor: "#fff" }
    : { backgroundColor: "#000", opacity: 0.8 };

  return (
    <nav style={scrollStyle}>
      <h1>aaaa</h1>
    </nav>
  );
}
