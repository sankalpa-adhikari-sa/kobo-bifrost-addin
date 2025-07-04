import axios from "axios";
import { useStoredToken } from "./AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchPermissionAssignments = async (baseUrl: string, token: string, assetUid: string) => {
  const response = await axios.get(
    `http://localhost:5000/api/v2/assets/${assetUid}/permission-assignments/`,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        server: baseUrl,
        format: "json",
      },
    }
  );
  return response.data;
};

export const usePermissionAssignments = (assetUid: string) => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["assets-permission", kpiUrl, token, assetUid],
    queryFn: () => fetchPermissionAssignments(kpiUrl!, token!, assetUid),
    enabled: !!kpiUrl && !!token && !isAuthLoading,
  });
};

const deletePermissionAssignment = async (token: string, permissionUrl: string) => {
  const url = new URL(permissionUrl);
  const server = `${url.protocol}//${url.host}`;
  const path = url.pathname;

  const response = await axios.delete(`http://localhost:5000${path}`, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    params: {
      server: server,
      format: "json",
    },
  });
  return response.data;
};

export const useDeleteAnonymousSubmissionPermission = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();
  return useMutation({
    // @ts-ignore
    mutationFn: ({ permissionUrl, assetUid }: { permissionUrl: string; assetUid: string }) =>
      deletePermissionAssignment(token!, permissionUrl),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assets-permission", kpiUrl, token, variables.assetUid],
      });
    },
  });
};

const addAnonymousSubmissionPermission = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  payload: {
    permission: string;
    user: string;
  }
) => {
  const response = await axios.post(
    `http://localhost:5000/api/v2/assets/${assetUid}/permission-assignments/`,
    payload,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        server: baseUrl,
        format: "json",
      },
    }
  );
  return response.data;
};

export const useAddAnonymousSubmissionPermission = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      assetUid,
    }: {
      payload: {
        permission: string;
        user: string;
      };
      assetUid: string;
    }) => addAnonymousSubmissionPermission(kpiUrl!, token!, assetUid, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assets-permission", kpiUrl, token, variables.assetUid],
      });
    },
  });
};
