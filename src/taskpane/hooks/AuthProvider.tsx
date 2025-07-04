import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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

interface AuthContextType {
  token: string | null;
  kpiUrl: string | null;
  saveToken: (newToken: string) => Promise<void>;
  clearToken: () => Promise<void>;
  saveKpiUrl: (newKpiUrl: string) => Promise<void>;
  clearKpiUrl: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [kpiUrl, setKpiUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        let savedToken = getFromLocalStorage("authToken");
        let savedKpiUrl = getFromLocalStorage("kpiUrl");

        if (!savedToken || !savedKpiUrl) {
          try {
            if (!savedToken) {
              savedToken = await OfficeRuntime.storage.getItem("authToken");
            }
            if (!savedKpiUrl) {
              savedKpiUrl = await OfficeRuntime.storage.getItem("kpiUrl");
            }
          } catch (error) {
            console.warn("OfficeRuntime.storage not available:", error);
          }
        }

        setToken(savedToken);
        setKpiUrl(savedKpiUrl);
      } catch (error) {
        console.error("Error loading token or kpiUrl:", error);
        setToken(null);
        setKpiUrl(null);
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

  const saveKpiUrl = async (newKpiUrl: string) => {
    try {
      setInLocalStorage("kpiUrl", newKpiUrl);
      try {
        await OfficeRuntime.storage.setItem("kpiUrl", newKpiUrl);
      } catch (error) {
        console.warn("OfficeRuntime.storage save failed for kpiUrl:", error);
      }
      setKpiUrl(newKpiUrl);
    } catch (error) {
      console.error("Error saving kpiUrl:", error);
      throw new Error("Failed to save kpiUrl");
    }
  };

  const clearKpiUrl = async () => {
    try {
      removeFromLocalStorage("kpiUrl");
      try {
        await OfficeRuntime.storage.removeItem("kpiUrl");
      } catch (error) {
        console.warn("OfficeRuntime.storage clear failed for kpiUrl:", error);
      }
      setKpiUrl(null);
    } catch (error) {
      console.error("Error clearing kpiUrl:", error);
      throw new Error("Failed to clear kpiUrl");
    }
  };

  const value: AuthContextType = {
    token,
    kpiUrl,
    saveToken,
    clearToken,
    saveKpiUrl,
    clearKpiUrl,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useStoredToken() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useStoredToken must be used within an AuthProvider");
  }
  return context;
}
