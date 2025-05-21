import { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import { AsyncState } from "../Types/NavigatorTypes";

export function useApiCall<T>(apiFn: () => Promise<AxiosResponse<T>>, dependencies: any[] = []): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null
  });

  const execute = useCallback(async (isMounted: boolean) => {
    try {
      const response = await apiFn();
      if (isMounted) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      if (isMounted) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error('API Error'),
        });
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    execute(isMounted);

    return () => {
      isMounted = false;
    };
  }, dependencies);


  return {...state, execute};
}