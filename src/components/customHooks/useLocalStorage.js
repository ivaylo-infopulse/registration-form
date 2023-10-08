import { useState } from "react";

export const useLocalStorage = (key, inititalValue) => {
  const [value, setValue] = useState(inititalValue | []);

  localStorage.setItem(key, JSON.stringify(value));

  return [value, setValue];
};
