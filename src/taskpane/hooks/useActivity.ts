import axios from "axios";
import { useStoredToken } from "./useStoredToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchActivity = async (baseUrl: string, token: string, assetUid: string) => {
  const response = await axios.get(
    `http://localhost:5000//api/v2/assets/${assetUid}/history/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        limit: 100,
        offset: 0,
        q: "NOT action:'add-submission'",
      },
    }
  );
  return response.data;
};

export const useActivity = ({ assetUid }: { assetUid: string }) => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["asset_activity", kpiUrl, token, assetUid],
    queryFn: () => fetchActivity(kpiUrl!, token!, assetUid),
    enabled: !!kpiUrl && !!token && !isAuthLoading,
  });
};

const fetchActions = async (baseUrl: string, token: string, assetUid: string) => {
  const response = await axios.get(
    `http://localhost:5000//api/v2/assets/${assetUid}/history/actions/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const useActions = ({ assetUid }: { assetUid: string }) => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["asset_actions", kpiUrl, token, assetUid],
    queryFn: () => fetchActions(kpiUrl!, token!, assetUid),
    enabled: !!kpiUrl && !!token && !isAuthLoading,
  });
};

const exportActivity = async (baseUrl: string, token: string, assetUid: string) => {
  const response = await axios.post(
    `http://localhost:5000//api/v2/assets/${assetUid}/history/export/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      notifyAboutError: false,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const useExportActivity = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assetUid }: { assetUid: string }) => exportActivity(kpiUrl!, token!, assetUid),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["export_activity", kpiUrl, token, variables.assetUid],
      });
    },
  });
};
