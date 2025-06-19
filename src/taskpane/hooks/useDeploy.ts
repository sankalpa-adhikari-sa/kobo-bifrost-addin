import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStoredToken } from "./useStoredToken";
import axios from "axios";

const deployForm = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  payload: { active: boolean }
) => {
  const response = await axios.post(
    `http://localhost:5000/api/v2/assets/${assetUid}/deployment/?format=json&server=${encodeURIComponent(baseUrl)}`,
    payload,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const useDeployForm = () => {
  const { token, kpiUrl } = useStoredToken();

  return useMutation({
    mutationFn: ({ assetUid, payload }: { assetUid: string; payload: { active: boolean } }) =>
      deployForm(kpiUrl!, token!, assetUid, payload),
  });
};

const redeployForm = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  payload: { active: boolean; version_id: string }
) => {
  const response = await axios.patch(
    `http://localhost:5000/api/v2/assets/${assetUid}/deployment/?format=json&server=${encodeURIComponent(baseUrl)}`,
    payload,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const useRedeployForm = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assetUid,
      payload,
    }: {
      assetUid: string;
      payload: { active: boolean; version_id: string };
    }) => redeployForm(kpiUrl!, token!, assetUid, payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assets", kpiUrl, token, variables.assetUid],
      });
    },
  });
};
