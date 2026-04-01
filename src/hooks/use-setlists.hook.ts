"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface SetlistItem {
  id: number;
  setlist_id: number;
  title: string;
  artist: string;
  url: string;
  key: string;
  order: number;
  chord_variations?: string;
}

export interface Setlist {
  id: number;
  title: string;
  user_id: number;
  public_id: string;
  is_public: boolean;
  songs: SetlistItem[];
}

export function useSetlists() {
  const queryClient = useQueryClient();

  const { data: setlists = [], isLoading } = useQuery<Setlist[]>({
    queryKey: ["setlists"],
    queryFn: async () => {
      const response = await api.get("/setlists");
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await api.post("/setlists", { title });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setlists"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/setlists/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setlists"] });
    },
  });

  const addSongMutation = useMutation({
    mutationFn: async ({ setlistId, song }: { setlistId: number; song: Omit<SetlistItem, 'id' | 'setlist_id' | 'order'> }) => {
      const response = await api.post(`/setlists/${setlistId}/songs`, song);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setlists"] });
    },
  });

  return { 
    setlists, 
    isLoading, 
    createSetlist: createMutation.mutateAsync, 
    deleteSetlist: deleteMutation.mutateAsync,
    addSongToSetlist: addSongMutation.mutateAsync
  };
}

export function useSetlist(id: string | number) {
  const queryClient = useQueryClient();

  const { data: setlist = null, isLoading } = useQuery<Setlist | null>({
    queryKey: ["setlist", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/setlists/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const addSongMutation = useMutation({
    mutationFn: async (song: Omit<SetlistItem, 'id' | 'setlist_id'>) => {
      const response = await api.post(`/setlists/${id}/songs`, song);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setlist", id] });
    },
  });

  const removeSongMutation = useMutation({
    mutationFn: async (songId: number) => {
      await api.delete(`/setlists/${id}/songs/${songId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setlist", id] });
    },
  });

  const togglePublicMutation = useMutation({
    mutationFn: async () => {
      if (!setlist) return;
      const response = await api.put(`/setlists/${id}`, { 
        title: setlist.title, 
        is_public: !setlist.is_public 
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setlist", id] });
      queryClient.invalidateQueries({ queryKey: ["setlists"] });
    },
  });

  const renameMutation = useMutation({
    mutationFn: async (newTitle: string) => {
      if (!setlist) return;
      const response = await api.put(`/setlists/${id}`, { 
        title: newTitle, 
        is_public: setlist.is_public 
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setlist", id] });
      queryClient.invalidateQueries({ queryKey: ["setlists"] });
    },
  });

  const updateSongMutation = useMutation({
    mutationFn: async ({ songId, key, chord_variations }: { songId: number, key: string, chord_variations: string }) => {
      const response = await api.patch(`/setlists/${id}/songs/${songId}`, { key, chord_variations });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setlist", id] });
    },
  });

  return { 
    setlist, 
    isLoading, 
    addSong: addSongMutation.mutateAsync, 
    removeSong: removeSongMutation.mutateAsync, 
    togglePublic: togglePublicMutation.mutateAsync,
    renameSetlist: renameMutation.mutateAsync,
    updateSong: updateSongMutation.mutateAsync
  };
}

export function useSharedSetlist(publicId: string) {
  return useQuery<Setlist | null>({
    queryKey: ["shared-setlist", publicId],
    queryFn: async () => {
      if (!publicId) return null;
      const response = await api.get(`/setlists/shared/${publicId}`);
      return response.data;
    },
    enabled: !!publicId,
  });
}
