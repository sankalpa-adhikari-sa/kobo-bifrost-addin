import { useEffect, useState } from "react";

function setInLocalStorage(key: string, value: string) {
  const myPartitionKey = Office.context.partitionKey;

  if (myPartitionKey) {
    localStorage.setItem(myPartitionKey + key, value);
  } else {
    localStorage.setItem(key, value);
  }
}

function getFromLocalStorage(key: string): string | null {
  const myPartitionKey = Office.context.partitionKey;

  if (myPartitionKey) {
    return localStorage.getItem(myPartitionKey + key);
  } else {
    return localStorage.getItem(key);
  }
}

function removeFromLocalStorage(key: string) {
  const myPartitionKey = Office.context.partitionKey;

  if (myPartitionKey) {
    localStorage.removeItem(myPartitionKey + key);
  } else {
    localStorage.removeItem(key);
  }
}

export function useStoredToken() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        let saved = getFromLocalStorage("authToken");

        if (!saved) {
          try {
            saved = await OfficeRuntime.storage.getItem("authToken");
          } catch (error) {
            console.warn("OfficeRuntime.storage not available:", error);
          }
        }

        setToken(saved);
      } catch (error) {
        console.error("Error loading token:", error);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const saveToken = async (newToken: string) => {
    try {
      setInLocalStorage("authToken", newToken);

      try {
        await OfficeRuntime.storage.setItem("authToken", newToken);
      } catch (error) {
        console.warn("OfficeRuntime.storage save failed:", error);
      }

      setToken(newToken);
    } catch (error) {
      console.error("Error saving token:", error);
      throw new Error("Failed to save token");
    }
  };

  const clearToken = async () => {
    try {
      removeFromLocalStorage("authToken");

      try {
        await OfficeRuntime.storage.removeItem("authToken");
      } catch (error) {
        console.warn("OfficeRuntime.storage clear failed:", error);
      }

      setToken(null);
    } catch (error) {
      console.error("Error clearing token:", error);
      throw new Error("Failed to clear token");
    }
  };

  return { token, saveToken, clearToken, isLoading };
}
