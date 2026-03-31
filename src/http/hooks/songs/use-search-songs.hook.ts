import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axiosIns from '@/http/axios';
import { API } from '@/constants/back-end';

export type SongSearchResponse = {
  url: string;
  title: string;
  artist: string;
};

type SearchSongsParams = {
  q: string;
  customQueryKey?: string[];
};

async function fetchSearchSongs(params: SearchSongsParams): Promise<SongSearchResponse[]> {
  const response = await axiosIns.get<SongSearchResponse[]>(API.SONGS.SEARCH, {
    params: { q: params.q },
  });

  return response.data;
}

export function useSearchSongsQuery(params: SearchSongsParams) {
  const { data, isLoading, isFetching, isError } = useQuery<SongSearchResponse[]>({
    queryKey: [...(params.customQueryKey ?? []), API.SONGS.SEARCH, params.q].filter(Boolean),
    queryFn: async () => {
      return fetchSearchSongs(params);
    },
    enabled: !!params.q,
    placeholderData: keepPreviousData,
  });

  return {
    songs: data,
    isLoading,
    isFetching,
    isError,
  };
}
