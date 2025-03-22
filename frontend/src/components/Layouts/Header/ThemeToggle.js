import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-all duration-300 bg-gray-300 dark:bg-gray-900 border-2"
    >
      {theme === "dark" ? (
        <SunIcon className="w-6 h-6 text-yellow-500 text-2xl" />
      ) : (
        <MoonIcon className="w-6 h-6 text-black" />
      )}
    </button>
  );
};

export default ThemeToggle;
