import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStoredToken } from "./useStoredToken";
import axios from "axios";
import { ProfileFormData } from "../../validators/schema";

const fetchOwner = async (baseUrl: string, token: string) => {
  const response = await axios.get(
    `http://localhost:5000/me/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetOwner = () => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["owner", kpiUrl, token],
    queryFn: () => fetchOwner(kpiUrl!, token!),
    enabled: !!kpiUrl && !!token && !isAuthLoading,
  });
};

const patchProfile = async (baseUrl: string, token: string, payload: ProfileFormData) => {
  const response = await axios.patch(
    `http://localhost:5000/me/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      extra_details: payload,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const useUpdateProfile = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload }: { payload: ProfileFormData }) =>
      patchProfile(kpiUrl!, token!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["owner", kpiUrl, token],
      });
    },
  });
};

const fetchOrganization = async (baseUrl: string, token: string, organizationUid: string) => {
  const response = await axios.get(
    `http://localhost:5000/v2/organizations/${organizationUid}/?format=json&server=${encodeURIComponent(baseUrl)}`,

    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetOrganization = (organizationUid: string | undefined) => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["organization", kpiUrl, token, organizationUid],
    queryFn: () => fetchOrganization(kpiUrl!, token!, organizationUid!),
    enabled: !!kpiUrl && !!token && !!organizationUid && !isAuthLoading,
  });
};

const fetchOrganizationServiceUsage = async (
  baseUrl: string,
  token: string,
  organizationUid: string
) => {
  const response = await axios.get(
    `http://localhost:5000/v2/organizations/${organizationUid}/service_usage/?format=json&server=${encodeURIComponent(baseUrl)}`,

    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetOrganizationServiceUsage = (organizationUid: string | undefined) => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["organization_service_usage", kpiUrl, token, organizationUid],
    queryFn: () => fetchOrganizationServiceUsage(kpiUrl!, token!, organizationUid!),
    enabled: !!kpiUrl && !!token && !!organizationUid && !isAuthLoading,
  });
};
