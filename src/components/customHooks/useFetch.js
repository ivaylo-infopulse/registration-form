import { useState, useEffect } from "react";
import axios from "axios";

export const useFetch = (url) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    })();
  }, [url]);

  return { data };
};
