import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useStoredToken } from "./useStoredToken";

const deleteMedia = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  snapshotUid: string
) => {
  const response = await axios.delete(
    `http://localhost:5000/api/v2/assets/${assetUid}/files/${snapshotUid}/?server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const useDeleteMedia = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assetUid, snapshotUid }: { assetUid: string; snapshotUid: string }) =>
      deleteMedia(kpiUrl!, token!, assetUid, snapshotUid),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["media", kpiUrl, token, variables.assetUid],
      });
    },
  });
};

const getMedia = async (baseUrl: string, token: string, assetUid: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/v2/assets/${assetUid}/files/?file_type=form_media&server=${encodeURIComponent(baseUrl)}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch media files:", error);
    throw error;
  }
};

export const useMedia = (assetUid: string) => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["media", kpiUrl, token, assetUid],
    queryFn: () => getMedia(kpiUrl!, token!, assetUid),
    enabled: !!kpiUrl && !!token && !isAuthLoading,
  });
};

const importMediaFromFile = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  payload: {
    file: Base64URLString;
    description: string;
    file_type: string;
    filename: string;
  }
) => {
  const formData = new FormData();
  formData.append("description", payload.description);
  formData.append("base64Encoded", payload.file);
  formData.append("file_type", payload.file_type);
  formData.append("metadata", JSON.stringify({ filename: payload.filename }));

  const response = await axios.post(
    `http://localhost:5000/api/v2/assets/${assetUid}/files/?server=${encodeURIComponent(baseUrl)}`,
    formData,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const useImportMediaFromFile = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assetUid,
      payload,
    }: {
      assetUid: string;
      payload: {
        file: Base64URLString;
        description: string;
        file_type: string;
        filename: string;
      };
    }) => importMediaFromFile(kpiUrl!, token!, assetUid, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["media", kpiUrl, token, variables.assetUid],
      });
    },
    onError: (error, variables) => {
      console.error(`Failed to upload media for asset ${variables.assetUid}:`, error);
    },
  });
};
