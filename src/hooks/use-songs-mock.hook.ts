import { MOCK_SONGS } from "@/mocks/songs.data";
import { useState, useEffect } from "react";

export interface Song {
  title: string;
  artist: string;
  url: string;
  key: string;
  content: string;
  chords: string[];
}

export function useSearchSongsMock(query: string) {
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    let active = true;

    if (!query) {
      setTimeout(() => {
        setSongs([]);
        setLoading(false);
      }, 0);
      return;
    }

    setTimeout(() => {
      setLoading(true);
    }, 0);
    const timer = setTimeout(() => {
      if (!active) return;
      
      const filtered = MOCK_SONGS.filter(s => 
        s.title.toLowerCase().includes(query.toLowerCase()) || 
        s.artist.toLowerCase().includes(query.toLowerCase())
      );
      setSongs(filtered as Song[]);
      setLoading(false);
    }, 800);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return { songs, isLoading: loading };
}

export function useGetSongMock(url: string) {
  const [loading, setLoading] = useState(true);
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    let active = true;

    if (!url) {
      setTimeout(() => {
        setSong(null);
        setLoading(false);
      }, 0);
      return;
    }

    // Try cache first
    const cached = localStorage.getItem(`song:${url}`);
    if (cached) {
      setTimeout(() => {
        setSong(JSON.parse(cached));
        setLoading(false);
      }, 0);
      return;
    }

    setTimeout(() => {
      setLoading(true);
    }, 0);
    const timer = setTimeout(() => {
      if (!active) return;

      const found = MOCK_SONGS.find(s => s.url === url) || null;
      if (found) {
        setSong(found as Song);
        localStorage.setItem(`song:${url}`, JSON.stringify(found));
      } else {
        setSong(null);
      }
      setLoading(false);
    }, 1000);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [url]);

  return { song, isLoading: loading, isError: !loading && !song };
}
