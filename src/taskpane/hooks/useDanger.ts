import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useStoredToken } from "./useStoredToken";

const deleteAsset = async (baseUrl: string, token: string, assetUid: string) => {
  const response = await axios.delete(
    `http://localhost:5000/api/v2/assets/${assetUid}?format=json&server=${encodeURIComponent(baseUrl)}`,

    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const useDeleteAsset = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assetUid: string) => deleteAsset(kpiUrl!, token!, assetUid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
};

const archiveAsset = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  payload: { active: boolean }
) => {
  const response = await axios.patch(
    `http://localhost:5000/api/v2/assets/${assetUid}/deployment/?format=json&server=${encodeURIComponent(baseUrl)}`,
    payload,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const useArchiveAsset = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assetUid, payload }: { assetUid: string; payload: { active: boolean } }) =>
      archiveAsset(kpiUrl!, token!, assetUid, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assets", kpiUrl, token] });
      queryClient.invalidateQueries({
        queryKey: ["assets", kpiUrl, token, variables.assetUid || data.asset.uid],
      });
    },
  });
};
