import { useQuery } from "react-query";

export const useDataFetch = (queryKey, fetchData, params) => {
  const { data, isLoading, error } = useQuery(
    [queryKey, ...params],
    () => fetchData(...params),
    {
      keepPreviousData: true,
      enabled: params.length > 0,
    }
  );

  return { data, isLoading, error };
};
