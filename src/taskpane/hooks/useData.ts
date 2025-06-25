import axios from "axios";
import { useStoredToken } from "./useStoredToken";
import { useQuery } from "@tanstack/react-query";

const fetchSubmissionCounts = async (baseUrl: string, token: string, assetUid: string) => {
  const response = await axios.get(
    `http://localhost:5000//api/v2/assets/${assetUid}/counts/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        days: 7,
      },
    }
  );
  return response.data;
};
export const fetchSubmissionData = async (baseUrl: string, token: string, assetUid: string) => {
  const response = await axios.get(
    `http://localhost:5000//api/v2/assets/${assetUid}/data/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        limit: 100,
      },
    }
  );
  return response.data;
};

export const duplicateData = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  dataUid: string
) => {
  const response = await axios.post(
    `http://localhost:5000//api/v2/assets/${assetUid}/data/${dataUid}/duplicate/?server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};
export const deleteData = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  dataUid: string
) => {
  const response = await axios.delete(
    `http://localhost:5000//api/v2/assets/${assetUid}/data/${dataUid}/?server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const bulkDeleteData = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  submissionIds: string[]
) => {
  const response = await axios.patch(
    `http://localhost:5000//api/v2/assets/${assetUid}/data/bulk/?server=${encodeURIComponent(baseUrl)}`,
    {
      payload: {
        submission_ids: submissionIds,
      },
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const useSubmissionCounts = ({ assetUid }: { assetUid: string }) => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["asset_submission_count", kpiUrl, token, assetUid],
    queryFn: () => fetchSubmissionCounts(kpiUrl!, token!, assetUid),
    enabled: !!kpiUrl && !!token && !isAuthLoading,
  });
};

export enum ValidationStatusUid {
  APPROVED = "validation_status_approved",
  NOT_APPROVED = "validation_status_not_approved",
  ON_HOLD = "validation_status_on_hold",
}

export const updateValidationStatus = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  dataUid: string,
  validation_status: ValidationStatusUid
) => {
  const response = await axios.patch(
    `http://localhost:5000//api/v2/assets/${assetUid}/data/${dataUid}/validation_status/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      "validation_status.uid": validation_status,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const bulkUpdateValidationStatus = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  submissionIds: string[],
  validation_status: ValidationStatusUid
) => {
  const response = await axios.patch(
    `http://localhost:5000//api/v2/assets/${assetUid}/data/validation_status/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      payload: {
        submission_ids: submissionIds,
        "validation_status.uid": validation_status,
      },
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteValidationStatus = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  dataUid: string
) => {
  const response = await axios.delete(
    `http://localhost:5000//api/v2/assets/${assetUid}/data/${dataUid}/validation_status/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};
