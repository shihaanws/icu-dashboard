import { useQuery } from "react-query";

export const useDataFetch = (queryKey, fetchData, params, isEnabled) => {
  const { data, isLoading, error } = useQuery(
    [queryKey, ...params],
    () => fetchData(...params),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: isEnabled, // Enable the query based on the provided condition
    }
  );

  return { data, isLoading, error };
};
