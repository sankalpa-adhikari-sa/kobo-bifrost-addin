import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStoredToken } from "./useStoredToken";
import axios from "axios";
import { EmptySurveyAssetFormData, ProjectMetadataFormData } from "../../validators/schema";

const fetchAssets = async (baseUrl: string, token: string) => {
  const response = await axios.get(
    `http://localhost:5000/api/v2/assets/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const fetchAssetsById = async (baseUrl: string, token: string, assetUid: string) => {
  const response = await axios.get(
    `http://localhost:5000/api/v2/assets/${assetUid}/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const createEmptyAsset = async (
  baseUrl: string,
  token: string,
  payload: {
    asset_type: string;
  }
) => {
  const response = await axios.post(
    `http://localhost:5000/api/v2/assets/?format=json&server=${encodeURIComponent(baseUrl)}`,
    payload,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const bulkAssetAction = async (
  baseUrl: string,
  token: string,
  payload: {
    payload: {
      asset_uids: string[];
      action: string;
    };
  }
) => {
  const response = await axios.post(
    `http://localhost:5000/api/v2/assets/bulk/?server=${encodeURIComponent(baseUrl)}`,
    payload,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export const useBulkAssetAction = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      payload: {
        asset_uids: string[];
        action: string;
      };
    }) => bulkAssetAction(kpiUrl!, token!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
};

const createEmptySurveyAsset = async (
  baseUrl: string,
  token: string,
  payload: EmptySurveyAssetFormData
) => {
  const response = await axios.post(
    `http://localhost:5000/api/v2/assets/?format=json&server=${encodeURIComponent(baseUrl)}`,
    payload,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const updateProjectMetadata = async (
  baseUrl: string,
  token: string,
  assetUid: string,
  payload: ProjectMetadataFormData
) => {
  const response = await axios.patch(
    `http://localhost:5000/api/v2/assets/${assetUid}/?format=json&server=${encodeURIComponent(baseUrl)}`,
    payload,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const importSurveyAssetFromFile = async (
  baseUrl: string,
  token: string,
  payload: {
    file: File;
    destination: string;
    assetUid: string;
    name?: string;
  }
) => {
  const formData = new FormData();
  formData.append("destination", payload.destination);
  formData.append("file", payload.file);
  formData.append("assetUid", payload.assetUid);
  payload.name && formData.append("name", payload.name);

  const response = await axios.post(
    `http://localhost:5000/api/v2/imports/?format=json&server=${encodeURIComponent(baseUrl)}`,
    formData,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(response.data);
  return response.data;
};

const importSurveyAssetFromUrl = async (
  baseUrl: string,
  token: string,
  payload: {
    url: string;
    destination: string;
    assetUid: string;
    name?: string;
  }
) => {
  const formData = new FormData();
  formData.append("destination", payload.destination);
  formData.append("url", payload.url);
  formData.append("assetUid", payload.assetUid);
  payload.name && formData.append("name", payload.name);

  const response = await axios.post(
    `http://localhost:5000/api/v2/imports/?format=json&server=${encodeURIComponent(baseUrl)}`,
    formData,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(response.data);
  return response.data;
};

const checkImportStatus = async (baseUrl: string, token: string, importId: string) => {
  const response = await axios.get(
    `http://localhost:5000/api/v2/imports/${importId}/?format=json&server=${encodeURIComponent(baseUrl)}`,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const useAssets = () => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["assets", kpiUrl, token],
    queryFn: () => fetchAssets(kpiUrl!, token!),
    enabled: !!kpiUrl && !!token && !isAuthLoading,
  });
};

export const useAssetsById = (assetUid: string) => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["assets", kpiUrl, token, assetUid],
    queryFn: () => fetchAssetsById(kpiUrl!, token!, assetUid),
    enabled: !!kpiUrl && !!token && !isAuthLoading && !!assetUid,
  });
};

export const useCheckImportStatus = (importId: string) => {
  const { token, kpiUrl, isLoading: isAuthLoading } = useStoredToken();

  return useQuery({
    queryKey: ["importStatus", kpiUrl, token, importId],
    queryFn: () => checkImportStatus(kpiUrl!, token!, importId),
    enabled: !!kpiUrl && !!token && !isAuthLoading,
  });
};
export const useCreateEmptyAsset = () => {
  const { token, kpiUrl } = useStoredToken();

  return useMutation({
    mutationFn: (payload: { asset_type: string }) => createEmptyAsset(kpiUrl!, token!, payload),
  });
};

export const useCreateEmptySurveyAsset = () => {
  const { token, kpiUrl } = useStoredToken();

  return useMutation({
    mutationFn: (payload: EmptySurveyAssetFormData) =>
      createEmptySurveyAsset(kpiUrl!, token!, payload),
  });
};

export const useUpdateProjectMetadata = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assetUid, payload }: { assetUid: string; payload: ProjectMetadataFormData }) =>
      updateProjectMetadata(kpiUrl!, token!, assetUid, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assets", , kpiUrl, token, variables.assetUid] });
    },
  });
};

export const useImportSurveyAssetFromFile = () => {
  const { token, kpiUrl } = useStoredToken();

  return useMutation({
    mutationFn: (payload: { file: File; destination: string; assetUid: string; name?: string }) =>
      importSurveyAssetFromFile(kpiUrl!, token!, payload),
  });
};

export const useImportSurveyAssetFromUrl = () => {
  const { token, kpiUrl } = useStoredToken();

  return useMutation({
    mutationFn: (payload: { url: string; destination: string; assetUid: string; name?: string }) =>
      importSurveyAssetFromUrl(kpiUrl!, token!, payload),
  });
};

export interface ProjectCreationStep {
  step: "asset_creation" | "file_import" | "status_check";
  message: string;
  completed: boolean;
}

export interface ProjectCreationError extends Error {
  step: ProjectCreationStep["step"];
  originalError?: Error;
  details?: Record<string, any>;
}

export interface ProjectCreationProgress {
  currentStep: ProjectCreationStep["step"];
  steps: ProjectCreationStep[];
  progress: number;
}

export interface CreateProjectResult {
  asset: any;
  importResult: any;
  progress: ProjectCreationProgress;
}

const createProjectCreationError = (
  step: ProjectCreationStep["step"],
  message: string,
  originalError?: Error,
  details?: Record<string, any>
): ProjectCreationError => {
  const error = new Error(message) as ProjectCreationError;
  error.step = step;
  error.originalError = originalError;
  error.details = details;
  return error;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useCreateProjectFromFile = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      file: File;
      name?: string;
      asset_type?: string;
      onProgress?: (progress: ProjectCreationProgress) => void;
      assetUid?: string;
      destination?: string;
    }) => {
      const isAssetProvided = !!(payload.assetUid && payload.destination);
      console.log(isAssetProvided);

      const steps: ProjectCreationStep[] = [
        {
          step: "asset_creation",
          message: isAssetProvided
            ? "Using existing project asset..."
            : "Creating project asset...",
          completed: isAssetProvided,
        },
        { step: "file_import", message: "Importing file...", completed: false },
        {
          step: "status_check",
          message: "Processing and validating...",
          completed: false,
        },
      ];

      const updateProgress = (currentStep: ProjectCreationStep["step"], stepCompleted = false) => {
        const stepIndex = steps.findIndex((s) => s.step === currentStep);
        if (stepIndex !== -1) {
          steps[stepIndex].completed = stepCompleted;
        }

        for (let i = 0; i < stepIndex; i++) {
          steps[i].completed = true;
        }

        const completedSteps = steps.filter((s) => s.completed).length;
        const progress = Math.round((completedSteps / steps.length) * 100);

        const progressUpdate: ProjectCreationProgress = {
          currentStep,
          steps: [...steps],
          progress,
        };

        payload.onProgress?.(progressUpdate);
      };

      try {
        if (!kpiUrl || !token) {
          throw createProjectCreationError(
            "asset_creation",
            "Authentication credentials are missing. Please ensure you are logged in.",
            undefined,
            { hasKpiUrl: !!kpiUrl, hasToken: !!token }
          );
        }

        if (!payload.file) {
          throw createProjectCreationError(
            "asset_creation",
            "No file provided for project creation.",
            undefined
          );
        }

        let asset: { url: string; uid: string };

        updateProgress("asset_creation");

        if (isAssetProvided) {
          asset = {
            url: payload.destination!,
            uid: payload.assetUid!,
          };
          updateProgress("asset_creation", true);
        } else {
          if (!payload.asset_type) {
            throw createProjectCreationError(
              "asset_creation",
              "An 'asset_type' is required to create a new project."
            );
          }
          try {
            const newAsset = await createEmptyAsset(kpiUrl, token, {
              asset_type: payload.asset_type,
            });

            if (!newAsset?.url || !newAsset?.uid) {
              throw new Error("Invalid asset response: missing URL or UID");
            }
            asset = newAsset;
            updateProgress("asset_creation", true);
          } catch (error) {
            throw createProjectCreationError(
              "asset_creation",
              `Failed to create project asset: ${(error as Error).message}`,
              error as Error,
              {
                asset_type: payload.asset_type,
                kpiUrl: kpiUrl?.substring(0, 50) + "...",
              }
            );
          }
        }

        updateProgress("file_import");
        let importResult;
        try {
          importResult = await importSurveyAssetFromFile(kpiUrl, token, {
            file: payload.file,
            destination: asset.url,
            assetUid: asset.uid,
            name: payload.name,
          });

          if (!importResult?.uid) {
            throw new Error("Invalid import response: missing import UID");
          }

          updateProgress("file_import", true);
        } catch (error) {
          throw createProjectCreationError(
            "file_import",
            `Failed to import file: ${(error as Error).message}`,
            error as Error,
            {
              fileName: payload.file.name,
              fileSize: payload.file.size,
              assetUid: asset.uid,
              destination: asset.url,
            }
          );
        }

        updateProgress("status_check");
        try {
          const importId = importResult.uid;
          let status = importResult.status;
          const maxRetries = 4;
          const retryDelay = 2000;

          if (status === "processing") {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
              await delay(retryDelay);

              try {
                const statusResult = await checkImportStatus(kpiUrl, token, importId);
                status = statusResult.status;

                if (status === "complete") break;
                if (status === "error")
                  throw new Error(`Import processing failed with error status`);
                if (attempt === maxRetries && status === "processing") {
                  console.log(statusResult);
                  throw new Error(
                    `Import timed out after ${maxRetries} attempts (${
                      (maxRetries * retryDelay) / 1000
                    }s)`
                  );
                }
              } catch (statusError) {
                if (attempt === maxRetries) throw statusError;
              }
            }
          }

          if (status !== "complete") {
            throw new Error(`Import completed with unexpected status: ${status}`);
          }

          updateProgress("status_check", true);

          return {
            asset,
            importResult,
            progress: {
              currentStep: "status_check" as const,
              steps,
              progress: 100,
            },
          };
        } catch (error) {
          throw createProjectCreationError(
            "status_check",
            `Failed to process import: ${(error as Error).message}`,
            error as Error,
            {
              importId: importResult.uid,
              initialStatus: importResult.status,
            }
          );
        }
      } catch (error) {
        if ((error as ProjectCreationError).step) {
          throw error;
        }

        throw createProjectCreationError(
          "asset_creation",
          `Unexpected error during project creation: ${(error as Error).message}`,
          error as Error
        );
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assets", kpiUrl, token, variables.assetUid || data.asset.uid],
      });
    },
  });
};

export const useCreateProjectFromUrl = () => {
  const { token, kpiUrl } = useStoredToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      form_url: string;
      name?: string;
      asset_type?: string;
      onProgress?: (progress: ProjectCreationProgress) => void;
      assetUid?: string;
      destination?: string;
    }) => {
      const isAssetProvided = !!(payload.assetUid && payload.destination);
      console.log(isAssetProvided);

      const steps: ProjectCreationStep[] = [
        {
          step: "asset_creation",
          message: isAssetProvided
            ? "Using existing project asset..."
            : "Creating project asset...",
          completed: isAssetProvided,
        },
        { step: "file_import", message: "Importing URl...", completed: false },
        {
          step: "status_check",
          message: "Processing and validating URL...",
          completed: false,
        },
      ];

      const updateProgress = (currentStep: ProjectCreationStep["step"], stepCompleted = false) => {
        const stepIndex = steps.findIndex((s) => s.step === currentStep);
        if (stepIndex !== -1) {
          steps[stepIndex].completed = stepCompleted;
        }

        for (let i = 0; i < stepIndex; i++) {
          steps[i].completed = true;
        }

        const completedSteps = steps.filter((s) => s.completed).length;
        const progress = Math.round((completedSteps / steps.length) * 100);

        const progressUpdate: ProjectCreationProgress = {
          currentStep,
          steps: [...steps],
          progress,
        };

        payload.onProgress?.(progressUpdate);
      };

      try {
        if (!kpiUrl || !token) {
          throw createProjectCreationError(
            "asset_creation",
            "Authentication credentials are missing. Please ensure you are logged in.",
            undefined,
            { hasKpiUrl: !!kpiUrl, hasToken: !!token }
          );
        }

        if (!payload.form_url) {
          throw createProjectCreationError(
            "asset_creation",
            "No Xlsform URL provided for project creation.",
            undefined
          );
        }

        let asset: { url: string; uid: string };

        updateProgress("asset_creation");

        if (isAssetProvided) {
          asset = {
            url: payload.destination!,
            uid: payload.assetUid!,
          };
          updateProgress("asset_creation", true);
        } else {
          if (!payload.asset_type) {
            throw createProjectCreationError(
              "asset_creation",
              "An 'asset_type' is required to create a new project."
            );
          }
          try {
            const newAsset = await createEmptyAsset(kpiUrl, token, {
              asset_type: payload.asset_type,
            });

            if (!newAsset?.url || !newAsset?.uid) {
              throw new Error("Invalid asset response: missing URL or UID");
            }
            asset = newAsset;
            updateProgress("asset_creation", true);
          } catch (error) {
            throw createProjectCreationError(
              "asset_creation",
              `Failed to create project asset: ${(error as Error).message}`,
              error as Error,
              {
                asset_type: payload.asset_type,
                kpiUrl: kpiUrl?.substring(0, 50) + "...",
              }
            );
          }
        }

        updateProgress("file_import");
        let importResult;
        try {
          importResult = await importSurveyAssetFromUrl(kpiUrl, token, {
            url: payload.form_url,
            destination: asset.url,
            assetUid: asset.uid,
            name: payload.name,
          });

          if (!importResult?.uid) {
            throw new Error("Invalid import response: missing import UID");
          }

          updateProgress("file_import", true);
        } catch (error) {
          throw createProjectCreationError(
            "file_import",
            `Failed to import file through url: ${(error as Error).message}`,
            error as Error,
            {
              formUrl: payload.form_url,
              assetUid: asset.uid,
              destination: asset.url,
            }
          );
        }

        updateProgress("status_check");
        try {
          const importId = importResult.uid;
          let status = importResult.status;
          const maxRetries = 4;
          const retryDelay = 2000;

          if (status === "processing") {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
              await delay(retryDelay);

              try {
                const statusResult = await checkImportStatus(kpiUrl, token, importId);
                status = statusResult.status;

                if (status === "complete") break;
                if (status === "error")
                  throw new Error(`Import processing failed with error status`);
                if (attempt === maxRetries && status === "processing") {
                  console.log(statusResult);
                  throw new Error(
                    `Import timed out after ${maxRetries} attempts (${
                      (maxRetries * retryDelay) / 1000
                    }s)`
                  );
                }
              } catch (statusError) {
                if (attempt === maxRetries) throw statusError;
              }
            }
          }

          if (status !== "complete") {
            throw new Error(`Import completed with unexpected status: ${status}`);
          }

          updateProgress("status_check", true);

          return {
            asset,
            importResult,
            progress: {
              currentStep: "status_check" as const,
              steps,
              progress: 100,
            },
          };
        } catch (error) {
          throw createProjectCreationError(
            "status_check",
            `Failed to process import: ${(error as Error).message}`,
            error as Error,
            {
              importId: importResult.uid,
              initialStatus: importResult.status,
            }
          );
        }
      } catch (error) {
        if ((error as ProjectCreationError).step) {
          throw error;
        }

        throw createProjectCreationError(
          "asset_creation",
          `Unexpected error during project creation: ${(error as Error).message}`,
          error as Error
        );
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assets", kpiUrl, token, variables.assetUid || data.asset.uid],
      });
    },
  });
};
