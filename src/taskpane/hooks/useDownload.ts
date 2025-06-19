import { useMutation } from "@tanstack/react-query";
import { useStoredToken } from "./useStoredToken";
import axios from "axios";

// Fix: Use GET request for XLS download
const downloadXlsForm = async (baseUrl: string, token: string, assetUid: string) => {
  const response = await axios.get(
    `http://localhost:5000/api/v2/assets/${assetUid}.xls/?server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
      responseType: "blob",
    }
  );
  return response.data;
};

// Fix: Use GET request for XML download
const downloadXmlForm = async (baseUrl: string, token: string, assetUid: string) => {
  const response = await axios.get(
    `http://localhost:5000/api/v2/assets/${assetUid}.xml/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
      responseType: "blob",
    }
  );
  return response.data;
};

export const useDownloadXlsForm = () => {
  const { token, kpiUrl } = useStoredToken();

  return useMutation({
    mutationFn: (assetUid: string) => {
      if (!token || !kpiUrl) {
        throw new Error("Missing authentication credentials");
      }
      return downloadXlsForm(kpiUrl, token, assetUid);
    },
    onError: (error) => {
      console.error("XLS Download mutation error:", error);
    },
  });
};

export const useDownloadXmlForm = () => {
  const { token, kpiUrl } = useStoredToken();

  return useMutation({
    mutationFn: (assetUid: string) => {
      if (!token || !kpiUrl) {
        throw new Error("Missing authentication credentials");
      }
      return downloadXmlForm(kpiUrl, token, assetUid);
    },
    onError: (error) => {
      console.error("XML Download mutation error:", error);
    },
  });
};
