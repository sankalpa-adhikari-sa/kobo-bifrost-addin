import { useEffect, useState } from "react";

export function useStoredToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await OfficeRuntime.storage.getItem("authToken");
      setToken(saved);
    })();
  }, []);

  const saveToken = async (newToken: string) => {
    await OfficeRuntime.storage.setItem("authToken", newToken);
    setToken(newToken);
  };

  const clearToken = async () => {
    await OfficeRuntime.storage.removeItem("authToken");
    setToken(null);
  };

  return { token, saveToken, clearToken };
}
