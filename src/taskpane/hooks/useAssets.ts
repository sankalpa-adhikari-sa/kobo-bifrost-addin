import { useQuery } from "@tanstack/react-query";
import { useStoredToken } from "./useStoredToken";
import axios from "axios";

const fetchAssets = async (baseUrl: string, token: string) => {
  const response = await axios.get(
    `http://localhost:5000/api/v2/assets/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const useAssets = () => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["assets", kpiUrl, token],
    queryFn: () => fetchAssets(kpiUrl!, token!),
    enabled: !!kpiUrl && !!token && !isAuthLoading,
  });
};
