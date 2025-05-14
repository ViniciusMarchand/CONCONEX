import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { AsyncState } from "../Types/NavigatorTypes";

// useApiCall.ts
export function useApiCall<T>(apiFn: () => Promise<AxiosResponse<T>>, dependencies: any[] = []): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const execute = async () => {
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
    };

    execute();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
}