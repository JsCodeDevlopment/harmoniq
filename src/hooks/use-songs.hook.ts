"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Song {
  title: string;
  artist: string;
  url: string;
  key: string;
  content: string;
  chords: string[];
  simplified_url?: string;
  principal_url?: string;
  keyboard_url?: string;
  recommendations: {
    title: string;
    artist: string;
    url: string;
    image?: string;
  }[];
}


export function useSearchSongs(query: string) {
  return useQuery<Song[]>({
    queryKey: ["songs", "search", query],
    queryFn: async () => {
      if (!query) return [];
      const response = await api.get(`/songs/search`, { 
        params: { q: query } 
      });
      return response.data;
    },
    enabled: !!query,
  });
}

export function useGetSong(url: string) {
  return useQuery<Song | null>({
    queryKey: ["song", url],
    queryFn: async () => {
      if (!url) return null;
      const response = await api.get(`/songs/song`, { 
        params: { url } 
      });
      return response.data;
    },
    enabled: !!url,
  });
}
