import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

export interface SiteWithId {
  id: bigint;
  name: string;
  blobId: ExternalBlob;
}

export function useGetAllSites() {
  const { actor, isFetching } = useActor();
  return useQuery<SiteWithId[]>({
    queryKey: ["sites"],
    queryFn: async () => {
      if (!actor) return [];
      const sites = await actor.getCallerSitesWithIds();
      return sites.map((site) => ({
        id: site.id,
        name: site.name,
        blobId: site.blobId,
      }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      blob,
      onProgress,
    }: {
      name: string;
      blob: ExternalBlob;
      onProgress: (p: number) => void;
    }) => {
      if (!actor) throw new Error("Not connected");
      const blobWithProgress = blob.withUploadProgress(onProgress);
      return actor.addSite(name, blobWithProgress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });
}

export function useDeleteSite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (siteId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteSite(siteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });
}

export function useGetSiteFile() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (siteId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.getSiteFile(siteId);
    },
  });
}
