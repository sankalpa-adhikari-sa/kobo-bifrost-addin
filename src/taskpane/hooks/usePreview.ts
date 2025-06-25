import { useMutation } from "@tanstack/react-query";
import { useStoredToken } from "./useStoredToken";
import axios from "axios";

const getAssetSnapshots = async (
  baseUrl: string,
  token: string,
  payload: {
    asset: string;
  }
) => {
  const response = await axios.post(
    `http://localhost:5000/api/v2/asset_snapshots/?server=${encodeURIComponent(baseUrl)}`,
    payload,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetAssetSnapshots = () => {
  const { token, kpiUrl } = useStoredToken();

  return useMutation({
    mutationFn: (payload: { asset: string }) => {
      if (!token || !kpiUrl) {
        throw new Error("Missing authentication credentials");
      }
      return getAssetSnapshots(kpiUrl, token, payload);
    },
  });
};
