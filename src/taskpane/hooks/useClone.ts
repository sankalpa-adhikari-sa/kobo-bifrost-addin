import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStoredToken } from "./useStoredToken";
import axios from "axios";

const cloneAsset = async (
  baseUrl: string,
  token: string,
  payload: { clone_from: string; name: string; clone_from_version_id?: string }
) => {
  const response = await axios.post(
    `http://localhost:5000/api/v2/assets/?format=json&server=${encodeURIComponent(baseUrl)}`,
    payload,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const useCloneAsset = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { clone_from: string; name: string; clone_from_version_id?: string }) =>
      cloneAsset(kpiUrl!, token!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", kpiUrl, token] });
    },
  });
};
