import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axiosIns from '@/http/axios';
import { API } from '@/constants/back-end';

export type SongResponse = {
  title: string;
  artist: string;
  key: string;
  chords: string[];
  content: string;
  url: string;
};

type GetSongParams = {
  url: string;
  customQueryKey?: string[];
};

async function fetchGetSong(params: GetSongParams): Promise<SongResponse> {
  const response = await axiosIns.get<SongResponse>(API.SONGS.SONG, {
    params: { url: params.url },
  });

  return response.data;
}

export function useGetSongQuery(params: GetSongParams) {
  const { data, isLoading, isFetching, isError } = useQuery<SongResponse>({
    queryKey: [...(params.customQueryKey ?? []), API.SONGS.SONG, params.url].filter(Boolean),
    queryFn: async () => {
      return fetchGetSong(params);
    },
    enabled: !!params.url,
    placeholderData: keepPreviousData,
  });

  return {
    song: data,
    isLoading,
    isFetching,
    isError,
  };
}
