"use client";
import { useState } from "react";

function ThemeTest() {
  const [dark, setDark] = useState(false);
  return (
    <div className={dark ? "dark" : ""}>
      <div className="bg-white dark:bg-black p-8">
        <button onClick={() => setDark(!dark)}>Theme</button>
      </div>
    </div>
  );
}

export default ThemeTest;
