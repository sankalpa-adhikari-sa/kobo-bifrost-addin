import axios from "axios";
import { useStoredToken } from "./useStoredToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchActivity = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  limit: number = 10,
  offset: number = 0,
  q: string = "NOT action:'add-submission'"
) => {
  const response = await axios.get(
    `http://localhost:5000/api/v2/assets/${assetUid}/history/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        limit: limit,
        offset: offset,
        q: q,
      },
    }
  );
  return response.data;
};

export const useActivity = ({
  assetUid,
  limit,
  offset,
  q,
}: {
  assetUid: string;
  limit?: number;
  offset?: number;
  q?: string;
}) => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["asset_activity", kpiUrl, token, assetUid, limit, offset, q],
    queryFn: () => fetchActivity(kpiUrl!, token!, assetUid, limit, offset, q),
    enabled: !!kpiUrl && !!token && !isAuthLoading,
  });
};

const fetchActions = async (baseUrl: string, token: string, assetUid: string) => {
  const response = await axios.get(
    `http://localhost:5000/api/v2/assets/${assetUid}/history/actions/?format=json&server=${encodeURIComponent(baseUrl)}`,
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
    `http://localhost:5000/api/v2/assets/${assetUid}/history/export/?format=json&server=${encodeURIComponent(baseUrl)}`,
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
