import { useState, useEffect } from "react";

export interface SetlistItem {
  id: number;
  setlist_id: number;
  title: string;
  artist: string;
  url: string;
  key: string;
  order: number;
}

export interface Setlist {
  id: number;
  title: string;
  user_id: number;
  public_id: string;
  is_public: boolean;
  songs: SetlistItem[];
}

const STORAGE_KEY = "harmoniq_mock_setlists";

const INITIAL_MOCK_SETLISTS: Setlist[] = [
  {
    id: 1,
    title: "Culto Domingo",
    user_id: 1,
    public_id: "culto-domingo-hash",
    is_public: true,
    songs: [
      { id: 1, setlist_id: 1, title: "Bondade de Deus", artist: "Isaías Saad", url: "https://www.cifraclub.com.br/isaias-saad/bondade-de-deus/", key: "G", order: 0 },
      { id: 2, setlist_id: 1, title: "Ousado Amor", artist: "Isaías Saad", url: "https://www.cifraclub.com.br/isaias-saad/ousado-amor/", key: "G", order: 1 },
      { id: 3, setlist_id: 1, title: "Lugar Secreto", artist: "Gabriela Rocha", url: "https://www.cifraclub.com.br/gabriela-rocha/lugar-secreto/", key: "G", order: 2 },
    ]
  }
];

function getStoredSetlists(): Setlist[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_SETLISTS;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : INITIAL_MOCK_SETLISTS;
}

function saveStoredSetlists(lists: Setlist[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

export function useSetlistsMock() {
  const [loading, setLoading] = useState(true);
  const [setlists, setSetlists] = useState<Setlist[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSetlists(getStoredSetlists());
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const createSetlist = (title: string) => {
    const newList: Setlist = {
      id: Date.now(),
      title,
      user_id: 1,
      public_id: Math.random().toString(36).substring(7),
      is_public: false,
      songs: []
    };
    const updated = [...setlists, newList];
    setSetlists(updated);
    saveStoredSetlists(updated);
    return newList;
  };

  const deleteSetlist = (id: number) => {
    const updated = setlists.filter(s => s.id !== id);
    setSetlists(updated);
    saveStoredSetlists(updated);
  };

  return { setlists, isLoading: loading, createSetlist, deleteSetlist };
}

export function useSetlistMock(id: string | number) {
  const [loading, setLoading] = useState(true);
  const [setlist, setSetlist] = useState<Setlist | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const lists = getStoredSetlists();
      const found = lists.find(s => s.id.toString() === id.toString()) || null;
      setSetlist(found);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  const addSong = (song: Omit<SetlistItem, 'id' | 'setlist_id' | 'order'>) => {
    const lists = getStoredSetlists();
    const listIndex = lists.findIndex(l => l.id.toString() === id.toString());
    if (listIndex === -1) return;

    const newItem: SetlistItem = {
      ...song,
      id: Date.now(),
      setlist_id: Number(id),
      order: lists[listIndex].songs.length
    };

    lists[listIndex].songs.push(newItem);
    saveStoredSetlists(lists);
    setSetlist({...lists[listIndex]});
  };

  const removeSong = (songId: number) => {
    const lists = getStoredSetlists();
    const listIndex = lists.findIndex(l => l.id.toString() === id.toString());
    if (listIndex === -1) return;

    lists[listIndex].songs = lists[listIndex].songs.filter(s => s.id !== songId);
    saveStoredSetlists(lists);
    setSetlist({...lists[listIndex]});
  };

  const togglePublic = () => {
    const lists = getStoredSetlists();
    const listIndex = lists.findIndex(l => l.id.toString() === id.toString());
    if (listIndex === -1) return;

    lists[listIndex].is_public = !lists[listIndex].is_public;
    saveStoredSetlists(lists);
    setSetlist({...lists[listIndex]});
  };

  return { setlist, isLoading: loading, addSong, removeSong, togglePublic };
}
