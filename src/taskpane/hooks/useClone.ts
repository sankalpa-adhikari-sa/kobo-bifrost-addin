import { useMutation } from "@tanstack/react-query";
import { useStoredToken } from "./useStoredToken";
import axios from "axios";

const cloneAsset = async (
  baseUrl: string,
  token: string,
  payload: { clone_from: boolean; name: string }
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

  return useMutation({
    mutationFn: (payload: { clone_from: boolean; name: string }) =>
      cloneAsset(kpiUrl!, token!, payload),
  });
};
