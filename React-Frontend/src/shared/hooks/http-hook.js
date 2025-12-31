import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      const httpAbortctrl = new AbortController();
      activeHttpRequests.current.push(httpAbortctrl);
      try {
        setIsLoading(true);
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortctrl.signal,
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortctrl
        );
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "something went wrong");
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);
  return { isLoading, error, sendRequest, clearError };
};
