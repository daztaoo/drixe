"use client";

import { useEffect } from "react";

export default function ClientGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Disable right click
    const disableRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    // Block devtools keys
    const blockKeys = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", blockKeys);

    // Detect devtools open
    const detectDevTools = () => {
      if (
        window.outerWidth - window.innerWidth > 160 ||
        window.outerHeight - window.innerHeight > 160
      ) {
        document.body.innerHTML = `
          <div style="
            display:flex;
            align-items:center;
            justify-content:center;
            height:100vh;
            background:black;
            color:white;
            font-family:monospace;
            letter-spacing:2px;
          ">
            curiosity noted.
          </div>
        `;
      }
    };

    const interval = setInterval(detectDevTools, 500);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      window.removeEventListener("keydown", blockKeys);
      clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
}
