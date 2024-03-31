import { useState, useEffect } from "react";

export function useLocalStorge(initialValue, key) {
  const [value, setValue] = useState(function () {
    const browserData = localStorage.getItem(key);
    return JSON.parse(browserData) || initialValue;
  }); // State for storing watched movies

  // Storing the Watched movie data in browser local storage
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
