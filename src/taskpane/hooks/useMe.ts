import { useQuery } from "@tanstack/react-query";
import { useStoredToken } from "./useStoredToken";
import axios from "axios";

const getOwner = async (baseUrl: string, token: string) => {
  const response = await axios.get(
    `http://localhost:5000/me/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetOwner = () => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["owner", kpiUrl, token],
    queryFn: () => getOwner(kpiUrl!, token!),
    enabled: !!kpiUrl && !!token && !isAuthLoading,
  });
};
